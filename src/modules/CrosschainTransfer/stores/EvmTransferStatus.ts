import {
    addABI,
    decodeLogs,
    decodeMethod,
    keepNonDecodedLogs,
    LogItem,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import {
    IReactionDisposer,
    makeAutoObservable,
    reaction,
    runInAction,
} from 'mobx'
import ton, { Address, Contract, DecodedAbiFunctionInputs } from 'ton-inpage-provider'
import { Transaction } from 'web3-core'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'

import { EthAbi, TokenAbi } from '@/misc'
import { EvmTransferStatusParams, NetworkShape } from '@/modules/CrosschainTransfer/types'
import { findNetwork } from '@/modules/CrosschainTransfer/utils'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { debug, error } from '@/utils'


type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']

type EvmTransferStatusStoreData = {
    amount: string;
    deriveEventAddress?: Address;
    ethConfigAddress?: string;
    eventVoteData?: EventVoteData;
    leftAddress?: string;
    log?: LogItem;
    rightAddress?: string;
    token: TokenCache | undefined;
    tx?: Transaction;
}

type EvmTransferStatusStoreState = {
    transferState?: {
        confirmedBlocksCount: number;
        eventBlocksToConfirm: number;
        status: 'confirmed' | 'pending' | 'disabled';
    },
    prepareState?: 'confirmed' | 'pending' | 'disabled';
    eventState?: {
        status: 'confirmed' | 'pending' | 'disabled' | 'rejected';
        confirmations: number;
        requiredConfirmations: number;
    };
}


export class EvmTransferStatus {

    protected data: EvmTransferStatusStoreData = {
        amount: '',
        token: undefined,
    }

    protected state: EvmTransferStatusStoreState = {
        transferState: undefined,
        prepareState: 'disabled',
        eventState: undefined,
    }

    constructor(
        protected readonly crystalWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EvmTransferStatusParams,
    ) {
        makeAutoObservable(this)
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#tokensDisposer = reaction(() => this.tokensCache.tokens, async () => {
            await this.resolve()
        })
        await this.resolve()
    }

    public dispose(): void {
        this.#tokensDisposer?.()
        this.stopTransferUpdater()
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.txHash === undefined
            || this.leftNetwork === undefined
        ) {
            return
        }

        const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

        debug(tx)

        if (tx == null) {
            return
        }

        const wrapperAddress = tx.to

        if (wrapperAddress == null) {
            return
        }

        const wrapper = new this.evmWallet.web3.eth.Contract(
            EthAbi.VaultWrapper,
            wrapperAddress,
        )

        // todo validate vault
        const vaultAddress = await wrapper.methods.vault().call()
        const vault = new this.evmWallet.web3.eth.Contract(
            EthAbi.Vault,
            vaultAddress,
        )
        const vaultWrapperAddress = await vault.methods.wrapper().call()

        const token = this.tokensCache.findByVaultAddress(vaultAddress, this.leftNetwork.chainId)

        runInAction(() => {
            this.data.token = token
        })

        if (vaultWrapperAddress !== wrapperAddress || token === undefined) {
            return
        }

        // const evmTokenAddress = await vault.methods.token().call()
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

        const ethConfigDetails = await ethConfig.methods.getDetails({
            answerId: 0,
        }).call()

        const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

        runInAction(() => {
            this.state.transferState = {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: parseInt(eventBlocksToConfirm, 10),
                status: 'pending',
            }
            this.data.amount = amount
            this.data.leftAddress = tx.from
            this.data.rightAddress = target
            this.data.ethConfigAddress = ethConfigAddress
            this.data.tx = tx
        })

        this.runTransferUpdater()
    }

    protected runTransferUpdater(): void {
        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined) {
                return
            }

            const tx = await this.evmWallet.web3?.eth.getTransaction(this.txHash)
            const txBlockNumber = tx?.blockNumber
            const networkBlockNumber = await this.evmWallet.web3?.eth.getBlockNumber()

            if (txBlockNumber && networkBlockNumber) {
                const transferState: EvmTransferStatusStoreState['transferState'] = {
                    confirmedBlocksCount: networkBlockNumber - txBlockNumber,
                    eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
                    status: this.state.transferState?.status || 'pending',
                }

                if (transferState.confirmedBlocksCount >= transferState.eventBlocksToConfirm) {
                    transferState.status = 'confirmed'
                    const txReceipt = await this.evmWallet.web3?.eth.getTransactionReceipt(this.txHash)
                    keepNonDecodedLogs()
                    addABI(EthAbi.Vault)
                    const decodedLogs = decodeLogs(txReceipt?.logs || [])

                    const log = txReceipt?.logs[decodedLogs.findIndex(l => l !== undefined && l.name === 'Deposit')]
                    const ethConfig = new Contract(TokenAbi.EthEventConfig, new Address(this.data.ethConfigAddress!))

                    const ethConfigDetails = await ethConfig.methods.getDetails({
                        answerId: 0,
                    }).call()

                    const eventData = mapEthBytesIntoTonCell(
                        atob(ethConfigDetails._basicConfiguration.eventABI),
                        log?.data as string,
                    )

                    const eventVoteData: EventVoteData = {
                        eventBlock: tx.blockHash as string,
                        eventBlockNumber: tx!.blockNumber!.toString(),
                        eventIndex: log!.logIndex!.toString(),
                        eventTransaction: tx.hash as string,
                        eventData,
                    }

                    const eventAddress = await ethConfig.methods.deriveEventAddress({
                        answerId: 0,
                        eventVoteData,
                    }).call()

                    runInAction(() => {
                        this.data.eventVoteData = eventVoteData
                        this.data.deriveEventAddress = eventAddress.eventContract
                    })

                    this.runPrepareUpdater()
                }
                else {
                    transferState.status = 'pending'
                }

                runInAction(() => {
                    this.data.tx = tx
                    this.state.transferState = transferState
                })
            }
            else {
                const transferState: EvmTransferStatusStoreState['transferState'] = {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
                    status: 'pending',
                }

                runInAction(() => {
                    this.data.tx = tx
                    this.state.transferState = transferState
                })
            }
        })().finally(() => {
            if (this.state.transferState?.status !== 'confirmed') {
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
                from: this.crystalWallet.account!.address,
                amount: '6000000000',
                bounce: true,
            })
        }
        catch (e) {
            error(e)
            this.state.prepareState = 'disabled'
        }
    }

    protected runPrepareUpdater(): void {
        this.stopPrepareUpdater();

        (async () => {
            const { prepareState } = this.state

            if (this.data.deriveEventAddress === undefined) {
                runInAction(() => {
                    if (this.state.prepareState !== 'pending') {
                        this.state.prepareState = prepareState
                    }
                })
            }
            else {
                const eventState = (await ton.getFullContractState({ address: this.data.deriveEventAddress })).state
                if (eventState === undefined || !eventState?.isDeployed) {
                    runInAction(() => {
                        if (this.state.prepareState !== 'pending') {
                            this.state.prepareState = prepareState
                        }
                    })
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
                            status: 'pending',
                            confirmations: eventDetails._confirms.length,
                            requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
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
            if (this.state.eventState?.status !== 'confirmed' && this.state.eventState?.status !== 'rejected') {
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

    public get amount(): EvmTransferStatusStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        if (this.data.token === undefined || this.leftNetwork?.chainId === undefined) {
            return new BigNumber(0)
        }

        const vault = this.tokensCache.getTokenVault(this.data.token.root, this.leftNetwork.chainId)

        if (vault?.decimals === undefined) {
            return new BigNumber(0)
        }

        return new BigNumber(this.data.amount).shiftedBy(-vault.decimals)
    }

    public get leftAddress(): EvmTransferStatusStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType) as NetworkShape
    }

    public get rightAddress(): EvmTransferStatusStoreData['rightAddress'] {
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

    public get transferState(): EvmTransferStatusStoreState['transferState'] {
        return this.state.transferState
    }

    public get prepareState(): EvmTransferStatusStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get eventState(): EvmTransferStatusStoreState['eventState'] {
        return this.state.eventState
    }

    public get txHash(): EvmTransferStatusParams['txHash'] | undefined {
        return this.params?.txHash
    }

    protected transactionTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected transactionPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
