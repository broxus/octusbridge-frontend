import {
    addABI,
    decodeLogs,
    decodeMethod,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'
import {
    action, computed,
    IReactionDisposer, makeObservable, observable,
    reaction,
    toJS,
} from 'mobx'
import { Address, Contract } from 'everscale-inpage-provider'

import {
    BridgeConstants,
    DexConstants,
    EthAbi,
    TokenAbi,
    TokenWallet,
} from '@/misc'
import {
    DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA,
    DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    CreditProcessorState,
    EventVoteData,
    EvmSwapTransferStoreData,
    EvmSwapTransferStoreState,
    EvmTransferQueryParams,
} from '@/modules/Bridge/types'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TokenAssetVault, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    isGoodBignumber,
    throwException,
} from '@/utils'
import rpc from '@/hooks/useRpcClient'


// noinspection DuplicatedCode
export class EvmToTonSwapTransfer {

    protected data: EvmSwapTransferStoreData

    protected state: EvmSwapTransferStoreState

    protected txCreditProcessorUpdater: ReturnType<typeof setTimeout> | undefined

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected withdrawUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly tonWallet: TonWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        this.data = DEFAULT_EVM_SWAP_TRANSFER_STORE_DATA
        this.state = DEFAULT_EVM_SWAP_TRANSFER_STORE_STATE

