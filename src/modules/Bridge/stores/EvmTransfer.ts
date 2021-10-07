import {
    addABI,
    decodeLogs,
    decodeMethod,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import {
    IReactionDisposer,
    makeAutoObservable,
    reaction,
    runInAction,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'

import { NetworkShape } from '@/bridge'
import { EthAbi, TokenAbi } from '@/misc'
import {
    EventVoteData,
    EvmTransferQueryParams,
    EvmTransferStoreData,
    EvmTransferStoreState,
} from '@/modules/Bridge/types'
import { findNetwork } from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { debug, error } from '@/utils'


export class EvmTransfer {

    protected data: EvmTransferStoreData = {
        amount: '',
        token: undefined,
    }

    protected state: EvmTransferStoreState = {
        transferState: undefined,
        prepareState: undefined,
        eventState: undefined,
    }

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly tonWallet: TonWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        makeAutoObservable(this)
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
        this.stopPrepareUpdater()
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

        this.state.transferState = {
            confirmedBlocksCount: this.state.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        }

        try {
            const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

            if (tx == null) {
                return
            }

            const wrapperAddress = tx.to

            if (wrapperAddress == null) {
                return
            }

            const wrapper = new this.evmWallet.web3.eth.Contract(EthAbi.VaultWrapper, wrapperAddress)

            const vaultAddress = await wrapper.methods.vault().call()

            const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vaultAddress)

            const vaultWrapperAddress = await vaultContract.methods.wrapper().call()

            const token = this.tokensCache.findByVaultAddress(vaultAddress, this.leftNetwork.chainId)

            if (vaultWrapperAddress !== wrapperAddress || token === undefined) {
                return
            }

            await this.tokensCache.syncEvmToken(token.root, this.leftNetwork.chainId)

            runInAction(() => {
                this.data.token = token
            })

            addABI(EthAbi.VaultWrapper)
            const methodCall = decodeMethod(tx.input)

            if (methodCall?.name !== 'deposit') {
                return
            }

            const ethConfigAddress = token.vaults.find(
                value => (
                    value.vault.toLowerCase() === vaultAddress.toLowerCase()
                    && value.chainId === this.leftNetwork?.chainId
                ),
            )?.ethereumConfiguration

            if (ethConfigAddress === undefined) {
                return
            }

            const amount = methodCall.params[1].value
            const targetWid = methodCall.params[0].value[0]
            const targetAddress = methodCall.params[0].value[1]
            const target = `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`
            const ethConfig = new Contract(TokenAbi.EthEventConfig, new Address(ethConfigAddress))

            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()

            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            runInAction(() => {
                this.data.amount = amount
                this.data.ethConfigAddress = ethConfigAddress
                this.data.leftAddress = tx.from
                this.data.rightAddress = target
                this.state.transferState = {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: parseInt(eventBlocksToConfirm, 10),
                    status: 'pending',
                }
                this.data.tx = tx
            })

            this.runTransferUpdater()
        }
        catch (e) {
            error('Resolve error', e)
            runInAction(() => {
                this.state.transferState = {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: 0,
                    status: 'disabled',
                }
            })
        }
    }

    protected runTransferUpdater(): void {
        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined || this.evmWallet.web3 === undefined) {
                return
            }

            const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

            const txBlockNumber = tx.blockNumber

            const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()

            if (txBlockNumber == null || networkBlockNumber == null) {
                runInAction(() => {
                    this.data.tx = tx
                    this.state.transferState = {
                        confirmedBlocksCount: 0,
                        eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                        status: 'pending',
                    }
                })
                return
            }

            const transferState: EvmTransferStoreState['transferState'] = {
                confirmedBlocksCount: networkBlockNumber - txBlockNumber,
                eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                status: this.transferState?.status || 'pending',
            }

            if (transferState.confirmedBlocksCount >= transferState.eventBlocksToConfirm) {
                transferState.status = 'confirmed'

                const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)

                if (!txReceipt.status) {
                    transferState.status = 'rejected'
                    runInAction(() => {
                        this.state.transferState = transferState
                    })
                    return
                }

                keepNonDecodedLogs()
                addABI(EthAbi.Vault)

                const decodedLogs = decodeLogs(txReceipt?.logs || [])
                const log = txReceipt.logs[decodedLogs.findIndex(l => l !== undefined && l.name === 'Deposit')]

                if (log?.data == null) {
                    return
                }

                const ethConfig = new Contract(TokenAbi.EthEventConfig, new Address(this.data.ethConfigAddress!))

                const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()

                const eventData = mapEthBytesIntoTonCell(
                    atob(ethConfigDetails._basicConfiguration.eventABI),
                    log.data,
                )

                const eventVoteData: EventVoteData = {
                    eventBlock: tx.blockHash as string,
                    eventBlockNumber: tx.blockNumber!.toString(),
                    eventIndex: log!.logIndex!.toString(),
                    eventTransaction: tx.hash as string,
                    eventData,
                }

                const eventAddress = await ethConfig.methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                }).call()

                debug({
                    tx,
                    txReceipt,
                    decodedLogs,
                    ethConfig,
                    eventData,
                    eventVoteData,
                })

                runInAction(() => {
                    this.data.deriveEventAddress = eventAddress.eventContract
                    this.data.eventVoteData = eventVoteData
                    this.state.transferState = transferState
                })

                this.runPrepareUpdater()
            }
            else {
                transferState.status = 'pending'

                runInAction(() => {
                    this.state.transferState = transferState
                })
            }
        })().finally(() => {
            if (this.state.transferState?.status !== 'confirmed' && this.state.transferState?.status !== 'rejected') {
                this.transactionTransferUpdater = setTimeout(() => {
                    this.runTransferUpdater()
                }, 5000)
            }
        })
    }

    protected stopTransferUpdater(): void {
        if (this.transactionTransferUpdater !== undefined) {
            clearTimeout(this.transactionTransferUpdater)
            this.transactionTransferUpdater = undefined
        }
    }

    public async prepare(): Promise<void> {
        const ethConfig = new Contract(TokenAbi.EthEventConfig, new Address(this.data.ethConfigAddress!))

        this.state.prepareState = 'pending'

        try {
            await ethConfig.methods.deployEvent({
                eventVoteData: this.data.eventVoteData!,
            }).send({
                amount: '6000000000',
                bounce: true,
                from: this.tonWallet.account!.address,
            })
        }
        catch (e) {
            error('Prepare error', e)
            this.state.prepareState = 'disabled'
        }
    }

    protected runPrepareUpdater(): void {
        this.stopPrepareUpdater();

        (async () => {
            if (this.data.deriveEventAddress === undefined) {
                if (this.prepareState !== 'pending') {
                    runInAction(() => {
                        this.state.prepareState = this.prepareState
                    })
                }
            }
            else {
                const eventState = (await ton.getFullContractState({ address: this.data.deriveEventAddress })).state
                if (eventState === undefined || !eventState?.isDeployed) {
                    if (this.prepareState !== 'pending') {
                        runInAction(() => {
                            this.state.prepareState = this.prepareState
                        })
                    }
                }
                else {
                    runInAction(() => {
                        this.state.prepareState = 'confirmed'
                    })

                    const eventContract = new Contract(TokenAbi.TokenTransferEthEvent, this.data.deriveEventAddress)

                    const eventDetails = await eventContract.methods.getDetails({
                        answerId: 0,
                    }).call({
                        cachedState: eventState,
                    })

                    runInAction(() => {
                        this.state.eventState = {
                            confirmations: eventDetails._confirms.length,
                            requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                            status: 'pending',
                        }

                        if (eventDetails._status === '2') {
                            this.state.eventState.status = 'confirmed'
                        }
                        else if (eventDetails._status === '3') {
                            this.state.eventState.status = 'rejected'
                        }
                    })
                }
            }
        })().finally(() => {
            if (
                this.eventState?.status !== 'confirmed'
                && this.eventState?.status !== 'rejected'
            ) {
                this.transactionPrepareUpdater = setTimeout(() => {
                    this.runPrepareUpdater()
                }, 5000)
            }
        })
    }

    protected stopPrepareUpdater(): void {
        if (this.transactionPrepareUpdater !== undefined) {
            clearTimeout(this.transactionPrepareUpdater)
            this.transactionPrepareUpdater = undefined
        }
    }

    public get amount(): EvmTransferStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return new BigNumber(0)
        }

        const vault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (vault?.decimals === undefined) {
            return new BigNumber(0)
        }

        return new BigNumber(this.amount || 0).shiftedBy(-vault.decimals)
    }

    public get leftAddress(): EvmTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType) as NetworkShape
    }

    public get rightAddress(): EvmTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): NetworkShape | undefined {
        if (this.params?.toId === undefined || this.params?.toType === undefined) {
            return undefined
        }
        return findNetwork(this.params.toId, this.params.toType) as NetworkShape
    }

    public get token(): TokenCache | undefined {
        return this.data.token
    }

    public get transferState(): EvmTransferStoreState['transferState'] {
        return this.state.transferState
    }

    public get prepareState(): EvmTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get eventState(): EvmTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get txHash(): EvmTransferQueryParams['txHash'] | undefined {
        return this.params?.txHash
    }

    protected transactionTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected transactionPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
