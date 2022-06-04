import BigNumber from 'bignumber.js'
import {
    computed,
    makeObservable,
    runInAction,
    toJS,
} from 'mobx'
import { Address, DecodedAbiFunctionOutputs } from 'everscale-inpage-provider'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import Web3 from 'web3'

import staticRpc from '@/hooks/useStaticRpc'
import { MultiVault, TokenAbi, TokenWallet } from '@/misc'
import {
    DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA,
    DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    EventStateStatus,
    EverscaleTransferQueryParams,
    EverscaleTransferStoreData,
    EverscaleTransferStoreState,
} from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TokenAsset, TokensAssetsService } from '@/stores/TokensAssetsService'
import { NetworkShape } from '@/types'
import { handleLiquidityRequests } from '@/modules/LiquidityRequests'
import {
    debug,
    error,
    findNetwork,
} from '@/utils'


export class EverscaleToEvmPipeline extends BaseStore<EverscaleTransferStoreData, EverscaleTransferStoreState> {

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensAssets: TokensAssetsService,
        protected readonly params?: EverscaleTransferQueryParams,
    ) {
        super()

        this.data = DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA
        this.state = DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE

        makeObservable<EverscaleToEvmPipeline>(this, {
            amount: computed,
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
            useTokensCache: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        await this.checkContract()
    }

    public dispose(): void {
        this.stopEventUpdater()
        this.stopReleaseUpdater()
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
            await staticRpc.ensureInitialized()

            const { state } = await staticRpc.getFullContractState({
                address: this.contractAddress,
            })

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
        if (
            this.contractAddress === undefined
            || this.leftNetwork === undefined
            || this.tokensAssets.tokens.length === 0
        ) {
            return
        }

        const eventContract = new staticRpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
        const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

        const eventConfig = new staticRpc.Contract(
            TokenAbi.EverscaleEventConfiguration,
            eventDetails._eventInitData.configuration,
        )
        const proxyAddress = (await eventConfig.methods
            .getDetails({ answerId: 0 })
            .call())
            ._networkConfiguration
            .eventEmitter
        const pipelineType = this.tokensAssets.getPipelineType(proxyAddress.toString())

        if (pipelineType === 'multi_everscale_evm') {
            const multiEventContract = new staticRpc.Contract(MultiVault.EverscaleEventNative, this.contractAddress)
            const eventData = await multiEventContract.methods.getDecodedData({ answerId: 0 }).call()

            const {
                chainId_: chainId,
                recipient_: ethereum_address,
                remainingGasTo_: owner_address,
                amount_: tokens,
                token_: tokenAddress,
            } = eventData

            let token = this.tokensAssets.get(
                this.leftNetwork.type,
                this.leftNetwork.chainId,
                tokenAddress.toString(),
            )

            if (token === undefined) {
                try {
                    const { decimals, name, symbol } = await TokenWallet.getTokenFullDetails(
                        tokenAddress.toString(),
                    ) as TokenAsset

                    token = {
                        chainId: this.leftNetwork.chainId,
                        decimals,
                        key: `${this.leftNetwork.type}-${this.leftNetwork.chainId}-${tokenAddress.toString()}`,
                        name,
                        pipelines: [],
                        root: tokenAddress.toString(),
                        symbol,
                    } as TokenAsset

                    this.tokensAssets.add(token)
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
                    const pipeline = await this.tokensAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        this.depositType,
                    )
                    this.setData('pipeline', pipeline)
                }

                await this.tokensAssets.syncEvmTokenAddress(this.token?.root, this.pipeline)
                await this.tokensAssets.syncEvmTokenMultiVaultMeta(this.pipeline?.evmTokenAddress, this.pipeline)
            }
            catch (e) {
                error(e)
            }

            this.runEventUpdater()
        }
        else if (pipelineType === 'multi_evm_everscale') {
            const multiEventContract = new staticRpc.Contract(MultiVault.EverscaleEventAlien, this.contractAddress)
            const eventData = await multiEventContract.methods.getDecodedData({ answerId: 0 }).call()

            const {
                recipient_: ethereum_address,
                remainingGasTo_: owner_address,
                amount_: tokens,
                token_: tokenAddress,
                base_chainId_: chainId,
            } = eventData

            let token = this.tokensAssets.get(
                this.leftNetwork.type,
                this.leftNetwork.chainId,
                tokenAddress.toString(),
            )

            if (token === undefined) {
                try {
                    const { decimals, name, symbol } = await TokenWallet.getTokenFullDetails(
                        tokenAddress.toString(),
                    ) as TokenAsset

                    token = {
                        chainId: this.leftNetwork.chainId,
                        decimals,
                        key: `${this.leftNetwork.type}-${this.leftNetwork.chainId}-${tokenAddress.toString()}`,
                        name,
                        pipelines: [],
                        root: tokenAddress.toString(),
                        symbol,
                    } as TokenAsset

                    this.tokensAssets.add(token)
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
                    const pipeline = await this.tokensAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        this.depositType,
                    )

                    this.setData('pipeline', pipeline)
                }

                await this.tokensAssets.syncEvmTokenAddress(this.token?.root, this.pipeline)
                await this.tokensAssets.syncEvmTokenMultiVaultMeta(this.pipeline?.evmTokenAddress, this.pipeline)

                try {
                    const rootContract = new staticRpc.Contract(
                        TokenAbi.TokenRootAlienEVM,
                        new Address(this.token!.root),
                    )
                    const meta = await rootContract.methods.meta({ answerId: 0 }).call()

                    runInAction(() => {
                        this.pipeline!.evmTokenAddress = `0x${new BigNumber(meta.base_token)
                            .toString(16)
                            .padStart(40, '0')}`
                        this.pipeline!.isNative = !(meta.base_chainId === this.pipeline?.chainId)
                    })
                }
                catch (e) {
                    runInAction(() => {
                        this.pipeline!.isNative = true
                    })
                }
            }
            catch (e) {
                error(e)
            }
            this.runEventUpdater()
        }
        else {
            const eventData = await eventContract.methods.getDecodedData({ answerId: 0 }).call()

            const {
                chainId,
                ethereum_address,
                owner_address,
                tokens,
            } = eventData

            const proxyContract = new staticRpc.Contract(TokenAbi.EverscaleTokenTransferProxy, proxyAddress)

            const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

            const token = this.tokensAssets.get(
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
                const pipeline = await this.tokensAssets.pipeline(
                    this.token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    this.depositType,
                )

                this.setData('pipeline', pipeline)
            }

            await this.tokensAssets.syncEvmTokenAddress(this.token?.root, this.pipeline)
            await this.tokensAssets.syncEvmToken(this.pipeline?.evmTokenAddress, this.pipeline)

            if (!this.isEverscaleBasedToken && this.pipeline !== undefined) {
                try {
                    await Promise.all([
                        // sync token vault limit for non-everscale-based tokens
                        this.tokensAssets.syncEvmTokenVaultLimit(
                            this.pipeline.vault,
                            this.pipeline,
                        ),
                        // sync token vault balance for non-everscale-based tokens
                        this.tokensAssets.syncEvmTokenVaultBalance(
                            this.pipeline.evmTokenAddress,
                            this.pipeline,
                        ),
                    ])
                }
                catch (e) {
                    error('Sync vault balance or limit error', e)
                }
            }

            this.runEventUpdater()
        }
    }

    public async release(bounty?: string): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
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

            await staticRpc.ensureInitialized()

            const eventContract = new staticRpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()
            const signatures = eventDetails._signatures.map(sign => {
                const signature = `0x${Buffer.from(sign, 'base64').toString('hex')}`
                const address = this.web3.eth.accounts.recover(
                    this.web3.utils.sha3(this.data.encodedEvent!)!,
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

            const vaultContract = this.tokensAssets.getEvmTokenVaultContract(
                this.pipeline.vault,
                this.pipeline.chainId,
            )
            const multiVaultContract = this.tokensAssets.getEvmTokenMultiVaultContract(
                this.pipeline.vault,
                this.pipeline.chainId,
            )

            if ((this.pipeline.isMultiVault && multiVaultContract === undefined) || vaultContract === undefined) {
                this.setState('releaseState', {
                    ...this.releaseState,
                    status: 'disabled',
                })
                return
            }

            try {
                tries += 1
                let r
                if (this.pipeline.isMultiVault) {
                    if (this.pipeline.isNative) {
                        r = multiVaultContract?.methods.saveWithdrawNative(
                            this.data.encodedEvent,
                            signatures.map(({ signature }) => signature),
                        )
                    }
                    else {
                        r = multiVaultContract?.methods.saveWithdrawAlien(
                            this.data.encodedEvent,
                            signatures.map(({ signature }) => signature),
                        )
                    }
                }
                else {
                    r = bounty
                        ? vaultContract.methods.saveWithdraw(
                            this.data.encodedEvent,
                            signatures.map(({ signature }) => signature),
                            bounty,
                        )
                        : vaultContract.methods.saveWithdraw(
                            this.data.encodedEvent,
                            signatures.map(({ signature }) => signature),
                        )
                }

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
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Release tokens error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        status: 'disabled',
                    })
                    error('Release tokens error', e)
                }
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async submitBounty(amount: string): Promise<void> {
        if (this.state.isSubmitBountyLoading) {
            return
        }

        let tries = 0

        const send = async (transactionType?: string): Promise<boolean> => {
            if (
                tries >= 2
                || this.pipeline === undefined
                || this.data.pendingWithdrawalId === undefined
            ) {
                return false
            }

            const vaultContract = this.tokensAssets.getEvmTokenVaultContract(
                this.pipeline.vault,
                this.pipeline.chainId,
            )

            if (!vaultContract) {
                return false
            }

            try {
                tries += 1

                const r = vaultContract.methods.setPendingWithdrawalBounty(
                    this.data.pendingWithdrawalId,
                    amount,
                )

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
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Set bounty error. Try with transaction type 0x0', e)
                    return send('0x0')
                }
                error('Release tokens error', e)
                return false
            }
        }

        this.setState('isSubmitBountyLoading', true)
        const success = await send(this.rightNetwork?.transactionType)
        if (success) {
            while (this.data.pendingWithdrawalBounty !== amount) {
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        this.setState('isSubmitBountyLoading', false)
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

            const eventContract = new staticRpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
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

            const pipelineType = this.tokensAssets.getPipelineType(this.pipeline.proxy)

            if (pipelineType === 'multi_everscale_evm') {
                const proxyContract = new staticRpc.Contract(MultiVault.NativeProxy, eventDetails._initializer)
                const configurations = (await proxyContract.methods.getConfiguration({ answerId: 0 }).call()).value0
                this.pipeline.everscaleConfiguration = configurations.everscaleConfiguration

                const eventConfig = new staticRpc.Contract(
                    TokenAbi.EverscaleEventConfiguration,
                    this.pipeline.everscaleConfiguration,
                )
                const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()
                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

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
                    round: (await eventContract.methods.round_number({}).call()).round_number,
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
                const proxyContract = new staticRpc.Contract(MultiVault.AlienProxy, eventDetails._initializer)
                const configurations = (await proxyContract.methods.getConfiguration({ answerId: 0 }).call()).value0
                this.pipeline.everscaleConfiguration = configurations.everscaleConfiguration

                const eventConfig = new staticRpc.Contract(
                    TokenAbi.EverscaleEventConfiguration,
                    this.pipeline.everscaleConfiguration,
                )
                const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()
                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

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
                    round: (await eventContract.methods.round_number({}).call()).round_number,
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
                const abi = this.isEverscaleBasedToken
                    ? TokenAbi.EverscaleTokenTransferProxy
                    : TokenAbi.EvmTokenTransferProxy
                const proxyContract = new staticRpc.Contract(abi, eventDetails._initializer)

                const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

                const token = this.tokensAssets.get(
                    this.leftNetwork.type,
                    this.leftNetwork.chainId,
                    tokenAddress.toString(),
                )

                if (token === undefined) {
                    return
                }

                const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

                if (this.isEverscaleBasedToken) {
                    this.pipeline.everscaleConfiguration = (proxyDetails as DecodedAbiFunctionOutputs<
                        typeof TokenAbi.EverscaleTokenTransferProxy, 'getDetails'
                    >)._config.tonConfiguration
                }
                else {
                    this.pipeline.everscaleConfiguration = (proxyDetails as DecodedAbiFunctionOutputs<
                        typeof TokenAbi.EvmTokenTransferProxy, 'getDetails'
                    >).value0.tonConfiguration
                }

                const eventConfig = new staticRpc.Contract(
                    TokenAbi.EverscaleEventConfiguration,
                    this.pipeline.everscaleConfiguration,
                )
                const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()
                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                )

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
                    round: (await eventContract.methods.round_number({}).call()).round_number,
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
                await this.syncPendingWithdrawal()

                const vaultContract = this.pipeline.isMultiVault
                    ? this.tokensAssets.getEvmTokenMultiVaultContract(
                        this.pipeline.vault,
                        this.pipeline.chainId,
                    )
                    : this.tokensAssets.getEvmTokenVaultContract(
                        this.pipeline.vault,
                        this.pipeline.chainId,
                    )

                const isReleased = await vaultContract?.methods.withdrawalIds(this.data.withdrawalId).call()
                    && (this.pendingWithdrawalId === undefined || this.pendingWithdrawalStatus === 'Close')

                if (this.releaseState?.status === 'pending' && this.releaseState?.isReleased === undefined) {
                    const baseStatus = isReleased ? 'confirmed' : 'disabled'
                    this.setState('releaseState', {
                        isReleased,
                        status: this.pendingWithdrawalId !== undefined && this.pendingWithdrawalStatus !== 'Close'
                            ? 'pending'
                            : baseStatus,
                    })
                }

                if (isReleased) {
                    this.setState('releaseState', {
                        isReleased: true,
                        status: 'confirmed',
                    })
                }
            }
        })().finally(() => {
            if (this.releaseState?.status !== 'confirmed' && this.releaseState?.status !== 'rejected') {
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

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'everscale'
    }

    public get isPendingWithdrawalSynced(): boolean {
        return this.state.isPendingWithdrawalSynced === true
    }

    public get isSubmitBountyLoading(): boolean {
        return this.state.isSubmitBountyLoading === true
    }

    public get evmTokenDecimals(): number | undefined {
        return this.pipeline?.evmTokenDecimals
    }

    public get token(): TokenAsset | undefined {
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

    public get useTokensCache(): TokensAssetsService {
        return this.tokensAssets
    }

}
