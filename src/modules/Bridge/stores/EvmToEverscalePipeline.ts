import {
    addABI,
    decodeLogs,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import {
    computed,
    IReactionDisposer,
    makeObservable,
    observable,
    reaction,
    toJS,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'

import { EthAbi, TokenAbi } from '@/misc'
import {
    DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA,
    DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    EventVoteData,
    EvmTransferQueryParams,
    EvmTransferStoreData,
    EvmTransferStoreState,
} from '@/modules/Bridge/types'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { Pipeline, TokensCacheService } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'
import { BaseStore } from '@/stores/BaseStore'


export class EvmToEverscalePipeline extends BaseStore<EvmTransferStoreData, EvmTransferStoreState> {

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected txPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        super()

        this.data = DEFAULT_EVM_TO_TON_TRANSFER_STORE_DATA
        this.state = DEFAULT_EVM_TO_TON_TRANSFER_STORE_STATE

        makeObservable<
            EvmToEverscalePipeline,
            | 'data'
            | 'state'
        >(this, {
            data: observable,
            state: observable,
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
            useTokensCache: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, async isConnected => {
            if (isConnected) {
                await this.checkTransaction()
            }
        }, { delay: 30 })

        this.#tokensDisposer = reaction(() => this.tokensCache.tokens, async () => {
            if (this.evmWallet.isConnected) {
                await this.checkTransaction()
            }
        }, { delay: 30 })

        if (this.evmWallet.isConnected) {
            await this.checkTransaction()
        }
    }

    public dispose(): void {
        this.#evmWalletDisposer?.()
        this.#tokensDisposer?.()
        this.stopTransferUpdater()
        this.stopPrepareUpdater()
    }

    public async checkTransaction(force: boolean = false): Promise<void> {
        if (
            this.txHash === undefined
            || this.evmWallet.web3 === undefined
            || (this.state.isCheckingTransaction && !force)
        ) {
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
            const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                setTimeout(async () => {
                    await this.checkTransaction(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingTransaction', false)
                await this.resolve()
            }
        }
        catch (e) {
            error('Check transaction error', e)
            this.setState('isCheckingTransaction', false)
        }
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.txHash === undefined
            || this.leftNetwork === undefined
            || this.tokensCache.tokens.length === 0
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
            const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                await this.checkTransaction()
                return
            }

            addABI(EthAbi.Vault)

            const depositLog = decodeLogs(txReceipt.logs).find(log => log?.name === 'Deposit')

            if (depositLog == null) {
                return
            }

            const token = this.tokensCache.findTokenByVaultAddress(
                depositLog.address,
                this.leftNetwork.chainId,
            )

            if (token === undefined) {
                return
            }

            this.setData('token', token)

            await this.tokensCache.syncEvmToken(this.pipeline)

            const ethereumConfiguration = this.pipeline?.ethereumConfiguration

            if (ethereumConfiguration === undefined) {
                return
            }

            const ethConfigAddress = new Address(ethereumConfiguration)

            this.setData('ethConfigAddress', ethConfigAddress)

            const ethConfig = new rpc.Contract(TokenAbi.EthEventConfig, ethConfigAddress)
            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

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
        if (this.everWallet.account?.address === undefined || this.data.ethConfigAddress === undefined) {
            return
        }

        const ethConfigContract = new rpc.Contract(
            TokenAbi.EthEventConfig,
            this.data.ethConfigAddress,
        )

        this.setState('prepareState', {
            ...this.prepareState,
            isDeploying: true,
            status: 'pending',
        })

        try {
            await ethConfigContract.methods.deployEvent({
                eventVoteData: this.data.eventVoteData!,
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

    protected runTransferUpdater(): void {
        debug('runTransferUpdater', toJS(this.data), toJS(this.state))

        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined || this.evmWallet.web3 === undefined) {
                return
            }

            const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)
            const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()

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
                const log = txReceipt.logs[decodedLogs.findIndex(
                    l => l !== undefined && l.name === 'Deposit',
                )]

                if (log?.data == null || this.data.ethConfigAddress === undefined) {
                    return
                }

                const ethConfig = new rpc.Contract(
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
            if (this.prepareState?.isDeploying === true) {
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

            const cachedState = (await rpc.getFullContractState({
                address: this.deriveEventAddress,
            })).state

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (isFirstIteration) {
                    this.setState('prepareState', {
                        ...this.prepareState,
                        isDeployed: false,
                        status: 'disabled',
                    })
                }
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
                return
            }

            const eventContract = new rpc.Contract(
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

    public get pipeline(): Pipeline | undefined {
        if (
            this.token?.root === undefined
            || this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.rightNetwork?.type === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return undefined
        }

        return this.tokensCache.pipeline(
            this.token.root,
            `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
            `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            this.depositType,
        )
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

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    #evmWalletDisposer: IReactionDisposer | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