        makeObservable<
            EvmToTonSwapTransfer,
            | 'data'
            | 'state'
            | 'creditProcessorContract'
            | 'tokenVault'
        >(this, {
            data: observable,
            state: observable,
            changeData: action.bound,
            changeState: action.bound,
            broadcast: action.bound,
            process: action.bound,
            cancel: action.bound,
            withdrawTokens: action.bound,
            withdrawWtons: action.bound,
            withdrawTons: action.bound,
            creditProcessorContract: computed,
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
            txHash: computed,
            useEvmWallet: computed,
            useTonWallet: computed,
            useTokensCache: computed,
            tokenVault: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#chainIdDisposer = reaction(() => this.evmWallet.chainId, async value => {
            if (
                this.evmWallet.isConnected
                && this.tonWallet.isConnected
                && value === this.leftNetwork?.chainId
            ) {
                await this.resolve()
            }
        })

        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, async isConnected => {
            if (
                isConnected
                && this.tonWallet.isConnected
                && this.evmWallet.chainId === this.leftNetwork?.chainId
            ) {
                await this.resolve()
            }
        })

        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, async isConnected => {
            if (
                isConnected
                && this.evmWallet.isConnected
                && this.evmWallet.chainId === this.leftNetwork?.chainId
            ) {
                await this.resolve()
            }
        })

        this.#tokensDisposer = reaction(() => this.tokensCache.tokens, async () => {
            if (
                this.evmWallet.isConnected
                && this.tonWallet.isConnected
                && this.evmWallet.chainId === this.leftNetwork?.chainId
            ) {
                await this.resolve()
            }
        })

        if (
            this.evmWallet.isConnected
            && this.tonWallet.isConnected
            && this.evmWallet.chainId === this.leftNetwork?.chainId
        ) {
            await this.resolve()
        }
    }

    public dispose(): void {
        this.#chainIdDisposer?.()
        this.#evmWalletDisposer?.()
        this.#tonWalletDisposer?.()
        this.#tokensDisposer?.()
        this.stopTransferUpdater()
        this.stopCreditProcessorUpdater()
        this.stopWithdrawUpdater()
    }

    public changeData<K extends keyof EvmSwapTransferStoreData>(
        key: K,
        value: EvmSwapTransferStoreData[K],
    ): void {
        this.data[key] = value
    }

    public changeState<K extends keyof EvmSwapTransferStoreState>(
        key: K,
        value: EvmSwapTransferStoreState[K],
    ): void {
        this.state[key] = value
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.txHash === undefined
            || this.leftNetwork === undefined
            || this.tokensCache.tokens.length === 0
            || this.transferState?.status === 'pending'
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        this.changeState('transferState', {
            confirmedBlocksCount: this.state.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        })

        try {
            const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

            if (tx == null || tx.to == null) {
                return
            }

            const wrapper = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, tx.to)

            const vaultAddress = await wrapper.methods.vault().call()
            const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vaultAddress)
            const vaultWrapperAddress = await vaultContract.methods.wrapper().call()

            const token = this.tokensCache.findTokenByVaultAddress(vaultAddress, this.leftNetwork.chainId)

            if (vaultWrapperAddress !== tx.to || token === undefined) {
                return
            }

            await this.tokensCache.syncEvmToken(token.root, this.leftNetwork.chainId)

            this.changeData('token', token)

            addABI(EthAbi.Vault)
            const methodCall = decodeMethod(tx.input)

            if (methodCall?.name !== 'depositToFactory') {
                return
            }

            const ethereumConfiguration = token.vaults.find(
                vault => (
                    vault.vault.toLowerCase() === vaultAddress.toLowerCase()
                    && vault.chainId === this.leftNetwork?.chainId
                    && vault.depositType === 'credit'
                ),
            )?.ethereumConfiguration

            if (ethereumConfiguration === undefined) {
                return
            }

            const ethConfigAddress = new Address(ethereumConfiguration)

            this.changeData('ethConfigAddress', ethConfigAddress)

            const ethConfig = rpc.createContract(TokenAbi.EthEventConfig, ethConfigAddress)
            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            this.changeData('amount', methodCall?.params[0].value)
            this.changeData('leftAddress', tx.from.toLowerCase())

            const targetWid = methodCall?.params[1].value
            const targetAddress = methodCall?.params[4].value
            this.changeData(
                'rightAddress',
                `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
            )

            this.changeState('transferState', {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: parseInt(eventBlocksToConfirm, 10),
                status: 'pending',
            })

            this.runTransferUpdater()
        }
        catch (e) {
            error('Resolve error', e)
            this.changeState('transferState', {
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
            || this.data.ethConfigAddress === undefined
            || this.tonWallet.account?.address === undefined
        ) {
            return
        }

        this.changeState('prepareState', {
            ...this.prepareState,
            isBroadcasting: true,
        } as EvmSwapTransferStoreState['prepareState'])

        try {
            const creditFactoryContract = rpc.createContract(
                TokenAbi.CreditFactory,
                BridgeConstants.CreditFactoryAddress,
            )

            await creditFactoryContract.methods.deployProcessorForUser({
                eventVoteData: this.data.eventVoteData,
                configuration: this.data.ethConfigAddress,
            }).send({
                amount: '5500000000',
                bounce: true,
                from: this.tonWallet.account.address,
            })
        }
        catch (e) {
            this.changeState('prepareState', {
                ...this.prepareState,
                isBroadcasting: false,
            } as EvmSwapTransferStoreState['prepareState'])
            error('Broadcasting error', e)
        }
    }

    public async process(): Promise<void> {
        if (
            this.swapState?.isCanceling === true
            || this.swapState?.isProcessing === true
            || this.creditProcessorContract === undefined
            || this.tonWallet.account?.address === undefined
        ) {
            return
        }

        this.changeState('swapState', {
            ...this.swapState,
            isProcessing: true,
        } as EvmSwapTransferStoreState['swapState'])

        try {
            await this.creditProcessorContract.methods.process({}).send({
                amount: '10000000',
                bounce: false,
                from: this.tonWallet.account.address,
            })

            this.changeState('swapState', {
                ...this.swapState,
                isStuck: false,
            }as EvmSwapTransferStoreState['swapState'])
        }
        catch (e) {
            this.changeState('swapState', {
                ...this.swapState,
                isProcessing: false,
            } as EvmSwapTransferStoreState['swapState'])
            error('Process error', e)
        }
    }

    public async cancel(): Promise<void> {
        if (
            this.swapState?.isCanceling === true
            || this.swapState?.isProcessing === true
            || this.creditProcessorContract === undefined
            || this.tonWallet.account?.address === undefined
        ) {
            return
        }

        this.changeState('swapState', {
            ...this.swapState,
            isCanceling: true,
        } as EvmSwapTransferStoreState['swapState'])

        try {
            const creditProcessorDetails = (await this.creditProcessorContract.methods.getDetails({
                answerId: 0,
            }).call()).value0

            await this.checkWithdrawBalances()

            const gasAmount = BigNumber.max(
                new BigNumber(creditProcessorDetails.debt).minus(this.swapState?.tonBalance || 0).plus('300000000'),
                new BigNumber('100000000'),
            )

            await this.creditProcessorContract.methods.cancel({}).send({
                amount: gasAmount.toFixed(),
                bounce: false,
                from: this.tonWallet.account.address,
            })
            await this.checkWithdrawBalances()
            this.changeState('swapState', {
                ...this.swapState,
                isStuck: false,
            }as EvmSwapTransferStoreState['swapState'])
        }
        catch (e) {
            this.changeState('swapState', {
                ...this.swapState,
                isCanceling: false,
            } as EvmSwapTransferStoreState['swapState'])
            error('Cancel error', e)
        }
    }

    public async withdrawTokens(): Promise<void> {
        if (
            this.swapState?.tokenBalance === undefined
            || this.swapState.tokenWallet === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorContract === undefined
            || this.tonWallet.account?.address === undefined
            || this.token === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawTokenUpdater()

        this.changeState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        await this.tokensCache.syncTonToken(this.token.root)

        if (this.token.wallet === undefined) {
            this.stopWithdrawUpdater()

            this.changeState('swapState', {
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
            new BigNumber('750000000').minus(this.swapState?.tonBalance || 0),
            new BigNumber('50000000'),
        )

        try {
            if (!isGoodBignumber(new BigNumber(this.swapState.tokenBalance || 0))) {
                this.stopWithdrawUpdater()
                throwException(`Invalid amount: ${gasAmount.toFixed()}`)
                return
            }

            await this.creditProcessorContract.methods.proxyTransferToRecipient({
                amount_: this.swapState.tokenBalance || 0,
                deployGrams,
                gasBackAddress: this.tonWallet.account.address,
                gasValue: proxyGasValue,
                notifyReceiver: false,
                recipient: this.tonWallet.account.address,
                payload: '',
                tokenWallet_: this.swapState.tokenWallet,
            }).send({
                amount: gasAmount.toFixed(),
                bounce: false,
                from: this.tonWallet.account.address,
            })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.changeState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            error('Withdraw token error', e)
        }
    }

    public async withdrawWtons(): Promise<void> {
        if (
            this.swapState?.tokenBalance === undefined
            || this.swapState.tokenWallet === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorContract === undefined
            || this.tonWallet.account?.address === undefined
            || this.token === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawWtonUpdater()

        this.changeState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        await this.tokensCache.syncTonToken(DexConstants.WTONRootAddress.toString())

        const wtonToken = this.tokensCache.get(DexConstants.WTONRootAddress.toString())

        if (wtonToken?.wallet === undefined) {
            this.stopWithdrawUpdater()

            this.changeState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            return
        }

        const isDeployed = wtonToken.balance !== undefined

        const deployGrams = !isDeployed ? '100000000' : '0'
        const proxyGasValue = !isDeployed ? '600000000' : '500000000'
        const gasAmount = BigNumber.max(
            new BigNumber('750000000').minus(this.swapState?.tonBalance || 0),
            new BigNumber('50000000'),
        )

        try {
            if (!isGoodBignumber(new BigNumber(this.swapState.wtonBalance || 0))) {
                this.stopWithdrawUpdater()
                throwException(`Invalid amount: ${this.swapState.wtonBalance}`)
                return
            }

            await this.creditProcessorContract.methods.proxyTransferToRecipient({
                amount_: this.swapState.wtonBalance || 0,
                deployGrams,
                gasBackAddress: this.tonWallet.account.address,
                gasValue: proxyGasValue,
                notifyReceiver: false,
                recipient: this.tonWallet.account.address,
                payload: '',
                tokenWallet_: this.swapState.tokenWallet,
            }).send({
                amount: gasAmount.toFixed(),
                bounce: false,
                from: this.tonWallet.account.address,
            })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.changeState('swapState', {
                ...this.swapState,
                isWithdrawing: false,
                status,
            })

            error('Withdraw WTON error', e)
        }
    }

    public async withdrawTons(): Promise<void> {
        if (
            this.swapState?.tonBalance === undefined
            || this.swapState.isWithdrawing
            || this.creditProcessorContract === undefined
            || this.tonWallet.account?.address === undefined
        ) {
            return
        }

        const { status } = this.swapState

        this.runWithdrawTonUpdater()

        this.changeState('swapState', {
            ...this.swapState,
            isWithdrawing: true,
            status: 'pending',
        })

        try {
            await this.creditProcessorContract.methods.sendGas({
                flag_: 128,
                to: this.tonWallet.account.address,
                value_: 0,
            }).send({
                amount: '10000000',
                bounce: false,
                from: this.tonWallet.account.address,
            })
        }
        catch (e) {
            this.stopWithdrawUpdater()

            this.changeState('swapState', {
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
            if (this.txHash === undefined || this.evmWallet.web3 === undefined) {
                return
            }

            const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null) {
                return
            }

            const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()

            if (txReceipt.blockNumber == null || networkBlockNumber == null) {
                this.changeState('transferState', {
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
                    this.changeState('transferState', transferState)
                    return
                }

                keepNonDecodedLogs()
                addABI(EthAbi.Vault)

                const decodedLogs = decodeLogs(txReceipt?.logs || [])
                const log = txReceipt.logs[decodedLogs.findIndex(
                    l => l !== undefined && l.name === 'FactoryDeposit',
                )]

                if (log?.data == null || this.data.ethConfigAddress === undefined) {
                    return
                }

                const ethConfig = rpc.createContract(
                    TokenAbi.EthEventConfig,
                    this.data.ethConfigAddress,
                )

                const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()

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

                this.changeData('eventVoteData', eventVoteData)

                const eventAddress = (await ethConfig.methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                }).call()).eventContract

                this.changeData('deriveEventAddress', eventAddress)

                const creditFactoryContract = rpc.createContract(
                    TokenAbi.CreditFactory,
                    BridgeConstants.CreditFactoryAddress,
                )

                const creditProcessorAddress = (await creditFactoryContract.methods.getCreditProcessorAddress({
                    answerId: 0,
                    eventVoteData,
                    configuration: this.data.ethConfigAddress,
                }).call()).value0

                this.changeData('creditProcessorAddress', creditProcessorAddress)

                this.changeState('transferState', transferState)

                this.changeState('prepareState', {
                    status: 'pending',
                })

                this.runCreditProcessorUpdater()
            }
            else {
                this.changeState('transferState', {
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
                    this.changeState('prepareState', this.prepareState)
                }
                return
            }

            const cachedState = (await rpc.getFullContractState({
                address: this.deriveEventAddress,
            })).state

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (this.prepareState?.status !== 'pending') {
                    this.changeState('prepareState', this.prepareState)
                }

                if (this.evmWallet.web3 !== undefined && this.txHash !== undefined) {
                    try {
                        const { blockNumber } = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)
                        const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()
                        this.changeState('transferState', {
                            ...this.transferState,
                            confirmedBlocksCount: networkBlockNumber - blockNumber,
                        } as EvmSwapTransferStoreState['transferState'])

                        const ts = parseInt(
                            (await this.evmWallet.web3.eth.getBlock(blockNumber)).timestamp.toString(),
                            10,
                        )

                        debug('Outdated ts', (Date.now() / 1000) - ts)

                        this.changeState('prepareState', {
                            ...this.prepareState,
                            isOutdated: ((Date.now() / 1000) - ts) >= 600,
                        } as EvmSwapTransferStoreState['prepareState'])
                    }
                    catch (e) {

                    }
                }

                return
            }

            if (this.creditProcessorContract === undefined || this.creditProcessorAddress === undefined) {
                return
            }

            await this.checkOwner()

            const creditProcessorDetails = (await this.creditProcessorContract.methods.getDetails({
                answerId: 0,
            }).call()).value0

            const state = parseInt(creditProcessorDetails.state, 10)
            const isCancelled = state === CreditProcessorState.Cancelled
            const isProcessed = state === CreditProcessorState.Processed

            if (this.creditProcessorState !== state) {
                this.changeState('swapState', {
                    ...this.swapState,
                    isCanceling: false,
                    isProcessing: false,
                } as EvmSwapTransferStoreState['swapState'])
            }

            this.changeState('creditProcessorState', state)

            if (isCancelled || isProcessed) {
                this.changeState('prepareState', {
                    status: 'confirmed',
                })
                this.changeState('eventState', {
                    confirmations: this.eventState?.confirmations || 0,
                    requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                    status: 'confirmed',
                })

                this.changeState('swapState', {
                    ...this.swapState,
                    isStuck: false,
                    status: isCancelled ? 'disabled' : 'pending',
                })

                if (isCancelled) {
                    await this.checkWithdrawBalances()
                }

                const swapState: EvmSwapTransferStoreState['swapState'] = {
                    ...this.swapState,
                    status: isCancelled ? 'disabled' : 'confirmed',
                }

                this.changeState('swapState', swapState)

                return
            }

            if (state >= CreditProcessorState.EventDeployInProgress) {
                if (this.prepareState?.status !== 'confirmed') {
                    this.changeState('prepareState', {
                        status: 'confirmed',
                    })
                }

                if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                    const eventContract = rpc.createContract(
                        TokenAbi.TokenTransferEthEvent,
                        this.deriveEventAddress,
                    )
                    const eventDetails = await eventContract.methods.getDetails({
                        answerId: 0,
                    }).call({
                        cachedState,
                    })

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

                    this.changeState('eventState', eventState)

                    if (eventState.status !== 'confirmed' && eventState.status !== 'rejected') {
                        return
                    }

                    if (eventState.status === 'confirmed') {
                        this.changeState('swapState', {
                            ...this.swapState,
                            status: 'pending',
                        })
                    }
                }
            }

            const tx = (await rpc.getTransactions({ address: this.deriveEventAddress })).transactions[0]

            this.changeState('swapState', {
                ...this.swapState,
                deployer: creditProcessorDetails.deployer,
            } as EvmSwapTransferStoreState['swapState'])

            const isStuckNow = this.swapState?.isStuck
            const isStuck = ((Date.now() / 1000) - tx.createdAt) >= 600 && !isCancelled && !isProcessed

            debug('Stuck ts', (Date.now() / 1000) - tx.createdAt)

            if ([
                CreditProcessorState.EventConfirmed,
                CreditProcessorState.SwapFailed,
                CreditProcessorState.SwapUnknown,
                CreditProcessorState.UnwrapFailed,
                CreditProcessorState.ProcessRequiresGas,
            ].includes(state) && isStuck) {
                this.changeState('swapState', {
                    ...this.swapState,
                    isStuck: isStuckNow === undefined ? true : isStuckNow,
                    status: 'pending',
                })
                return
            }

            this.changeState('swapState', {
                ...this.swapState,
                isStuck: isStuckNow,
            } as EvmSwapTransferStoreState['swapState'])

            if (this.eventState?.status === 'confirmed') {
                this.changeState('swapState', {
                    ...this.swapState,
                    status: 'pending',
                })
            }
            else {
                this.changeState('swapState', this.swapState)
            }
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
                this.changeState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                } as EvmSwapTransferStoreState['swapState'])
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.tokenBalance || 0))
                    ) {
                        runWithdrawTokenUpdater()
                    }
                    else {
                        this.changeState('swapState', {
                            ...this.swapState,
                            status,
                        } as EvmSwapTransferStoreState['swapState'])
                    }
                }, 5000)
            })
        }

        runWithdrawTokenUpdater()
    }

    protected runWithdrawWtonUpdater(): void {
        const status = this.swapState?.status

        const runWithdrawWtonUpdater = () => {
            debug('runWithdrawWtonUpdater', toJS(this.state.swapState))

            this.stopWithdrawUpdater();

            (async () => {
                await this.checkWithdrawBalances()
                const isWithdrawing = isGoodBignumber(new BigNumber(this.swapState?.wtonBalance || 0))
                this.changeState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                } as EvmSwapTransferStoreState['swapState'])
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.wtonBalance || 0))
                    ) {
                        runWithdrawWtonUpdater()
                    }
                    else {
                        this.changeState('swapState', {
                            ...this.swapState,
                            status,
                        } as EvmSwapTransferStoreState['swapState'])
                    }
                }, 5000)
            })
        }

        runWithdrawWtonUpdater()
    }

    protected runWithdrawTonUpdater(): void {
        const status = this.swapState?.status

        const runWithdrawTonUpdater = () => {
            debug('runWithdrawTonUpdater', toJS(this.state.swapState))

            this.stopWithdrawUpdater();

            (async () => {
                await this.checkWithdrawBalances()
                const isWithdrawing = isGoodBignumber(new BigNumber(this.swapState?.tonBalance || 0))
                this.changeState('swapState', {
                    ...this.swapState,
                    isWithdrawing,
                    status: isWithdrawing ? 'pending' : status,
                } as EvmSwapTransferStoreState['swapState'])
            })().finally(() => {
                this.withdrawUpdater = setTimeout(() => {
                    if (
                        this.swapState?.isWithdrawing
                        && isGoodBignumber(new BigNumber(this.swapState.tonBalance || 0))
                    ) {
                        runWithdrawTonUpdater()
                    }
                    else {
                        this.changeState('swapState', {
                            ...this.swapState,
                            status,
                        } as EvmSwapTransferStoreState['swapState'])
                    }
                }, 5000)
            })
        }

        runWithdrawTonUpdater()
    }

    protected stopWithdrawUpdater(): void {
        if (this.withdrawUpdater !== undefined) {
            clearTimeout(this.withdrawUpdater)
            this.withdrawUpdater = undefined
        }
    }

    protected async checkOwner(): Promise<void> {
        if (this.creditProcessorContract === undefined) {
            return
        }

        try {
            const owner = (await this.creditProcessorContract.methods.getCreditEventData({
                answerId: 0,
            }).call()).value0.user

            this.changeState('swapState', {
                ...this.swapState,
                owner,
            } as EvmSwapTransferStoreState['swapState'])
        }
        catch (e) {
            error('Check owner error', e)
        }
    }

    protected async checkWithdrawBalances(): Promise<void> {
        if (this.creditProcessorContract === undefined || this.creditProcessorAddress === undefined) {
            return
        }

        try {
            const creditProcessorDetails = (await this.creditProcessorContract.methods.getDetails({
                answerId: 0,
            }).call()).value0

            const [
                tokenBalance,
                { state: creditState },
                wtonBalance,
            ] = await Promise.all([
                TokenWallet.balance({
                    wallet: creditProcessorDetails.tokenWallet,
                }),
                rpc.getFullContractState({
                    address: this.creditProcessorAddress,
                }),
                TokenWallet.balance({
                    wallet: creditProcessorDetails.wtonWallet,
                }),
            ])

            this.changeState('swapState', {
                ...this.swapState,
                tokenBalance,
                tokenWallet: creditProcessorDetails.tokenWallet,
                tonBalance: creditState?.balance,
                wtonBalance,
                wtonWallet: creditProcessorDetails.wtonWallet,
            } as EvmSwapTransferStoreState['swapState'])
        }
        catch (e) {
            error('Balances update error', e)
        }
    }

    public get amount(): EvmSwapTransferStoreData['amount'] {
        return this.data.amount
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
        return this.swapState?.deployer?.toString().toLowerCase() === this.tonWallet.address?.toLowerCase()
    }

    public get isOwner(): boolean {
        return this.swapState?.owner?.toString().toLowerCase() === this.tonWallet.address?.toLowerCase()
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

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTonWallet(): TonWalletService {
        return this.tonWallet
    }

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    protected get creditProcessorContract(): Contract<typeof TokenAbi.CreditProcessor> | undefined {
        return this.creditProcessorAddress !== undefined
            ? rpc.createContract(TokenAbi.CreditProcessor, this.creditProcessorAddress)
            : undefined
    }

    protected get tokenVault(): TokenAssetVault | undefined {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return undefined
        }
        return this.tokensCache.getTokenVault(
            this.token.root,
            this.leftNetwork.chainId,
            'credit',
        )
    }

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
