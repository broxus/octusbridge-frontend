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
import { CrosschainTransferStatusParams } from '@/modules/CrosschainTransfer/providers'
import { TokenCache as EvmTokenCache, EvmTokensCacheService } from '@/stores/EvmTokensCacheService'
import { TokenCache as TonTokenCache, TonTokensCacheService } from '@/stores/TonTokensCacheService'
import { CrystalWalletService } from '@/stores/CrystalWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { debug, error } from '@/utils'
import { findNetwork } from '@/modules/CrosschainTransfer/utils'
import { NetworkShape } from '@/modules/CrosschainTransfer/types'

type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']


type CrosschainStatusStoreData = {
    amount: string;
    ethConfigAddress?: string;
    eventVoteData?: EventVoteData;
    deriveEventAddress?: Address;
    leftAddress?: string;
    log?: LogItem;
    rightAddress?: string;
    token: TonTokenCache | EvmTokenCache | undefined;
    tx?: Transaction;
}

type CrosschainStatusStoreState = {
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


export class CrosschainStatus {

    protected data: CrosschainStatusStoreData = {
        amount: '',
        token: undefined,
    }

    protected state: CrosschainStatusStoreState = {
        transferState: undefined,
        prepareState: 'disabled',
        eventState: undefined,
    }

    constructor(
        protected readonly crystalWallet: CrystalWalletService,
        protected readonly tonTokensCache: TonTokensCacheService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly evmTokensCache: EvmTokensCacheService,
        protected readonly params?: CrosschainTransferStatusParams,
    ) {
        makeAutoObservable(this)
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#tokensDisposer = reaction(() => this.evmTokensCache.tokens, async () => {
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

        const token = this.evmTokensCache.findByVault(vaultAddress, this.leftNetwork.chainId)

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
                const transferState: CrosschainStatusStoreState['transferState'] = {
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
                const transferState: CrosschainStatusStoreState['transferState'] = {
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

    public get amount(): CrosschainStatusStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        return this.data.token === undefined
            ? new BigNumber(0)
            : new BigNumber(this.data.amount).shiftedBy(-(this.data.token as EvmTokenCache).evm.decimals)
    }

    public get leftAddress(): CrosschainStatusStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType) as NetworkShape
    }

    public get rightAddress(): CrosschainStatusStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): NetworkShape | undefined {
        if (this.params?.toId === undefined || this.params?.toType === undefined) {
            return undefined
        }
        return findNetwork(this.params.toId, this.params.toType) as NetworkShape
    }

    public get token(): TonTokenCache | EvmTokenCache | undefined {
        return this.data.token
    }

    public get transferState(): CrosschainStatusStoreState['transferState'] {
        return this.state.transferState
    }

    public get prepareState(): CrosschainStatusStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get eventState(): CrosschainStatusStoreState['eventState'] {
        return this.state.eventState
    }

    public get txHash(): CrosschainTransferStatusParams['txHash'] | undefined {
        return this.params?.txHash
    }

    protected transactionTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected transactionPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
