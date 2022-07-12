import {
    addABI,
    decodeLogs,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'
import {
    action,
    computed,
    IReactionDisposer,
    makeObservable,
    reaction,
    toJS,
} from 'mobx'
import Web3 from 'web3'

import { CreditFactoryAddress, WEVERRootAddress } from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import rpc from '@/hooks/useRpcClient'
import { EthAbi, TokenWallet } from '@/misc'
import {
    creditFactoryContract,
    creditProcessorContract,
    ethereumEventConfigurationContract,
    getFullContractState,
    tokenTransferEthereumEventContract,
} from '@/misc/contracts'
import { EverscaleToken, Pipeline } from '@/models'
import {
    DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA,
    DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import { CreditProcessorState } from '@/modules/Bridge/types'
import type {
    EventVoteData,
    EvmSwapTransferStoreData,
    EvmSwapTransferStoreState,
    EvmTransferQueryParams,
} from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { BridgeAssetsService, BridgeAssetUniqueKey } from '@/stores/BridgeAssetsService'
import type { NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    isGoodBignumber,
    throwException,
} from '@/utils'


export class EvmToEverscaleSwapPipeline<
    T extends EvmSwapTransferStoreData | Record<string, any> = EvmSwapTransferStoreData,
    U extends EvmSwapTransferStoreState | Record<string, any> = EvmSwapTransferStoreState
> extends BaseStore<T, U> {

    protected txCreditProcessorUpdater: ReturnType<typeof setTimeout> | undefined

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected withdrawUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        super()

        this.setData(DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA)
        this.setState(DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE)

        makeObservable(this, {
            broadcast: action.bound,
            process: action.bound,
            cancel: action.bound,
            withdrawTokens: action.bound,
            withdrawWevers: action.bound,
            withdrawEvers: action.bound,
            amount: computed,
            creditProcessorAddress: computed,
            deriveEventAddress: computed,
            leftAddress: computed,
            rightAddress: computed,
            token: computed,
            creditProcessorState: computed,
            eventState: computed,
            prepareState: computed,
            swapState: computed,
            transferState: computed,
            isDeployer: computed,
            isOwner: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            txHash: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useBridgeAssets: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#bridgeAssetsDisposer = reaction(() => this.bridgeAssets.isReady, async isReady => {
            if (isReady) {
                await this.checkTransaction(true)
            }
        }, { fireImmediately: true })
    }

    public dispose(): void {
        this.#bridgeAssetsDisposer?.()
        this.stopTransferUpdater()
        this.stopCreditProcessorUpdater()
        this.stopWithdrawUpdater()
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
                await this.resolve()
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
            || this.bridgeAssets.tokens.length === 0
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        this.setState('transferState', {
            confirmedBlocksCount: this.state.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        })

        try {
            const tx = await this.web3.eth.getTransaction(this.txHash)

            if (tx == null || tx.to == null) {
                await this.checkTransaction()
                return
            }

            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            addABI(EthAbi.Vault)
            addABI(EthAbi.MultiVault)

            const decodedLogs = decodeLogs(txReceipt.logs)
            const factoryDepositLog = decodedLogs.find(log => log?.name === 'FactoryDeposit')

            const token = this.bridgeAssets.findTokenByVaultAndChain(
                factoryDepositLog!.address.toLowerCase(),
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
                const pipeline = await this.bridgeAssets.pipeline(
                    this.token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    this.depositType,
                )

                this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
            }

            if (this.pipeline?.ethereumConfiguration === undefined) {
                return
            }

            const ethConfigDetails = await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                .methods.getDetails({ answerId: 0 })
                .call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration
            const targetWid = factoryDepositLog!.events[1].value
            const targetAddress = factoryDepositLog!.events[4].value

            this.setData({
                amount: factoryDepositLog!.events[0].value,
                leftAddress: tx.from.toLowerCase(),
                rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
            })

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

    public async broadcast(): Promise<void> {
        if (
            this.prepareState?.isBroadcasting
            || this.data.eventVoteData === undefined
            || this.pipeline?.ethereumConfiguration === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        this.setState('prepareState', {
            ...this.prepareState,
            isBroadcasting: true,
        })

        try {
            await creditFactoryContract(CreditFactoryAddress, rpc)
                .methods.deployProcessorForUser({
                    eventVoteData: this.data.eventVoteData,
                    configuration: this.pipeline?.ethereumConfiguration,
                })
                .send({
                    amount: '5500000000',
                    bounce: true,
                    from: this.everWallet.account.address,
                })
        }
        catch (e) {
            this.setState('prepareState', {
                ...this.prepareState,
                isBroadcasting: false,
            })
            error('Broadcasting error', e)
        }
    }

    public async process(): Promise<void> {
        if (
            this.swapState?.isCanceling === true
            || this.swapState?.isProcessing === true
            || this.creditProcessorAddress === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        this.setState('swapState', {
            ...this.swapState,
            isProcessing: true,
        })

        try {
            await creditProcessorContract(this.creditProcessorAddress, rpc)
                .methods.process({})
                .send({
                    amount: '10000000',
                    bounce: false,
                    from: this.everWallet.account.address,
                })

            this.setState('swapState', {
                ...this.swapState,
                isStuck: false,
            }as EvmSwapTransferStoreState['swapState'])
        }
        catch (e) {
            this.setState('swapState', {
                ...this.swapState,
                isProcessing: false,
            })
            error('Process error', e)
        }
    }

    public async cancel(): Promise<void> {
        if (
            this.swapState?.isCanceling === true
            || this.swapState?.isProcessing === true
            || this.creditProcessorAddress === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        this.setState('swapState', {
            ...this.swapState,
            isCanceling: true,
        })

        try {
            const creditProcessorDetails = (await creditProcessorContract(this.creditProcessorAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                .value0

            await this.checkWithdrawBalances()

            const gasAmount = BigNumber.max(
                new BigNumber(creditProcessorDetails.debt).minus(this.swapState?.everBalance || 0).plus('300000000'),
                new BigNumber('100000000'),
            )

            await creditProcessorContract(this.creditProcessorAddress, rpc)
                .methods.cancel({})
                .send({
                    amount: gasAmount.toFixed(),
                    bounce: false,
                    from: this.everWallet.account.address,
                })
            await this.checkWithdrawBalances()
            this.setState('swapState', {
                ...this.swapState,
                isStuck: false,
            })
        }
        catch (e) {
            this.setState('swapState', {
                ...this.swapState,
                isCanceling: false,
            })
            error('Cancel error', e)
        }
    }

    public async withdrawTokens(): Promise<void> {
        if (
            this.swapState?.tokenBalance === undefined
            || this.swapState.tokenWallet === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorAddress === undefined
            || this.everWallet.account?.address === undefined
            || this.token === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawTokenUpdater()

        this.setState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        if ((this.token as EverscaleToken<BridgeAssetUniqueKey>).wallet === undefined) {
            this.stopWithdrawUpdater()

            this.setState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            return
        }

        const isDeployed = this.token.balance !== undefined
        const deployGrams = !isDeployed ? '100000000' : '0'
        const proxyGasValue = !isDeployed ? '600000000' : '500000000'
        const gasAmount = BigNumber.max(
            new BigNumber('750000000').minus(this.swapState?.everBalance || 0),
            new BigNumber('50000000'),
        )

        try {
            if (!isGoodBignumber(new BigNumber(this.swapState.tokenBalance || 0))) {
                this.stopWithdrawUpdater()
                throwException(`Invalid amount: ${gasAmount.toFixed()}`)
                return
            }

            await creditProcessorContract(this.creditProcessorAddress, rpc)
                .methods.proxyTokensTransfer({
                    _amount: this.swapState.tokenBalance || 0,
                    _deployWalletValue: deployGrams,
                    _remainingGasTo: this.everWallet.account.address,
                    _gasValue: proxyGasValue,
                    _notify: false,
                    _recipient: this.everWallet.account.address,
                    _payload: '',
                    _tokenWallet: this.swapState.tokenWallet,
                })
                .send({
                    amount: gasAmount.toFixed(),
                    bounce: false,
                    from: this.everWallet.account.address,
                })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.setState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            error('Withdraw token error', e)
        }
    }

    public async withdrawWevers(): Promise<void> {
        if (
            this.swapState?.tokenBalance === undefined
            || this.swapState.tokenWallet === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorAddress === undefined
            || this.everWallet.account?.address === undefined
            || this.token === undefined
            || this.leftNetwork === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawWeverUpdater()

        this.setState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        const weverToken = this.bridgeAssets.get(
            this.leftNetwork?.type,
            this.leftNetwork?.chainId,
            WEVERRootAddress.toString(),
        ) as EverscaleToken<BridgeAssetUniqueKey>

        if (weverToken?.wallet === undefined) {
            this.stopWithdrawUpdater()

            this.setState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            return
        }

        const isDeployed = weverToken.balance !== undefined

        const deployGrams = !isDeployed ? '100000000' : '0'
        const proxyGasValue = !isDeployed ? '600000000' : '500000000'
        const gasAmount = BigNumber.max(
            new BigNumber('750000000').minus(this.swapState?.everBalance || 0),
            new BigNumber('50000000'),
        )

        try {
            if (!isGoodBignumber(new BigNumber(this.swapState.weverBalance || 0))) {
                this.stopWithdrawUpdater()
                throwException(`Invalid amount: ${this.swapState.weverBalance}`)
                return
            }

            await creditProcessorContract(this.creditProcessorAddress, rpc)
                .methods.proxyTokensTransfer({
                    _amount: this.swapState.weverBalance || 0,
                    _deployWalletValue: deployGrams,
                    _remainingGasTo: this.everWallet.account.address,
                    _gasValue: proxyGasValue,
                    _notify: false,
                    _recipient: this.everWallet.account.address,
                    _payload: '',
                    _tokenWallet: this.swapState.tokenWallet,
                })
                .send({
                    amount: gasAmount.toFixed(),
                    bounce: false,
                    from: this.everWallet.account.address,
                })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.setState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            error('Withdraw WTON error', e)
        }
    }

    public async withdrawEvers(): Promise<void> {
        if (
            this.swapState?.everBalance === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorAddress === undefined
            || this.everWallet.account?.address === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawEversUpdater()

        this.setState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        try {
            await creditProcessorContract(this.creditProcessorAddress, rpc)
                .methods.sendGas({
                    flag_: 128,
                    to: this.everWallet.account.address,
                    value_: 0,
                })
                .send({
                    amount: '10000000',
                    bounce: false,
                    from: this.everWallet.account.address,
                })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.setState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            error('Withdraw TONs error', e)
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

            if (txReceipt == null) {
                return
            }

            const networkBlockNumber = await this.web3.eth.getBlockNumber()

            if (txReceipt.blockNumber == null || networkBlockNumber == null) {
                this.setState('transferState', {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                    status: 'pending',
                })
                return
            }

            const transferState: EvmSwapTransferStoreState['transferState'] = {
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
                const log = txReceipt.logs[decodedLogs.findIndex(
                    l => l !== undefined && l.name === 'FactoryDeposit',
                )]

                if (log?.data == null || this.pipeline?.ethereumConfiguration === undefined) {
                    return
                }

                const ethConfigContract = ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)

                const ethConfigDetails = await ethConfigContract.methods.getDetails({ answerId: 0 }).call()

                const eventData = mapEthBytesIntoTonCell(
                    Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    log.data,
                )

                const eventVoteData: EventVoteData = {
                    eventBlock: txReceipt.blockHash,
                    eventBlockNumber: txReceipt.blockNumber.toString(),
                    eventData,
                    eventIndex: log.logIndex.toString(),
                    eventTransaction: txReceipt.transactionHash,
                }

                this.setData('eventVoteData', eventVoteData)

                const eventAddress = (await ethConfigContract.methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                }).call()).eventContract

                this.setData('deriveEventAddress', eventAddress)

                const creditProcessorAddress = (await creditFactoryContract(CreditFactoryAddress)
                    .methods.getCreditProcessorAddress({
                        answerId: 0,
                        eventVoteData,
                        configuration: this.pipeline.ethereumConfiguration,
                    })
                    .call())
                    .value0

                this.setData('creditProcessorAddress', creditProcessorAddress)

                this.setState({
                    transferState,
                    prepareState: {
                        status: 'pending',
                    },
                })

                this.runCreditProcessorUpdater()
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

    protected runCreditProcessorUpdater(): void {
        debug('runCreditProcessorUpdater', toJS(this.data), toJS(this.state))

        this.stopCreditProcessorUpdater();

        (async () => {
            if (this.deriveEventAddress === undefined) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
                return
            }

            const cachedState = await getFullContractState(this.deriveEventAddress)

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }

                if (this.txHash !== undefined) {
                    try {
                        const { blockNumber } = await this.web3.eth.getTransactionReceipt(this.txHash)
                        const networkBlockNumber = await this.web3.eth.getBlockNumber()
                        this.setState('transferState', {
                            ...this.transferState,
                            confirmedBlocksCount: networkBlockNumber - blockNumber,
                        })

                        const ts = parseInt(
                            (await this.web3.eth.getBlock(blockNumber)).timestamp.toString(),
                            10,
                        )
                        debug('Outdated ts', `${(Date.now() / 1000) - ts} / 600`)

                        this.setState('prepareState', {
                            ...this.prepareState,
                            isOutdated: ((Date.now() / 1000) - ts) >= 600,
                        })
                    }
                    catch (e) {

                    }
                }

                return
            }

            if (this.creditProcessorAddress === undefined) {
                return
            }

            await this.checkOwner()

            const creditProcessorDetails = (await creditProcessorContract(this.creditProcessorAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                .value0

            const state = parseInt(creditProcessorDetails.state, 10)
            const isCancelled = state === CreditProcessorState.Cancelled
            const isProcessed = state === CreditProcessorState.Processed

            if (this.creditProcessorState !== state) {
                this.setState('swapState', {
                    ...this.swapState,
                    isCanceling: false,
                    isProcessing: false,
                })
            }

            this.setState('creditProcessorState', state)

            if (isCancelled || isProcessed) {
                this.setState({
                    eventState: {
                        confirmations: this.eventState?.confirmations || 0,
                        requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                        status: 'confirmed',
                    },
                    prepareState: {
                        status: 'confirmed',
                    },
                    swapState: {
                        ...this.swapState,
                        isStuck: false,
                        status: isCancelled ? 'disabled' : 'pending',
                    },
                })

                if (isCancelled) {
                    await this.checkWithdrawBalances()
                }

                const swapState: EvmSwapTransferStoreState['swapState'] = {
                    ...this.swapState,
                    status: isCancelled ? 'disabled' : 'confirmed',
                }

                this.setState('swapState', swapState)

                return
            }

            if (state >= CreditProcessorState.EventDeployInProgress) {
                if (this.prepareState?.status !== 'confirmed') {
                    this.setState('prepareState', {
                        status: 'confirmed',
                    })
                }

                if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                    const eventDetails = await tokenTransferEthereumEventContract(this.deriveEventAddress)
                        .methods.getDetails({ answerId: 0 })
                        .call({ cachedState })

                    const eventState: EvmSwapTransferStoreState['eventState'] = {
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

                    this.setState('eventState', eventState)

                    if (eventState.status !== 'confirmed' && eventState.status !== 'rejected') {
                        return
                    }

                    if (eventState.status === 'confirmed') {
                        this.setState('swapState', {
                            ...this.swapState,
                            status: 'pending',
                        })
                    }
                }
            }

            const tx = (await staticRpc.getTransactions({ address: this.deriveEventAddress })).transactions[0]

            this.setState('swapState', {
                ...this.swapState,
                deployer: creditProcessorDetails.deployer,
            })

            const isStuckNow = this.swapState?.isStuck
            const isStuck = ((Date.now() / 1000) - tx.createdAt) >= 600 && !isCancelled && !isProcessed

            debug('Stuck ts', `${(Date.now() / 1000) - tx.createdAt} / 600`)

            if ([
                CreditProcessorState.EventConfirmed,
                CreditProcessorState.SwapFailed,
                CreditProcessorState.SwapUnknown,
                CreditProcessorState.UnwrapFailed,
                CreditProcessorState.ProcessRequiresGas,
            ].includes(state) && isStuck) {
                this.setState('swapState', {
                    ...this.swapState,
                    isStuck: isStuckNow === undefined ? true : isStuckNow,
                    status: 'pending',
                })
                return
            }

            this.setState('swapState', {
                ...this.swapState,
                isStuck: isStuckNow,
            })

            if (this.eventState?.status === 'confirmed') {
                this.setState('swapState', {
                    ...this.swapState,
                    status: 'pending',
                })
            }
            // else {
            //     this.setState('swapState', this.swapState)
            // }
        })().finally(() => {
            if (
                this.swapState?.status !== 'confirmed'
                && this.swapState?.status !== 'rejected'
                && this.creditProcessorState !== CreditProcessorState.Cancelled
            ) {
                this.txCreditProcessorUpdater = setTimeout(() => {
                    this.runCreditProcessorUpdater()
                }, 5000)
            }
        })
    }

    protected stopCreditProcessorUpdater(): void {
        if (this.txCreditProcessorUpdater !== undefined) {
            clearTimeout(this.txCreditProcessorUpdater)
            this.txCreditProcessorUpdater = undefined
        }
    }

    protected runWithdrawTokenUpdater(): void {
        const status = this.swapState?.status

        const runWithdrawTokenUpdater = () => {
            debug('runWithdrawTokenUpdater', toJS(this.state.swapState))

            this.stopWithdrawUpdater();

            (async () => {
                await this.checkWithdrawBalances()
                const isWithdrawing = isGoodBignumber(new BigNumber(this.swapState?.tokenBalance || 0))
                this.setState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                })
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.tokenBalance || 0))
                    ) {
                        runWithdrawTokenUpdater()
                    }
                    else {
                        this.setState('swapState', {
                            ...this.swapState,
                            status,
                        })
                    }
                }, 5000)
            })
        }

        runWithdrawTokenUpdater()
    }

    protected runWithdrawWeverUpdater(): void {
        const status = this.swapState?.status

        const runWithdrawWeverUpdater = () => {
            debug('runWithdrawWtonUpdater', toJS(this.state.swapState))

            this.stopWithdrawUpdater();

            (async () => {
                await this.checkWithdrawBalances()
                const isWithdrawing = isGoodBignumber(new BigNumber(this.swapState?.weverBalance || 0))
                this.setState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                })
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.weverBalance || 0))
                    ) {
                        runWithdrawWeverUpdater()
                    }
                    else {
                        this.setState('swapState', {
                            ...this.swapState,
                            status,
                        })
                    }
                }, 5000)
            })
        }

        runWithdrawWeverUpdater()
    }

    protected runWithdrawEversUpdater(): void {
        const status = this.swapState?.status

        const runWithdrawEversUpdater = () => {
            debug('runWithdrawTonUpdater', toJS(this.state.swapState))

            this.stopWithdrawUpdater();

            (async () => {
                await this.checkWithdrawBalances()
                const isWithdrawing = isGoodBignumber(new BigNumber(this.swapState?.everBalance || 0))
                this.setState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                })
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.everBalance || 0))
                    ) {
                        runWithdrawEversUpdater()
                    }
                    else {
                        this.setState('swapState', {
                            ...this.swapState,
                            status,
                        })
                    }
                }, 5000)
            })
        }

        runWithdrawEversUpdater()
    }

    protected stopWithdrawUpdater(): void {
        if (this.withdrawUpdater !== undefined) {
            clearTimeout(this.withdrawUpdater)
            this.withdrawUpdater = undefined
        }
    }

    protected async checkOwner(): Promise<void> {
        if (this.creditProcessorAddress === undefined) {
            return
        }

        try {
            const owner = (await creditProcessorContract(this.creditProcessorAddress)
                .methods.getCreditEventData({ answerId: 0 })
                .call())
                .value0
                .user

            this.setState('swapState', {
                ...this.swapState,
                owner,
            })
        }
        catch (e) {
            error('Check owner error', e)
        }
    }

    protected async checkWithdrawBalances(): Promise<void> {
        if (this.creditProcessorAddress === undefined) {
            return
        }

        try {
            const creditProcessorDetails = (await creditProcessorContract(this.creditProcessorAddress)
                .methods.getDetails({
                    answerId: 0,
                })
                .call())
                .value0

            const [
                tokenBalance,
                creditState,
                weverBalance,
            ] = await Promise.all([
                TokenWallet.balance({
                    wallet: creditProcessorDetails.tokenWallet,
                }),
                getFullContractState(this.creditProcessorAddress),
                TokenWallet.balance({
                    wallet: creditProcessorDetails.wtonWallet,
                }),
            ])

            this.setState('swapState', {
                ...this.swapState,
                tokenBalance,
                tokenWallet: creditProcessorDetails.tokenWallet,
                everBalance: creditState?.balance,
                weverBalance,
                weverWallet: creditProcessorDetails.wtonWallet,
            })
        }
        catch (e) {
            error('Balances update error', e)
        }
    }

    protected get web3(): Web3 {
        const network = findNetwork(this.leftNetwork?.chainId as string, 'evm')
        return new Web3(network?.rpcUrl as string)
    }

    public get amount(): EvmSwapTransferStoreData['amount'] {
        return this.data.amount
    }

    public get pipeline(): EvmSwapTransferStoreData['pipeline'] {
        return this.data.pipeline
    }

    public get creditProcessorAddress(): EvmSwapTransferStoreData['creditProcessorAddress'] {
        return this.data.creditProcessorAddress
    }

    public get deriveEventAddress(): EvmSwapTransferStoreData['deriveEventAddress'] {
        return this.data.deriveEventAddress
    }

    public get leftAddress(): EvmSwapTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): EvmSwapTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get token(): EvmSwapTransferStoreData['token'] {
        return this.data.token
    }

    public get creditProcessorState(): EvmSwapTransferStoreState['creditProcessorState'] {
        return this.state.creditProcessorState
    }

    public get eventState(): EvmSwapTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): EvmSwapTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get swapState(): EvmSwapTransferStoreState['swapState'] {
        return this.state.swapState
    }

    public get transferState(): EvmSwapTransferStoreState['transferState'] {
        return this.state.transferState
    }

    public get isDeployer(): boolean {
        return this.swapState?.deployer?.toString().toLowerCase() === this.everWallet.address?.toLowerCase()
    }

    public get isOwner(): boolean {
        return this.swapState?.owner?.toString().toLowerCase() === this.everWallet.address?.toLowerCase()
    }

    public get depositType(): EvmTransferQueryParams['depositType'] | undefined {
        return this.params?.depositType
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

    public get useBridgeAssets(): BridgeAssetsService {
        return this.bridgeAssets
    }

    #bridgeAssetsDisposer: IReactionDisposer | undefined

}
