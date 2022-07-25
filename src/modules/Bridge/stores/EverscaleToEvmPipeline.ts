import BigNumber from 'bignumber.js'
import {
    computed, IReactionDisposer, makeObservable, reaction, toJS,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'
import type { DecodedAbiFunctionOutputs } from 'everscale-inpage-provider'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import Web3 from 'web3'

import { BridgeAbi, EthAbi, TokenWallet } from '@/misc'
import { BridgeUtils } from '@/misc/BridgeUtils'
import {
    alienProxyContract,
    ethereumTokenTransferProxyContract,
    everscaleEventAlienContract,
    everscaleEventConfigurationContract,
    everscaleEventNativeContract,
    everscaleTokenTransferProxyContract,
    getFullContractState,
    nativeProxyContract,
    tokenTransferEverscaleEventContract,
} from '@/misc/contracts'
import { evmBridgeContract, evmMultiVaultContract, evmVaultContract } from '@/misc/eth-contracts'
import { EverscaleToken, Pipeline } from '@/models'
import {
    DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA,
    DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import type {
    EventStateStatus,
    EverscaleTransferQueryParams,
    EverscaleTransferStoreData,
    EverscaleTransferStoreState,
} from '@/modules/Bridge/types'
import { handleLiquidityRequests } from '@/modules/LiquidityRequests'
import { BaseStore } from '@/stores/BaseStore'
import { BridgeAsset, BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import type { NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'


export class EverscaleToEvmPipeline extends BaseStore<EverscaleTransferStoreData, EverscaleTransferStoreState> {

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    protected pendingWithdrawalUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: EverscaleTransferQueryParams,
    ) {
        super()

        this.data = DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA
        this.state = DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE

        makeObservable<EverscaleToEvmPipeline>(this, {
            amount: computed,
            isInsufficientVaultBalance: computed,
            isEverscaleBasedToken: computed,
            isPendingWithdrawalSynced: computed,
            leftAddress: computed,
            rightAddress: computed,
            eventState: computed,
            prepareState: computed,
            releaseState: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            token: computed,
            contractAddress: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useBridgeAssets: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        this.#bridgeAssetsDisposer = reaction(() => this.bridgeAssets.isReady, async isReady => {
            if (isReady) {
                await this.checkContract(true)
            }
        }, { fireImmediately: true })
    }

    public dispose(): void {
        this.#bridgeAssetsDisposer?.()
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

            if (!state?.isDeployed) {
                setTimeout(async () => {
                    await this.checkContract(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingContract', false)
            }
        }
        catch (e) {
            error('Check contract error', e)
            this.setState('isCheckingContract', false)
            return
        }

        if (!this.state.isCheckingContract) {
            try {
                await this.resolve()
            }
            catch (e) {
                error('Resolve error', e)
            }
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
        const pipelineType = this.bridgeAssets.getPipelineType(proxyAddress.toString())

        if (pipelineType === 'multi_everscale_evm') {
            const eventData = await everscaleEventNativeContract(this.contractAddress)
                .methods.getDecodedData({ answerId: 0 })
                .call()

            const {
                chainId_: chainId,
                recipient_: ethereum_address,
                remainingGasTo_: owner_address,
                amount_: tokens,
                token_: tokenAddress,
            } = eventData

            let token = this.bridgeAssets.get(
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
                        this.bridgeAssets.add(token)
                    }

                }
                catch (e) {}
            }

            if (token === undefined) {
                return
            }

            const leftAddress = owner_address.toString()
            const rightAddress = `0x${new BigNumber(ethereum_address).toString(16).padStart(40, '0')}`

            this.setData({
                amount: tokens,
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
                    const pipeline = await this.bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        this.depositType,
                    )

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }
            }
            catch (e) {
                error(e)
            }

            this.runEventUpdater()
        }
        else if (pipelineType === 'multi_evm_everscale') {
            const eventData = await everscaleEventAlienContract(this.contractAddress)
                .methods.getDecodedData({ answerId: 0 })
                .call()

            const {
                recipient_: ethereum_address,
                remainingGasTo_: owner_address,
                amount_: tokens,
                base_chainId_: chainId,
            } = eventData
            let { token_: tokenAddress } = eventData

            const canonicalAddress = await BridgeUtils.getCanonicalToken(tokenAddress, proxyAddress)

            if (canonicalAddress !== undefined) {
                tokenAddress = canonicalAddress
            }

            let token = this.bridgeAssets.get(
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
                        this.bridgeAssets.add(token)
                    }
                }
                catch (e) {
                }
            }

            if (token === undefined) {
                return
            }

            const leftAddress = owner_address.toString()
            const rightAddress = `0x${new BigNumber(ethereum_address).toString(16).padStart(40, '0')}`

            this.setData({
                amount: tokens,
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
                    const pipeline = await this.bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        this.depositType,
                    )

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }
            }
            catch (e) {
                error(e)
            }
            this.runEventUpdater()
        }
        else {
            const eventData = await tokenTransferEverscaleEventContract(this.contractAddress)
                .methods.getDecodedData({ answerId: 0 })
                .call()

            const {
                chainId,
                ethereum_address,
                owner_address,
                tokens,
            } = eventData

            const tokenAddress = (await everscaleTokenTransferProxyContract(proxyAddress)
                .methods.getTokenRoot({ answerId: 0 })
                .call())
                .value0

            const token = this.bridgeAssets.get(
                this.leftNetwork.type,
                this.leftNetwork.chainId,
                tokenAddress.toString(),
            )

            if (token === undefined) {
                return
            }

            const leftAddress = owner_address.toString()
            const rightAddress = `0x${new BigNumber(ethereum_address).toString(16).padStart(40, '0')}`

            this.setData({
                amount: tokens,
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
                prepareState: {
                    status: 'confirmed',
                },
            })

            if (
                this.token?.root !== undefined
                && this.leftNetwork?.type !== undefined
                && this.leftNetwork?.chainId !== undefined
                && this.rightNetwork?.type !== undefined
                && this.rightNetwork?.chainId !== undefined
            ) {
                const pipeline = await this.bridgeAssets.pipeline(
                    this.token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    this.depositType,
                )

                this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
            }

            this.runEventUpdater()
        }
    }

    public async release(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.web3 === undefined
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
                tries += 1
                let r
                if (this.pipeline.isMultiVault) {
                    const vaultContract = new this.evmWallet.web3.eth.Contract(
                        EthAbi.MultiVault,
                        this.pipeline.vaultAddress,
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
                }
                else {
                    const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)
                    r = vaultContract.methods.saveWithdraw(
                        this.data.encodedEvent,
                        signatures.map(({ signature }) => signature),
                    )
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })

                    this.setState('releaseState', {
                        ...this.releaseState,
                        isInsufficientVaultBalance: this.isInsufficientVaultBalance,
                    } as EverscaleTransferStoreState['releaseState'])

                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
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
                        status: 'disabled',
                        // eslint-disable-next-line no-void
                        isInsufficientVaultBalance: void 0,
                    })
                    error('Release tokens error', e)
                }
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async forceClose(reject?: (e: any) => void): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.pipeline === undefined
                || this.evmWallet.web3 === undefined
            ) {
                return
            }

            const vaultContract = this.pipeline.isMultiVault
                ? new this.evmWallet.web3.eth.Contract(EthAbi.MultiVault, this.pipeline.vaultAddress)
                : new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)

            this.setState('releaseState', {
                ...this.releaseState,
                isPendingClosing: true,
            } as EverscaleTransferStoreState['releaseState'])

            try {
                tries += 1

                const r = vaultContract.methods.forceWithdraw([[this.rightAddress, this.pendingWithdrawalId]])
                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
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
                } as EverscaleTransferStoreState['releaseState'])
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async changeBounty(amount: string): Promise<void> {
        if (this.releaseState?.isSettingWithdrawBounty) {
            return
        }

        let tries = 0

        const send = async (transactionType?: string): Promise<boolean> => {
            if (
                tries >= 2
                || this.evmWallet.web3 === undefined
                || this.pipeline === undefined
                || this.data.pendingWithdrawalId === undefined
            ) {
                return false
            }

            try {
                tries += 1

                const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipeline.vaultAddress)

                const r = vaultContract.methods.setPendingWithdrawalBounty(this.data.pendingWithdrawalId, amount)

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this.evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this.evmWallet.address,
                        type: transactionType,
                        gas,
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
        } as EverscaleTransferStoreState['releaseState'])
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
        } as EverscaleTransferStoreState['releaseState'])
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
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

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

            const pipelineType = this.bridgeAssets.getPipelineType(this.pipeline.proxyAddress.toString())

            if (pipelineType === 'multi_everscale_evm') {
                const configs = (await nativeProxyContract(eventDetails._initializer)
                    .methods.getConfiguration({ answerId: 0 })
                    .call())
                    .value0

                this.pipeline.setData('everscaleConfiguration', configs.everscaleConfiguration)

                const eventConfigDetails = await everscaleEventConfigurationContract(configs.everscaleConfiguration)
                    .methods.getDetails({ answerId: 0 })
                    .call()

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

                this.setState('eventState', {
                    ...this.eventState,
                    roundNumber: parseInt(roundNumber, 10),
                } as EverscaleTransferStoreState['eventState'])

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
                    configurationWid: configs.everscaleConfiguration.toString().split(':')[0],
                    configurationAddress: `0x${configs.everscaleConfiguration.toString().split(':')[1]}`,
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
            else if (pipelineType === 'multi_evm_everscale') {
                const configs = (await alienProxyContract(eventDetails._initializer)
                    .methods.getConfiguration({ answerId: 0 })
                    .call())
                    .value0

                this.pipeline.setData('everscaleConfiguration', configs.everscaleConfiguration)

                const eventConfigDetails = await everscaleEventConfigurationContract(configs.everscaleConfiguration)
                    .methods.getDetails({ answerId: 0 })
                    .call()

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

                this.setState('eventState', {
                    ...this.eventState,
                    roundNumber: parseInt(roundNumber, 10),
                } as EverscaleTransferStoreState['eventState'])

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
                    configurationWid: configs.everscaleConfiguration.toString().split(':')[0],
                    configurationAddress: `0x${configs.everscaleConfiguration.toString().split(':')[1]}`,
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
            else {
                const proxyContract = this.isEverscaleBasedToken
                    ? everscaleTokenTransferProxyContract(eventDetails._initializer)
                    : ethereumTokenTransferProxyContract(eventDetails._initializer)

                const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

                const token = this.bridgeAssets.get(
                    this.leftNetwork.type,
                    this.leftNetwork.chainId,
                    tokenAddress.toString(),
                )

                if (token === undefined) {
                    return
                }

                const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

                if (this.isEverscaleBasedToken) {
                    this.pipeline.setData(
                        'everscaleConfiguration',
                        (proxyDetails as DecodedAbiFunctionOutputs<typeof BridgeAbi.EverscaleProxyTokenTransfer, 'getDetails'>)
                            ._config
                            .tonConfiguration,
                    )
                }
                else {
                    this.pipeline.setData(
                        'everscaleConfiguration',
                        (proxyDetails as DecodedAbiFunctionOutputs<typeof BridgeAbi.EthereumProxyTokenTransfer, 'getDetails'>)
                            .value0
                            .tonConfiguration,
                    )
                }

                if (this.pipeline.everscaleConfiguration === undefined) {
                    return
                }

                const eventConfigDetails = await everscaleEventConfigurationContract(
                    this.pipeline.everscaleConfiguration,
                ).methods.getDetails({ answerId: 0 }).call()
                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

                this.setState('eventState', {
                    ...this.eventState,
                    roundNumber: parseInt(roundNumber, 10),
                } as EverscaleTransferStoreState['eventState'])

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
                    configurationWid: this.pipeline.everscaleConfiguration.toString().split(':')[0],
                    configurationAddress: `0x${this.pipeline.everscaleConfiguration.toString().split(':')[1]}`,
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

                const vaultContract = this.pipeline.isMultiVault
                    ? evmMultiVaultContract(this.pipeline.vaultAddress, network.rpcUrl)
                    : evmVaultContract(this.pipeline.vaultAddress, network.rpcUrl)

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

                if (this.releaseState?.status === 'pending' && firstIteration) {
                    const status = isReleased ? 'confirmed' : 'disabled'
                    this.setState('releaseState', {
                        isReleased,
                        status: this.releaseState.isInsufficientVaultBalance ? 'pending' : status,
                        ttl: (!isReleased && ttl !== undefined) ? parseInt(ttl, 10) : undefined,
                    })
                }

                const insufficientVaultBalance = this.releaseState?.isInsufficientVaultBalance

                if (isReleased) {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        isReleased: true,
                        isPendingWithdrawal: true,
                        status: 'pending',
                    } as EverscaleTransferStoreState['releaseState'])
                    await this.runPendingWithdrawalUpdater(insufficientVaultBalance ? 20 : undefined)
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

        let tries = 0

        const runPendingWithdrawalUpdater = async () => {
            debug('runPendingWithdrawalUpdater', toJS(this.data), toJS(this.state))

            tries += 1

            await this.syncVaultBalance()
            await this.syncPendingWithdrawal()

            const isClosed = this.pendingWithdrawalStatus === 'Close'
                || (this.pendingWithdrawalId === undefined && tries === triesCount)

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
            if (this.pipeline.isMerged || (!this.pipeline.isMultiVault && !this.isEverscaleBasedToken)) {
                const vaultBalance = await BridgeUtils.getEvmTokenBalance(
                    this.pipeline.evmTokenAddress,
                    this.pipeline.vaultAddress,
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
                limit: 1,
                offset: 0,
                ordering: 'createdatdescending',
                contractAddress: this.contractAddress.toString(),
            })
            if (transfers.length > 0) {
                this.setData({
                    pendingWithdrawalBounty: transfers[0].bounty,
                    pendingWithdrawalStatus: transfers[0].status,
                    pendingWithdrawalId: transfers[0].userId,
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

    public get amount(): EverscaleTransferStoreData['amount'] {
        return this.data.amount
    }

    public get pipeline(): EverscaleTransferStoreData['pipeline'] {
        return this.data.pipeline
    }

    public get leftAddress(): EverscaleTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): EverscaleTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get eventState(): EverscaleTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): EverscaleTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get releaseState(): EverscaleTransferStoreState['releaseState'] {
        return this.state.releaseState
    }

    public get depositType(): EverscaleTransferQueryParams['depositType'] {
        return this.params?.depositType
    }

    public get pendingWithdrawalId(): EverscaleTransferStoreData['pendingWithdrawalId'] {
        return this.data.pendingWithdrawalId
    }

    public get pendingWithdrawalStatus(): EverscaleTransferStoreData['pendingWithdrawalStatus'] {
        return this.data.pendingWithdrawalStatus
    }

    public get bounty(): EverscaleTransferStoreData['pendingWithdrawalBounty'] {
        return this.data.pendingWithdrawalBounty
    }

    /**
     * Returns non-shifted amount field BigNumber instance
     */
    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get withdrawFee(): string {
        if (this.pipeline?.isMultiVault) {
            return this.amountNumber
                .times(this.pipeline?.withdrawFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.token?.decimals || 0))
                .toFixed()
        }
        return '0'
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
            .lt(this.amountNumber.shiftedBy(-(this.token?.decimals ?? 0)))
    }

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'everscale'
    }

    public get isPendingWithdrawalSynced(): boolean {
        return this.state.isPendingWithdrawalSynced === true
    }

    public get evmTokenDecimals(): number | undefined {
        return this.pipeline?.evmTokenDecimals
    }

    public get token(): BridgeAsset | undefined {
        return this.data.token
    }

    public get contractAddress(): Address | undefined {
        return this.params?.contractAddress !== undefined
            ? new Address(this.params.contractAddress)
            : undefined
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useBridgeAssets(): BridgeAssetsService {
        return this.bridgeAssets
    }

    #bridgeAssetsDisposer: IReactionDisposer | undefined

}
