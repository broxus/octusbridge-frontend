import {
    addABI,
    decodeLogs,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'
import {
    computed,
    IReactionDisposer,
    makeObservable,
    reaction, runInAction,
    toJS,
} from 'mobx'
import { Address, Subscription } from 'everscale-inpage-provider'
import Web3 from 'web3'

import rpc from '@/hooks/useRpcClient'
import staticRpc from '@/hooks/useStaticRpc'
import { EthAbi, TokenAbi, TokenWallet } from '@/misc'
import {
    DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA,
    DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    EventVoteData,
    EvmTransferQueryParams,
    EvmTransferStoreData,
    EvmTransferStoreState,
    PendingWithdrawal,
} from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import {
    alienTokenProxyContract,
    TokenAsset,
    TokensAssetsService,
} from '@/stores/TokensAssetsService'
import { NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    isEverscaleAddressValid,
    storage,
} from '@/utils'


export class EvmToEverscalePipeline extends BaseStore<EvmTransferStoreData, EvmTransferStoreState> {

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected txPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly tokensAssets: TokensAssetsService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        super()

        this.data = DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA
        this.state = DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE

        makeObservable<EvmToEverscalePipeline, 'web3'>(this, {
            amount: computed,
            deriveEventAddress: computed,
            leftAddress: computed,
            rightAddress: computed,
            token: computed,
            eventState: computed,
            prepareState: computed,
            transferState: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            txHash: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useTokensAssets: computed,
            web3: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#tokensDisposer = reaction(() => this.tokensAssets.tokens, async () => {
            await this.checkTransaction(true)
        }, { delay: 30 })

        await this.checkTransaction()
    }

    public dispose(): void {
        this.#tokensDisposer?.()
        this.stopTransferUpdater()
        this.stopPrepareUpdater()
    }

    public async checkTransaction(force: boolean = false): Promise<void> {
        if (this.txHash === undefined || (this.state.isCheckingTransaction && !force)) {
            return
        }

        this.setState({
            isCheckingTransaction: true,
            transferState: {
                confirmedBlocksCount: this.transferState?.confirmedBlocksCount || 0,
                eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                status: this.transferState?.status || 'pending',
            },
        })

        try {
            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                setTimeout(async () => {
                    await this.checkTransaction(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingTransaction', false)
            }
        }
        catch (e) {
            error('Check transaction error', e)
            this.setState('isCheckingTransaction', false)
            return
        }

        if (!this.state.isCheckingTransaction) {
            try {
                switch (true) {
                    case this.transferState?.status === 'confirmed' && this.prepareState?.status !== 'confirmed':
                        await this.runPrepareUpdater()
                        break

                    default:
                        await this.resolve()
                }
            }
            catch (e) {
                error('Resolve error', e)
            }
        }
    }

    public async resolve(): Promise<void> {
        if (
            this.txHash === undefined
            || this.leftNetwork === undefined
            || this.tokensAssets.tokens.length === 0
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        this.setState('transferState', {
            confirmedBlocksCount: this.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        })

        try {
            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                await this.checkTransaction()
                return
            }

            addABI(EthAbi.Vault)
            addABI(EthAbi.MultiVault)

            const decodedLogs = decodeLogs(txReceipt.logs)
            const depositLog = decodedLogs.find(log => log?.name === 'Deposit')
            const alienTransfer = decodedLogs.find(log => log?.name === 'AlienTransfer')
            const nativeTransfer = decodedLogs.find(log => log?.name === 'NativeTransfer')
            const userDepositLogs = decodedLogs.filter(log => log?.name === 'UserDeposit')

            if (depositLog == null) {
                return
            }

            if (userDepositLogs.length > 0) {
                const pendingWithdrawals: PendingWithdrawal[] = []
                userDepositLogs.forEach(item => {
                    if (item.events[4].value !== '0x0000000000000000000000000000000000000000') {
                        pendingWithdrawals.push({
                            id: item.events[5].value,
                            bounty: item.events[6].value,
                            amount: item.events[3].value,
                            recipient: item.events[4].value,
                        })
                    }
                })
                if (pendingWithdrawals.length > 0) {
                    this.setData('pendingWithdrawals', pendingWithdrawals)
                }
            }

            let token: TokenAsset | undefined

            if (alienTransfer != null) {
                const root = `0x${new BigNumber(alienTransfer.events[1].value).toString(16).padStart(40, '0')}`.toLowerCase()
                const { chainId, type } = this.leftNetwork
                token = this.tokensAssets.get(type, chainId, root)

                if (token === undefined) {
                    try {
                        const contract = this.tokensAssets.getEvmTokenContract(root, chainId)
                        const [name, symbol, decimals] = await Promise.all([
                            contract?.methods.name().call(),
                            contract?.methods.symbol().call(),
                            contract?.methods.decimals().call(),
                        ])

                        token = {
                            root,
                            decimals: parseInt(decimals, 10),
                            name,
                            symbol,
                            key: `${type}-${chainId}-${root}`,
                            chainId,
                            pipelines: [],
                        } as TokenAsset

                        this.tokensAssets.add(token)
                    }
                    catch (e) {
                        //
                    }
                }

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

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

                await this.tokensAssets.syncEvmToken(this.pipeline?.evmTokenAddress, this.pipeline)
                await this.tokensAssets.syncEverscaleTokenAddress(token.root, this.pipeline)

                const amount = new BigNumber(depositLog.events[5].value || 0)
                    .shiftedBy(-token.decimals)
                    .shiftedBy(this.pipeline?.evmTokenDecimals ?? 0)

                runInAction(() => {
                    if (depositLog.events[5].value !== '0') {
                        this.pipeline!.depositFee = new BigNumber(depositLog.events[6].value || 0)
                            .div(depositLog.events[5].value || 0)
                            .multipliedBy(10000)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed()
                    }
                })

                const targetWid = alienTransfer.events[6].value
                const targetAddress = alienTransfer.events[7].value

                this.setData({
                    amount: amount.toFixed(),
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                })
            }
            else if (nativeTransfer) {
                const root = depositLog.events[2].value.toLowerCase()
                const { chainId, type } = this.leftNetwork
                token = this.tokensAssets.get(type, chainId, root)

                if (token === undefined) {
                    try {
                        const contract = this.tokensAssets.getEvmTokenContract(root, chainId)
                        const [name, symbol, decimals] = await Promise.all([
                            contract?.methods.name().call(),
                            contract?.methods.symbol().call(),
                            contract?.methods.decimals().call(),
                        ])

                        token = {
                            root,
                            decimals: parseInt(decimals, 10),
                            name,
                            symbol,
                            key: `${type}-${chainId}-${root}`,
                            chainId,
                            pipelines: [],
                        } as TokenAsset

                        this.tokensAssets.add(token)
                    }
                    catch (e) {
                        //
                    }
                }

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

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

                await this.tokensAssets.syncEvmToken(this.pipeline?.evmTokenAddress, this.pipeline)
                await this.tokensAssets.syncEverscaleTokenAddress(token.root, this.pipeline)

                const amount = new BigNumber(depositLog.events[5].value || 0)
                    .shiftedBy(-token.decimals)
                    .shiftedBy(this.pipeline?.evmTokenDecimals ?? 0)

                runInAction(() => {
                    if (depositLog.events[5].value !== '0') {
                        this.pipeline!.depositFee = new BigNumber(depositLog.events[6].value || 0)
                            .div(depositLog.events[5].value || 0)
                            .multipliedBy(10000)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed()
                    }
                })

                const targetWid = nativeTransfer.events[3].value
                const targetAddress = nativeTransfer.events[4].value

                this.setData({
                    amount: amount.toFixed(),
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                })
            }
            else {
                token = this.tokensAssets.findTokenByVaultAddress(
                    depositLog.address.toLowerCase(),
                    this.leftNetwork.chainId,
                )

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

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

                await this.tokensAssets.syncEvmTokenAddress(token.root, this.pipeline)
                await this.tokensAssets.syncEvmToken(this.pipeline?.evmTokenAddress, this.pipeline)

                const amount = new BigNumber(depositLog.events[0].value || 0)
                    .shiftedBy(-token.decimals)
                    .shiftedBy(this.pipeline?.evmTokenDecimals ?? 0)

                const targetWid = depositLog.events[1].value
                const targetAddress = depositLog.events[2].value

                this.setData({
                    amount: amount.toFixed(),
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                })
            }

            if (this.pipeline?.ethereumConfiguration === undefined) {
                return
            }

            await staticRpc.ensureInitialized()

            const ethConfig = new staticRpc.Contract(TokenAbi.EthEventConfig, this.pipeline.ethereumConfiguration)

            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            this.setState('transferState', {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: parseInt(eventBlocksToConfirm, 10),
                status: 'pending',
            })

            this.runTransferUpdater()
        }
        catch (e) {
            error('Resolve error', e)
            this.setState('transferState', {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: 0,
                status: 'disabled',
            })
        }
    }

    public async prepare(): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
            || this.pipeline?.ethereumConfiguration === undefined
            || this.data.eventVoteData === undefined
        ) {
            return
        }

        const ethConfigContract = new rpc.Contract(
            TokenAbi.EthEventConfig,
            this.pipeline.ethereumConfiguration,
        )

        this.setState('prepareState', {
            ...this.prepareState,
            isDeploying: true,
            status: 'pending',
        })

        try {
            await ethConfigContract.methods.deployEvent({
                eventVoteData: this.data.eventVoteData,
            }).send({
                amount: '6000000000',
                bounce: true,
                from: this.everWallet.account.address,
            })
        }
        catch (e: any) {
            error('Prepare error', e)
            this.setState('prepareState', {
                ...this.prepareState,
                status: 'disabled',
            })
        }
        finally {
            this.setState('prepareState', {
                ...this.prepareState,
                isDeploying: false,
            } as EvmTransferStoreState['prepareState'])
        }
    }

    public async deployAlienRoot(): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
            || this.pipeline?.everscaleTokenAddress === undefined
            || this.pipeline?.evmTokenAddress === undefined
            || this.leftNetwork?.chainId === undefined
        ) {
            return
        }

        try {
            this.setState('prepareState', {
                ...this.prepareState,
                isTokenDeploying: true,
                status: 'pending',
            } as EvmTransferStoreState['prepareState'])

            await this.subscribeAlienTokenRootDeploy()

            const [decimals, name, symbol] = await Promise.all([
                this.tokensAssets.getEvmTokenDecimals(this.pipeline.evmTokenAddress, this.leftNetwork.chainId),
                this.tokensAssets.getEvmTokenName(this.pipeline.evmTokenAddress, this.leftNetwork.chainId),
                this.tokensAssets.getEvmTokenSymbol(this.pipeline.evmTokenAddress, this.leftNetwork.chainId),
            ])

            await alienTokenProxyContract(rpc, this.pipeline.proxy).methods
                .deployAlienToken({
                    chainId: this.leftNetwork.chainId,
                    decimals,
                    name,
                    remainingGasTo: this.everWallet.account.address,
                    symbol,
                    token: `0x${new BigNumber(this.pipeline.evmTokenAddress).toString(16).padStart(40, '0')}`.toLowerCase(),
                })
                .send({
                    amount: '5000000000',
                    bounce: true,
                    from: this.everWallet.account.address,
                })

        }
        catch (e) {
            this.setState('prepareState', {
                isTokenDeployed: false,
                isTokenDeploying: undefined,
            } as EvmTransferStoreState['prepareState'])
            error('Deploy alien token error', e)
        }
    }

    protected runTransferUpdater(): void {
        debug('runTransferUpdater', toJS(this.data), toJS(this.state))

        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined) {
                return
            }

            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)
            const networkBlockNumber = await this.web3.eth.getBlockNumber()

            if (txReceipt?.blockNumber == null || networkBlockNumber == null) {
                this.setState('transferState', {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                    status: 'pending',
                })
                return
            }

            const transferState: EvmTransferStoreState['transferState'] = {
                confirmedBlocksCount: networkBlockNumber - txReceipt.blockNumber,
                eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                status: this.transferState?.status || 'pending',
            }

            if (transferState.confirmedBlocksCount >= transferState.eventBlocksToConfirm) {
                transferState.status = 'confirmed'

                if (!txReceipt.status) {
                    transferState.status = 'rejected'
                    this.setState('transferState', transferState)
                    return
                }

                keepNonDecodedLogs()
                addABI(EthAbi.Vault)

                const decodedLogs = decodeLogs(txReceipt?.logs || [])

                const depositLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'Deposit',
                )]
                const alienTransferLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'AlienTransfer',
                )]
                const nativeTransferLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'NativeTransfer',
                )]

                if (depositLog?.data == null || this.pipeline?.ethereumConfiguration === undefined) {
                    return
                }

                await staticRpc.ensureInitialized()

                const ethConfig = new staticRpc.Contract(
                    TokenAbi.EthEventConfig,
                    this.pipeline.ethereumConfiguration,
                )

                const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()

                let eventData: string | undefined

                const eventVoteData: EventVoteData = {
                    eventBlock: txReceipt.blockHash,
                    eventBlockNumber: txReceipt.blockNumber.toString(),
                    eventTransaction: txReceipt.transactionHash,
                } as EventVoteData

                if (alienTransferLog != null) {
                    if (!this.prepareState?.isTokenDeployed) {
                        const { state } = await staticRpc.getFullContractState({
                            address: new Address(this.pipeline!.everscaleTokenAddress!),
                        })

                        this.setState({
                            prepareState: {
                                ...this.prepareState,
                                status: transferState.status === 'confirmed' ? 'pending' : this.prepareState?.status,
                                isTokenDeployed: state?.isDeployed ?? false,
                            } as EvmTransferStoreState['prepareState'],
                            transferState,
                        })

                        if (state === undefined) {
                            this.stopTransferUpdater()
                            await this.subscribeAlienTokenRootDeploy()
                            return
                        }
                    }

                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        alienTransferLog.data,
                    )
                    eventVoteData.eventIndex = alienTransferLog.logIndex.toString()
                }
                else if (nativeTransferLog != null) {
                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        nativeTransferLog.data,
                    )
                    eventVoteData.eventIndex = nativeTransferLog.logIndex.toString()
                }
                else {
                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        depositLog.data,
                    )
                    eventVoteData.eventIndex = depositLog.logIndex.toString()
                }

                if (eventData == null) {
                    return
                }

                eventVoteData.eventData = eventData

                this.setData('eventVoteData', eventVoteData)

                const eventAddress = (await ethConfig.methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                }).call()).eventContract

                this.setData('deriveEventAddress', eventAddress)
                this.setState('transferState', transferState)

                this.runPrepareUpdater()
            }
            else {
                this.setState('transferState', {
                    ...transferState,
                    status: 'pending',
                })
            }
        })().finally(() => {
            if (
                this.state.transferState?.status !== 'confirmed'
                && this.state.transferState?.status !== 'rejected'
            ) {
                this.txTransferUpdater = setTimeout(() => {
                    this.runTransferUpdater()
                }, 5000)
            }
        })
    }

    protected stopTransferUpdater(): void {
        if (this.txTransferUpdater !== undefined) {
            clearTimeout(this.txTransferUpdater)
            this.txTransferUpdater = undefined
        }
    }

    protected runPrepareUpdater(): void {
        debug('runPrepareUpdater', toJS(this.data), toJS(this.state))

        this.stopPrepareUpdater();

        (async () => {
            if (this.rightNetwork === undefined || this.prepareState?.isDeploying === true) {
                return
            }

            if (this.deriveEventAddress === undefined) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
                return
            }

            const isFirstIteration = this.prepareState?.isDeployed === undefined

            if (isFirstIteration) {
                this.setState('prepareState', {
                    ...this.prepareState,
                    status: 'pending',
                })
            }

            await staticRpc.ensureInitialized()

            const cachedState = (await staticRpc.getFullContractState({
                address: this.deriveEventAddress,
            })).state

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (isFirstIteration) {
                    this.setState('prepareState', {
                        ...this.prepareState,
                        isDeployed: false,
                        status: 'disabled',
                    })
                    return
                }

                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
            }

            const eventContract = new staticRpc.Contract(
                TokenAbi.TokenTransferEthEvent,
                this.deriveEventAddress,
            )
            const eventDetails = await eventContract.methods.getDetails({
                answerId: 0,
            }).call({
                cachedState,
            })
            const eventState: EvmTransferStoreState['eventState'] = {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status: 'pending',
            }

            if (eventDetails._status === '2') {
                eventState.status = 'confirmed'
            }
            else if (eventDetails._status === '3') {
                eventState.status = 'rejected'
            }

            if (this.prepareState?.status !== 'confirmed') {
                this.setState('prepareState', {
                    ...this.prepareState,
                    isDeployed: true,
                    status: 'confirmed',
                })
            }

            this.setState('eventState', eventState)

            const { chainId, type } = this.rightNetwork
            const root = this.pipeline?.everscaleTokenAddress?.toLowerCase()
            const key = `${type}-${chainId}-${root}`

            if (
                this.pipeline?.isMultiVault
                && root !== undefined
                && isEverscaleAddressValid(root)
            ) {
                try {
                    const { decimals, name, symbol } = await TokenWallet.getTokenFullDetails(root) as TokenAsset

                    const asset = {
                        chainId,
                        decimals,
                        key,
                        name,
                        root,
                        symbol,
                    } as TokenAsset

                    try {
                        const rootContract = new staticRpc.Contract(TokenAbi.TokenRootAlienEVM, new Address(asset.root))
                        const meta = await rootContract.methods.meta({ answerId: 0 }).call()
                        const evmTokenAddress = `0x${new BigNumber(meta.base_token).toString(16).padStart(40, '0')}`
                        const evmToken = this.tokensAssets.get('evm', meta.base_chainId, evmTokenAddress)
                        asset.icon = evmToken?.icon
                    }
                    catch (e) {}

                    this.tokensAssets.add({ ...asset, pipelines: [] })

                    const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

                    importedAssets[key] = asset

                    storage.set('imported_assets', JSON.stringify(importedAssets))
                }
                catch (e) {}
            }
        })().finally(() => {
            if (
                this.eventState?.status !== 'confirmed'
                && this.eventState?.status !== 'rejected'
            ) {
                this.txPrepareUpdater = setTimeout(() => {
                    this.runPrepareUpdater()
                }, 5000)
            }
        })
    }

    protected stopPrepareUpdater(): void {
        if (this.txPrepareUpdater !== undefined) {
            clearTimeout(this.txPrepareUpdater)
            this.txPrepareUpdater = undefined
        }
    }

    protected async subscribeAlienTokenRootDeploy(): Promise<void> {
        await this.unsubscribeAlienTokenRootDeploy()

        if (this.pipeline?.everscaleTokenAddress === undefined) {
            return
        }

        try {
            this.#alienTokenRootDeploySubscriber = (await rpc.subscribe('contractStateChanged', {
                address: new Address(this.pipeline?.everscaleTokenAddress),
            })).on('data', async event => {
                if (!event.state.isDeployed) {
                    return
                }

                this.setState('prepareState', {
                    ...this.prepareState,
                    isTokenDeployed: true,
                    isTokenDeploying: undefined,
                } as EvmTransferStoreState['prepareState'])

                this.runTransferUpdater()

                await this.unsubscribeAlienTokenRootDeploy()
            })
            debug('Subscribe')
        }
        catch (e) {
            error('Subscribe error', e)
        }
    }

    protected async unsubscribeAlienTokenRootDeploy(): Promise<void> {
        if (this.#alienTokenRootDeploySubscriber !== undefined) {
            try {
                this.#alienTokenRootDeploySubscriber?.unsubscribe()
                this.#alienTokenRootDeploySubscriber = undefined
            }
            catch (e) {
                error('Unsubscribe error', e)
            }
        }
    }

    protected get web3(): Web3 {
        const network = findNetwork(this.leftNetwork?.chainId as string, 'evm')
        return new Web3(network?.rpcUrl as string)
    }

    public get pipeline(): EvmTransferStoreData['pipeline'] {
        return this.data.pipeline
    }

    public get amount(): EvmTransferStoreData['amount'] {
        return this.data.amount
    }

    public get deriveEventAddress(): EvmTransferStoreData['deriveEventAddress'] {
        return this.data.deriveEventAddress
    }

    public get leftAddress(): EvmTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): EvmTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get token(): EvmTransferStoreData['token'] {
        return this.data.token
    }

    public get eventState(): EvmTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): EvmTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get transferState(): EvmTransferStoreState['transferState'] {
        return this.state.transferState
    }

    public get depositType(): EvmTransferQueryParams['depositType'] {
        return this.params?.depositType
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get depositFee(): string {
        if (this.pipeline?.isMultiVault) {
            return this.amountNumber
                .times(this.pipeline?.depositFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.pipeline.evmTokenDecimals || 0))
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

    public get txHash(): EvmTransferQueryParams['txHash'] | undefined {
        return this.params?.txHash
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTokensAssets(): TokensAssetsService {
        return this.tokensAssets
    }

    public get pendingWithdrawals(): PendingWithdrawal[] | undefined {
        return this.data.pendingWithdrawals
    }

    #alienTokenRootDeploySubscriber: Subscription<'contractStateChanged'> | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
