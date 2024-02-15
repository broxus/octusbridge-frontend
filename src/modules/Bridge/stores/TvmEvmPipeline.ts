import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import { Address, type DecodedAbiFunctionOutputs } from 'everscale-inpage-provider'
import { type IReactionDisposer, computed, makeObservable, reaction, toJS } from 'mobx'
import Web3 from 'web3'

import { EventClosers, Unwrapper } from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { EthAbi, type MultiVaultAbi, TokenWallet } from '@/misc'
import { BridgeUtils } from '@/misc/BridgeUtils'
import {
    everscaleEventAlienContract,
    everscaleEventConfigurationContract,
    everscaleEventNativeContract,
    getFullContractState,
    legacyEverscaleEventAlienContract,
    legacyEverscaleEventNativeContract,
    tokenTransferEverscaleEventContract,
    tokenWalletContract,
} from '@/misc/contracts'
import { evmBridgeContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import { EverscaleToken, Pipeline } from '@/models'
import {
    type EventStateStatus,
    type PendingWithdrawalStatus,
    type PrepareStateStatus,
    type ReleaseStateStatus,
    type TvmTransferUrlParams,
} from '@/modules/Bridge/types'
import { handleLiquidityRequests } from '@/modules/LiquidityRequests'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'

export type TvmEvmPipelineData = {
    amount: string;
    chainId?: string;
    encodedEvent?: string;
    leftAddress?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    token?: BridgeAsset;
    withdrawalId?: string;
    pendingWithdrawalId?: string;
    pendingWithdrawalStatus?: PendingWithdrawalStatus;
    pendingWithdrawalBounty?: string;
}

export type TvmEvmPipelineState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        roundNumber?: number;
        status: EventStateStatus;
        timestamp?: number;
    };
    isCheckingContract: boolean;
    isMultiVaultCredit?: boolean;
    isPendingWithdrawalSynced?: boolean;
    prepareState?: {
        errorMessage?: string;
        status: PrepareStateStatus;
    };
    releaseState?: {
        errorMessage?: string;
        isInsufficientVaultBalance?: boolean;
        isOutdated?: boolean;
        isPendingClosing?: boolean;
        isPendingWithdrawal?: boolean;
        isReleased?: boolean;
        isReleasing?: boolean;
        isSettingWithdrawBounty?: boolean;
        status: ReleaseStateStatus;
        ttl?: number;
    };
}

const eventClosers = EventClosers.map(addr => addr.toString().toLowerCase())

export class TvmEvmPipeline extends BaseStore<TvmEvmPipelineData, TvmEvmPipelineState> {

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    protected pendingWithdrawalUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly _tvmWallet: EverWalletService,
        protected readonly _evmWallet: EvmWalletService,
        protected readonly _bridgeAssets: BridgeAssetsService,
        protected readonly params?: TvmTransferUrlParams,
    ) {
        super()

        this.setData(() => ({ amount: '' }))
        this.setState(() => ({ isCheckingContract: false }))

        makeObservable(this, {
            amount: computed,
            bridgeAssets: computed,
            contractAddress: computed,
            eventState: computed,
            evmWallet: computed,
            isInsufficientVaultBalance: computed,
            isMultiVaultCredit: computed,
            isPendingWithdrawalSynced: computed,
            isTvmBasedToken: computed,
            leftAddress: computed,
            leftNetwork: computed,
            pipeline: computed,
            prepareState: computed,
            releaseState: computed,
            rightAddress: computed,
            rightNetwork: computed,
            success: computed,
            token: computed,
            tvmWallet: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        this.bridgeAssetsDisposer = reaction(() => this._bridgeAssets.isReady, async isReady => {
            if (isReady) {
                await this.checkContract(true)
            }
        }, { fireImmediately: true })
    }

    public dispose(): void {
        this.bridgeAssetsDisposer?.()
        this.stopEventUpdater()
        this.stopReleaseUpdater()
        this.stopPendingWithdrawalUpdater()
    }

    public async checkContract(force: boolean = false): Promise<void> {
        if (this.contractAddress === undefined || (this.state.isCheckingContract && !force)) {
            return
        }

        this.setState({
            isCheckingContract: true,
            prepareState: {
                status: this.prepareState?.status || 'pending',
            },
        })

        try {
            const state = await getFullContractState(this.contractAddress)

            if (state?.isDeployed) {
                await this.resolve()
                this.setState('isCheckingContract', false)
            }
            else {
                setTimeout(async () => {
                    await this.checkContract(true)
                }, 5000)
            }
        }
        catch (e) {
            error('Check contract error', e)
            this.setState('isCheckingContract', false)
        }
    }

    public async resolve(): Promise<void> {
        if (this.contractAddress === undefined || this.leftNetwork === undefined) {
            return
        }

        const eventDetails = await tokenTransferEverscaleEventContract(this.contractAddress)
            .methods.getDetails({ answerId: 0 })
            .call()

        const proxyAddress = (await everscaleEventConfigurationContract(eventDetails._eventInitData.configuration)
            .methods.getDetails({ answerId: 0 })
            .call())
            ._networkConfiguration
            .eventEmitter
        const pipelineType = this._bridgeAssets.getPipelineType(proxyAddress.toString())

        // Native transfer
        if (pipelineType === 'multi_tvm_evm') {
            let eventData: any

            try {
                eventData = await everscaleEventNativeContract(this.contractAddress)
                    .methods.getDecodedData({ answerId: 0 })
                    .call()
            }
            catch (e) {
                eventData = await legacyEverscaleEventNativeContract(this.contractAddress)
                    .methods.getDecodedData({ answerId: 0 })
                    .call()
                debug('Using legacy everscale event native contract')
            }

            const {
                chainId_: chainId,
                recipient_: ethereumAddress,
                remainingGasTo_: ownerAddress,
                amount_: tokens,
                token_: tokenAddress,
                callback,
            } = eventData

            let token = this._bridgeAssets.get(
                this.leftNetwork.type,
                this.leftNetwork.chainId,
                tokenAddress.toString(),
            )

            if (token === undefined) {
                try {
                    const data = await TokenWallet.getTokenFullDetails(tokenAddress.toString())

                    if (data !== undefined) {
                        token = new EverscaleToken({
                            address: tokenAddress,
                            chainId: this.leftNetwork.chainId,
                            decimals: data.decimals,
                            key: `${this.leftNetwork.type}-${this.leftNetwork.chainId}-${tokenAddress.toString()}`,
                            name: data.name,
                            root: tokenAddress.toString(),
                            symbol: data.symbol,
                        })
                        this._bridgeAssets.add(token)
                    }

                }
                catch (e) {}
            }

            if (token === undefined) {
                return
            }

            let leftAddress = ownerAddress.toString(),
                rightAddress = `0x${new BigNumber(ethereumAddress).toString(16).padStart(40, '0')}`
            const remainingGasTo = eventData.remainingGasTo_.toString().toLowerCase()

            if (eventClosers.includes(leftAddress.toLowerCase())) {
                try {
                    const sender = await everscaleEventNativeContract(this.contractAddress)
                        .methods.sender()
                        .call()
                        .then(r => r.sender)
                    leftAddress = sender.toString()
                    try {
                        const owner = await tokenWalletContract(sender, staticRpc)
                            .methods.owner({ answerId: 0 })
                            .call()
                            .then(r => r.value0)
                        leftAddress = owner.toString()
                    }
                    catch {}
                }
                catch (e) {
                    error(e)
                }
            }

            if (rightAddress.toLowerCase() === Unwrapper.toLowerCase()) {
                rightAddress = `0x${BigNumber(
                    `0x${Buffer.from(callback.payload, 'base64').toString('hex')}`,
                ).toString(16)}`
            }

            this.setData({
                amount: new BigNumber(tokens || 0).shiftedBy(-token.decimals).toFixed(),
                chainId,
                leftAddress: leftAddress.toLowerCase(),
                rightAddress: rightAddress.toLowerCase(),
                token,
            })

            this.setState({
                eventState: {
                    confirmations: this.eventState?.confirmations || 0,
                    requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                    status: this.eventState?.status || 'pending',
                },
                isMultiVaultCredit: eventClosers.includes(remainingGasTo),
                prepareState: {
                    status: 'confirmed',
                },
            })

            try {
                if (
                    this.token?.root !== undefined
                    && this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this._bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    )

                    const evmTokenAddress = pipeline?.evmTokenAddress

                    if (
                        pipeline !== undefined
                        && evmTokenAddress !== undefined
                        && pipeline?.vaultAddress !== undefined
                    ) {
                        try {
                            const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                                pipeline.vaultAddress.toString(),
                                evmTokenAddress,
                                this.rightNetwork.rpcUrl,
                            )
                            if (meta.custom !== '0x0000000000000000000000000000000000000000') {
                                pipeline.evmTokenAddress = meta.custom
                            }
                        }
                        catch (e) {}
                    }

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }
            }
            catch (e) {
                error(e)
            }

            this.runEventUpdater()
        }
        // Alien transfer
        else if (pipelineType === 'multi_evm_tvm') {
            let eventData: DecodedAbiFunctionOutputs<typeof MultiVaultAbi.EverscaleEVMEventAlien, 'getDecodedData'> | any

            try {
                eventData = await everscaleEventAlienContract(this.contractAddress)
                    .methods.getDecodedData({ answerId: 0 })
                    .call()
            }
            catch (e) {
                eventData = await legacyEverscaleEventAlienContract(this.contractAddress)
                    .methods.getDecodedData({ answerId: 0 })
                    .call()
                debug('Using legacy everscale event alien contract')
            }

            const {
                recipient_: ethereumAddress,
                remainingGasTo_: ownerAddress,
                amount_: tokens,
                base_chainId_: chainId,
                callback,
            } = eventData
            const { token_: eventTokenAddress } = eventData

            let tokenAddress = eventTokenAddress
            const canonicalAddress = await BridgeUtils.getCanonicalToken(tokenAddress, proxyAddress)

            if (canonicalAddress !== undefined) {
                tokenAddress = canonicalAddress
            }

            let token = this._bridgeAssets.get(
                this.leftNetwork.type,
                this.leftNetwork.chainId,
                tokenAddress.toString(),
            )

            if (token === undefined) {
                try {
                    const data = await TokenWallet.getTokenFullDetails(tokenAddress.toString())

                    if (data !== undefined) {
                        token = new EverscaleToken({
                            address: tokenAddress,
                            chainId: this.leftNetwork.chainId,
                            decimals: data.decimals,
                            key: `${this.leftNetwork.type}-${this.leftNetwork.chainId}-${tokenAddress.toString()}`,
                            name: data.name,
                            root: tokenAddress.toString(),
                            symbol: data.symbol,
                        })
                        this._bridgeAssets.add(token)
                    }
                }
                catch (e) {
                }
            }

            if (token === undefined) {
                return
            }

            if (canonicalAddress !== undefined) {
                const decimals = await TokenWallet.getDecimals(eventTokenAddress)
                if (decimals !== undefined) {
                    // @ts-ignore
                    token.setData('decimals', decimals)
                }
            }

            let leftAddress = ownerAddress.toString(),
                rightAddress = `0x${new BigNumber(ethereumAddress).toString(16).padStart(40, '0')}`
            const remainingGasTo = eventData.remainingGasTo_.toString().toLowerCase()

            if (eventClosers.includes(leftAddress.toLowerCase())) {
                try {
                    const sender = await everscaleEventAlienContract(this.contractAddress)
                        .methods.sender()
                        .call()
                        .then(r => r.sender)
                    leftAddress = sender.toString()
                    try {
                        const owner = await tokenWalletContract(sender, staticRpc)
                            .methods.owner({ answerId: 0 })
                            .call()
                            .then(r => r.value0)
                        leftAddress = owner.toString()
                    }
                    catch {}
                }
                catch (e) {
                    error(e)
                }
            }

            if (rightAddress.toLowerCase() === Unwrapper.toLowerCase()) {
                rightAddress = `0x${BigNumber(
                    `0x${Buffer.from(callback.payload, 'base64').toString('hex')}`,
                ).toString(16)}`
            }

            this.setData({
                amount: new BigNumber(tokens || 0).shiftedBy(-token.decimals).toFixed(),
                chainId,
                leftAddress: leftAddress.toLowerCase(),
                rightAddress: rightAddress.toLowerCase(),
                token,
            })

            this.setState({
                eventState: {
                    confirmations: this.eventState?.confirmations || 0,
                    requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                    status: this.eventState?.status || 'pending',
                },
                isMultiVaultCredit: eventClosers.includes(remainingGasTo),
                prepareState: {
                    status: 'confirmed',
                },
            })

            try {
                if (
                    this.token?.root !== undefined
                    && this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this._bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    )

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }
            }
            catch (e) {
                error(e)
            }
            this.runEventUpdater()
        }
    }

    public async release(): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this._evmWallet.web3 === undefined
                || this.leftNetwork === undefined
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.pipeline === undefined
                || this.token === undefined
                || this.data.encodedEvent === undefined
            ) {
                return
            }

            this.setState('releaseState', {
                ...this.releaseState,
                isReleasing: true,
                status: 'pending',
            })

            const eventDetails = await tokenTransferEverscaleEventContract(this.contractAddress)
                .methods.getDetails({ answerId: 0 })
                .call()
            const signatures = eventDetails._signatures.map(sign => {
                const signature = `0x${Buffer.from(sign, 'base64').toString('hex')}`
                const address = this.web3.eth.accounts.recover(
                    this.web3.utils.sha3(this.data.encodedEvent as string) as string,
                    signature,
                )
                return {
                    address,
                    order: new BigNumber(address.slice(2).toUpperCase(), 16),
                    signature,
                }
            })

            signatures.sort((a, b) => {
                if (a.order.eq(b.order)) {
                    return 0
                }

                if (a.order.gt(b.order)) {
                    return 1
                }

                return -1
            })

            try {
                attempts += 1
                let r
                const vaultContract = new this._evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )
                if (this.pipeline.isNative) {
                    r = vaultContract?.methods.saveWithdrawNative(
                        this.data.encodedEvent,
                        signatures.map(({ signature }) => signature),
                    )
                }
                else {
                    r = vaultContract?.methods.saveWithdrawAlien(
                        this.data.encodedEvent,
                        signatures.map(({ signature }) => signature),
                    )
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })

                    this.setState('releaseState', {
                        ...this.releaseState,
                        isInsufficientVaultBalance: this.isInsufficientVaultBalance,
                    } as TvmEvmPipelineState['releaseState'])

                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Release tokens error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        // eslint-disable-next-line no-void
                        isInsufficientVaultBalance: void 0,
                        status: 'disabled',
                    })
                    error('Release tokens error', e)
                }
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async forceClose(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.pipeline === undefined
                || this._evmWallet.web3 === undefined
            ) {
                return
            }

            const vaultContract = new this._evmWallet.web3.eth.Contract(
                EthAbi.MultiVault,
                this.pipeline.vaultAddress.toString(),
            )

            this.setState('releaseState', {
                ...this.releaseState,
                isPendingClosing: true,
            } as TvmEvmPipelineState['releaseState'])

            try {
                attempts += 1

                const r = vaultContract.methods.forceWithdraw([[this.rightAddress, this.pendingWithdrawalId]])
                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer deposit to factory error', e)
                }
            }
            finally {
                this.setState('releaseState', {
                    ...this.releaseState,
                    isPendingClosing: false,
                } as TvmEvmPipelineState['releaseState'])
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async changeBounty(amount: string): Promise<void> {
        if (this.releaseState?.isSettingWithdrawBounty) {
            return
        }

        let attempts = 0

        const send = async (transactionType?: string): Promise<boolean> => {
            if (
                attempts >= 2
                || this._evmWallet.web3 === undefined
                || this.pipeline === undefined
                || this.data.pendingWithdrawalId === undefined
            ) {
                return false
            }

            try {
                attempts += 1

                const vaultContract = new this._evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.pipeline.vaultAddress.toString(),
                )

                const r = vaultContract.methods.setPendingWithdrawalBounty(this.data.pendingWithdrawalId, amount)

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }

                return true
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Set bounty error. Try with transaction type 0x0', e)
                    return send('0x0')
                }
                error('Release tokens error', e)
                return false
            }
        }

        this.setState('releaseState', {
            ...this.releaseState,
            isSettingWithdrawBounty: true,
        } as TvmEvmPipelineState['releaseState'])
        const success = await send(this.rightNetwork?.transactionType)

        if (success) {
            while (this.data.pendingWithdrawalBounty !== amount) {
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        this.setState('releaseState', {
            ...this.releaseState,
            isSettingWithdrawBounty: false,
        } as TvmEvmPipelineState['releaseState'])
    }

    protected runEventUpdater(): void {
        debug('runEventUpdater', toJS(this.data), toJS(this.state))

        this.stopEventUpdater();

        (async () => {
            if (
                this.contractAddress === undefined
                || this.pipeline === undefined
                || this.leftNetwork === undefined
            ) {
                return
            }

            const eventContract = tokenTransferEverscaleEventContract(this.contractAddress)
            const eventContractState = await getFullContractState(this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call({
                cachedState: eventContractState,
            })

            let status: EventStateStatus = 'pending'

            if (eventDetails._status === '2') {
                status = 'confirmed'
            }
            else if (eventDetails._status === '3') {
                status = 'rejected'
            }

            this.setState('eventState', {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status,
            })

            if (status !== 'confirmed') {
                return
            }

            if (this.data.withdrawalId === undefined || this.data.encodedEvent === undefined) {
                this.setState('releaseState', {
                    status: 'pending',
                })
            }

            const pipelineType = this._bridgeAssets.getPipelineType(this.pipeline.proxyAddress.toString())

            if (pipelineType === 'multi_tvm_evm') {
                const everscaleConfiguration = eventDetails._eventInitData.configuration
                this.pipeline.setData('everscaleConfiguration', everscaleConfiguration)

                const everscaleEventConfigurationContractState = await getFullContractState(everscaleConfiguration)

                const [eventConfigDetails, flags] = await Promise.all([
                    everscaleEventConfigurationContract(everscaleConfiguration)
                        .methods.getDetails({ answerId: 0 })
                        .call({ cachedState: everscaleEventConfigurationContractState }),
                    (await everscaleEventConfigurationContract(everscaleConfiguration)
                        .methods.getFlags({ answerId: 0 })
                        .call({ cachedState: everscaleEventConfigurationContractState })
                        .catch(() => ({ _flags: '0' })))._flags,
                ])

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                    flags,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call({
                    cachedState: eventContractState,
                })).round_number

                this.setState('eventState', {
                    ...this.eventState,
                    roundNumber: parseInt(roundNumber, 10),
                    timestamp: Number(eventDetails._eventInitData.voteData.eventTimestamp),
                } as TvmEvmPipelineState['eventState'])

                /* eslint-disable sort-keys */
                const encodedEvent = this.web3.eth.abi.encodeParameters([{
                    TONEvent: {
                        eventTransactionLt: 'uint64',
                        eventTimestamp: 'uint32',
                        eventData: 'bytes',
                        configurationWid: 'int8',
                        configurationAddress: 'uint256',
                        eventContractWid: 'int8',
                        eventContractAddress: 'uint256',
                        proxy: 'address',
                        round: 'uint32',
                    },
                }], [{
                    eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
                    eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
                    eventData: eventDataEncoded,
                    configurationWid: everscaleConfiguration.toString().split(':')[0],
                    configurationAddress: `0x${everscaleConfiguration.toString().split(':')[1]}`,
                    eventContractWid: this.contractAddress.toString().split(':')[0],
                    eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                    proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                    round: roundNumber,
                }])
                const withdrawalId = this.web3.utils.keccak256(encodedEvent)

                this.setData({
                    encodedEvent,
                    withdrawalId,
                })

                if (this.eventState?.status === 'confirmed') {
                    this.runReleaseUpdater()
                }
            }
            else if (pipelineType === 'multi_evm_tvm') {
                const everscaleConfiguration = eventDetails._eventInitData.configuration
                this.pipeline.setData('everscaleConfiguration', everscaleConfiguration)

                const everscaleEventConfigurationContractState = await getFullContractState(everscaleConfiguration)

                const [eventConfigDetails, flags] = await Promise.all([
                    everscaleEventConfigurationContract(everscaleConfiguration)
                        .methods.getDetails({ answerId: 0 })
                        .call({ cachedState: everscaleEventConfigurationContractState }),
                    (await everscaleEventConfigurationContract(everscaleConfiguration)
                        .methods.getFlags({ answerId: 0 })
                        .call({ cachedState: everscaleEventConfigurationContractState })
                        .catch(() => ({ _flags: '0' })))._flags,
                ])

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                    flags,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

                this.setState('eventState', {
                    ...this.eventState,
                    roundNumber: parseInt(roundNumber, 10),
                    timestamp: Number(eventDetails._eventInitData.voteData.eventTimestamp),
                } as TvmEvmPipelineState['eventState'])

                const encodedEvent = this.web3.eth.abi.encodeParameters([{
                    TONEvent: {
                        eventTransactionLt: 'uint64',
                        eventTimestamp: 'uint32',
                        eventData: 'bytes',
                        configurationWid: 'int8',
                        configurationAddress: 'uint256',
                        eventContractWid: 'int8',
                        eventContractAddress: 'uint256',
                        proxy: 'address',
                        round: 'uint32',
                    },
                }], [{
                    eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
                    eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
                    eventData: eventDataEncoded,
                    configurationWid: everscaleConfiguration.toString().split(':')[0],
                    configurationAddress: `0x${everscaleConfiguration.toString().split(':')[1]}`,
                    eventContractWid: this.contractAddress.toString().split(':')[0],
                    eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                    proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                    round: roundNumber,
                }])
                const withdrawalId = this.web3.utils.keccak256(encodedEvent)

                this.setData({
                    encodedEvent,
                    withdrawalId,
                })

                if (this.eventState?.status === 'confirmed') {
                    this.runReleaseUpdater()
                }
            }
        })().finally(() => {
            if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                this.eventUpdater = setTimeout(() => {
                    this.runEventUpdater()
                }, 5000)
            }
        })
    }

    protected stopEventUpdater(): void {
        if (this.eventUpdater !== undefined) {
            clearTimeout(this.eventUpdater)
            this.eventUpdater = undefined
        }
    }

    protected runReleaseUpdater(): void {
        debug('runReleaseUpdater', toJS(this.data), toJS(this.state))

        this.stopReleaseUpdater();

        (async () => {
            if (
                this.data.withdrawalId !== undefined
                && this.token !== undefined
                && this.pipeline !== undefined
                && this.rightNetwork !== undefined
            ) {
                const network = findNetwork(this.pipeline.chainId, 'evm')

                if (network === undefined) {
                    return
                }

                const vaultContract = evmMultiVaultContract(
                    this.pipeline.vaultAddress.toString(),
                    network.rpcUrl,
                )

                await this.syncVaultBalance()

                let ttl: string | undefined

                if (typeof this.eventState?.roundNumber === 'number') {
                    const bridgeAddress = await vaultContract.methods.bridge().call()

                    ttl = (await evmBridgeContract(bridgeAddress, network.rpcUrl)
                        .methods.rounds(this.eventState.roundNumber)
                        .call())
                        .ttl
                }

                const firstIteration = this.releaseState?.isReleased === undefined
                const isReleased = await vaultContract.methods.withdrawalIds(this.data.withdrawalId).call()
                const timestamp = ((Date.now() / 1000) - (this.eventState?.timestamp ?? 0))
                const isInsufficientVaultBalance = (
                    this.releaseState?.isInsufficientVaultBalance
                    || this.isInsufficientVaultBalance
                )
                const isOutdated = timestamp >= 600
                const shouldCheckPendingWithdrawals = (
                    timestamp < 120
                    || isInsufficientVaultBalance
                ) && (
                    !this.isTvmBasedToken
                    || !this.pipeline.isNative
                )

                if (this.releaseState?.status === 'pending' && firstIteration && !this.isMultiVaultCredit) {
                    const status = isReleased ? 'confirmed' : 'disabled'
                    this.setState('releaseState', {
                        isOutdated: isReleased ? undefined : isOutdated,
                        isReleased,
                        status,
                        ttl: (!isReleased && ttl !== undefined) ? parseInt(ttl, 10) : undefined,
                    })
                }

                if (isReleased) {
                    this.setState('releaseState', {
                        isPendingWithdrawal: shouldCheckPendingWithdrawals,
                        isReleased: !shouldCheckPendingWithdrawals,
                        status: shouldCheckPendingWithdrawals ? 'pending' : 'confirmed',
                    })
                    if (shouldCheckPendingWithdrawals) {
                        await this.runPendingWithdrawalUpdater(isInsufficientVaultBalance ? 30 : 5)
                    }
                    else {
                        await this.runPendingWithdrawalUpdater(1)
                    }
                }
                else if (isOutdated && !this.releaseState?.isReleasing) {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        isOutdated: isReleased ? undefined : isOutdated,
                        isReleased: false,
                        status: 'disabled',
                    })
                }
            }
        })().finally(() => {
            if (
                this.releaseState?.status !== 'confirmed'
                && this.releaseState?.status !== 'rejected'
                && !this.releaseState?.isPendingWithdrawal
            ) {
                this.releaseUpdater = setTimeout(() => {
                    this.runReleaseUpdater()
                }, 5000)
            }
        })
    }

    protected stopReleaseUpdater(): void {
        if (this.releaseUpdater !== undefined) {
            clearTimeout(this.releaseUpdater)
            this.releaseUpdater = undefined
        }
    }

    protected async runPendingWithdrawalUpdater(triesCount: number = 2): Promise<void> {
        this.stopPendingWithdrawalUpdater()

        let attempts = 0

        this.setState('releaseState', {
            ...this.releaseState,
            isPendingWithdrawal: true,
            status: 'pending',
        })

        const runPendingWithdrawalUpdater = async (): Promise<void> => {
            debug('runPendingWithdrawalUpdater', toJS(this.data), toJS(this.state))

            attempts += 1

            await this.syncVaultBalance()
            await this.syncPendingWithdrawal()

            const isClosed = this.pendingWithdrawalStatus === 'Close'
                || (this.pendingWithdrawalId === undefined && attempts === triesCount)

            this.setState('releaseState', {
                ...this.releaseState,
                isPendingWithdrawal: !isClosed,
                status: isClosed ? 'confirmed' : 'pending',
            })

            if (!isClosed || this.pendingWithdrawalStatus === 'Open') {
                this.pendingWithdrawalUpdater = setTimeout(async () => {
                    await runPendingWithdrawalUpdater()
                }, 3000)
            }
        }

        await runPendingWithdrawalUpdater()
    }

    protected stopPendingWithdrawalUpdater(): void {
        if (this.pendingWithdrawalUpdater !== undefined) {
            clearTimeout(this.pendingWithdrawalUpdater)
            this.pendingWithdrawalUpdater = undefined
        }
    }

    protected async syncVaultBalance(): Promise<void> {
        if (this.pipeline === undefined) {
            return
        }

        const network = findNetwork(this.pipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        if (this.pipeline.evmTokenAddress !== undefined) {
            if (this.pipeline.isMerged || !this.isTvmBasedToken) {
                const vaultBalance = await BridgeUtils.getEvmTokenBalance(
                    this.pipeline.evmTokenAddress,
                    this.pipeline.vaultAddress.toString(),
                    network.rpcUrl,
                )
                this.pipeline.setData('vaultBalance', vaultBalance)
            }
        }
    }

    protected async syncPendingWithdrawal(): Promise<void> {
        if (!this.contractAddress) {
            return
        }

        try {
            const { transfers } = await handleLiquidityRequests({
                contractAddress: this.contractAddress.toString(),
                limit: 1,
                offset: 0,
                ordering: 'createdatdescending',
            })
            if (transfers.length > 0) {
                this.setData({
                    pendingWithdrawalBounty: transfers[0].bounty,
                    pendingWithdrawalId: transfers[0].userId,
                    pendingWithdrawalStatus: transfers[0].status,
                })
            }
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setState('isPendingWithdrawalSynced', true)
        }
    }

    protected get web3(): Web3 {
        const network = findNetwork(this.rightNetwork?.chainId as string, 'evm')
        return new Web3(network?.rpcUrl as string)
    }

    public get amount(): TvmEvmPipelineData['amount'] {
        return this.data.amount
    }

    public get pipeline(): TvmEvmPipelineData['pipeline'] {
        return this.data.pipeline
    }

    public get leftAddress(): TvmEvmPipelineData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): TvmEvmPipelineData['rightAddress'] {
        return this.data.rightAddress
    }

    public get pendingWithdrawalId(): TvmEvmPipelineData['pendingWithdrawalId'] {
        return this.data.pendingWithdrawalId
    }

    public get pendingWithdrawalStatus(): TvmEvmPipelineData['pendingWithdrawalStatus'] {
        return this.data.pendingWithdrawalStatus
    }

    public get bounty(): TvmEvmPipelineData['pendingWithdrawalBounty'] {
        return this.data.pendingWithdrawalBounty
    }

    public get isMultiVaultCredit(): TvmEvmPipelineState['isMultiVaultCredit'] {
        return this.state.isMultiVaultCredit
    }

    public get isPendingWithdrawalSynced(): TvmEvmPipelineState['isPendingWithdrawalSynced'] {
        return this.state.isPendingWithdrawalSynced === true
    }

    public get eventState(): TvmEvmPipelineState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): TvmEvmPipelineState['prepareState'] {
        return this.state.prepareState
    }

    public get releaseState(): TvmEvmPipelineState['releaseState'] {
        return this.state.releaseState
    }

    public get success(): boolean {
        return this.releaseState?.status === 'confirmed'
    }

    /**
     * Returns non-shifted amount field BigNumber instance
     */
    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get withdrawFee(): string {
        return this.amountNumber
            .shiftedBy(this.token?.decimals ?? 0)
            .times(this.pipeline?.withdrawFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-(this.token?.decimals || 0))
            .toFixed()
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType)
    }

    public get rightNetwork(): NetworkShape | undefined {
        if (this.params?.toId === undefined || this.params?.toType === undefined) {
            return undefined
        }
        return findNetwork(this.params.toId, this.params.toType)
    }

    public get isInsufficientVaultBalance(): boolean {
        return new BigNumber(this.pipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber
                .shiftedBy(this.token?.decimals ?? 0)
                .shiftedBy(-(this.token?.decimals ?? 0)))
    }

    public get isTvmBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get token(): BridgeAsset | undefined {
        return this.data.token
    }

    public get contractAddress(): Address | undefined {
        return this.params?.contractAddress !== undefined
            ? new Address(this.params.contractAddress)
            : undefined
    }

    public get bridgeAssets(): BridgeAssetsService {
        return this._bridgeAssets
    }

    public get evmWallet(): EvmWalletService {
        return this._evmWallet
    }

    public get tvmWallet(): EverWalletService {
        return this._tvmWallet
    }

    protected bridgeAssetsDisposer: IReactionDisposer | undefined

}
