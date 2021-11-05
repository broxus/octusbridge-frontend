import {
    addABI,
    decodeLogs,
    decodeMethod,
    keepNonDecodedLogs,
} from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'

import { EthAbi, TokenAbi } from '@/misc'
import {
    EventVoteData,
    EvmTransferQueryParams,
    EvmTransferStoreData,
    EvmTransferStoreState,
} from '@/modules/Bridge/types'
import { findNetwork } from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TokensCacheService } from '@/stores/TokensCacheService'
import { TonWalletService } from '@/stores/TonWalletService'
import { NetworkShape } from '@/types'
import { error } from '@/utils'


export class EvmToTonTransfer {

    protected data: EvmTransferStoreData = {
        amount: '',
        token: undefined,
    }

    protected state: EvmTransferStoreState = {
        transferState: undefined,
        prepareState: undefined,
        eventState: undefined,
    }

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected txPrepareUpdater: ReturnType<typeof setTimeout> | undefined

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

    public changeData<K extends keyof EvmTransferStoreData>(
        key: K,
        value: EvmTransferStoreData[K],
    ): void {
        this.data[key] = value
    }

    public changeState<K extends keyof EvmTransferStoreState>(
        key: K,
        value: EvmTransferStoreState[K],
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

        this.state.transferState = {
            confirmedBlocksCount: this.state.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        }

        try {
            const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

            if (tx == null || tx.to == null) {
                return
            }

            const wrapper = new this.evmWallet.web3.eth.Contract(EthAbi.VaultWrapper, tx.to)

            const vaultAddress: string = await wrapper.methods.vault().call()
            const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, vaultAddress)
            const vaultWrapperAddress: string = await vaultContract.methods.wrapper().call()
            const token = this.tokensCache.findTokenByVaultAddress(vaultAddress, this.leftNetwork.chainId)

            if (vaultWrapperAddress !== tx.to || token === undefined) {
                return
            }

            await this.tokensCache.syncEvmToken(token.root, this.leftNetwork.chainId)

            this.changeData('token', token)

            addABI(EthAbi.VaultWrapper)
            const methodCall = decodeMethod(tx.input)

            if (methodCall?.name !== 'deposit') {
                return
            }

            const ethereumConfiguration = token.vaults.find(
                vault => (
                    vault.vault.toLowerCase() === vaultAddress.toLowerCase()
                    && vault.chainId === this.leftNetwork?.chainId
                    && vault.depositType === 'default'
                ),
            )?.ethereumConfiguration

            if (ethereumConfiguration === undefined) {
                return
            }

            const ethConfigAddress = new Address(ethereumConfiguration)

            this.changeData('ethConfigAddress', ethConfigAddress)

            const ethConfig = new Contract(TokenAbi.EthEventConfig, ethConfigAddress)
            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            this.changeData('amount', methodCall.params[1].value)
            this.changeData('leftAddress', tx.from)

            const targetWid = methodCall.params[0].value[0]
            const targetAddress = methodCall.params[0].value[1]
            this.changeData(
                'rightAddress',
                `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`,
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

    protected runTransferUpdater(): void {
        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined || this.evmWallet.web3 === undefined) {
                return
            }

            const txReceipt = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)
            const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()

            if (txReceipt.blockNumber == null || networkBlockNumber == null) {
                this.changeState('transferState', {
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
                    this.changeState('transferState', transferState)
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

                const ethConfig = new Contract(
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
                this.changeState('transferState', transferState)

                this.runPrepareUpdater()
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

    public async prepare(): Promise<void> {
        if (this.tonWallet.account?.address === undefined || this.data.ethConfigAddress === undefined) {
            return
        }

        const ethConfig = new Contract(
            TokenAbi.EthEventConfig,
            this.data.ethConfigAddress,
        )

        this.changeState('prepareState', {
            status: 'pending',
        })

        try {
            await ethConfig.methods.deployEvent({
                eventVoteData: this.data.eventVoteData!,
            }).send({
                amount: '6000000000',
                bounce: true,
                from: this.tonWallet.account.address,
            })
        }
        catch (e: any) {
            error('Prepare error', e)
            this.changeState('prepareState', {
                status: 'disabled',
            })
        }
    }

    protected runPrepareUpdater(): void {
        this.stopPrepareUpdater();

        (async () => {
            if (this.data.deriveEventAddress === undefined) {
                if (this.prepareState?.status !== 'pending') {
                    this.changeState('prepareState', this.prepareState)
                }
                return
            }

            const cachedState = (await ton.getFullContractState({
                address: this.data.deriveEventAddress,
            })).state

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (this.prepareState?.status !== 'pending') {
                    this.changeState('prepareState', this.prepareState)
                }
                return
            }

            const eventContract = new Contract(
                TokenAbi.TokenTransferEthEvent,
                this.data.deriveEventAddress,
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
                this.changeState('prepareState', {
                    status: 'confirmed',
                })
            }
            this.changeState('eventState', eventState)
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

    public get transferState(): EvmTransferStoreState['transferState'] {
        return this.state.transferState
    }

    public get prepareState(): EvmTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get eventState(): EvmTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get amountNumber(): BigNumber {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return new BigNumber(0)
        }

        const tokenVault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (tokenVault?.decimals === undefined) {
            return new BigNumber(0)
        }

        return new BigNumber(this.amount || 0).shiftedBy(-tokenVault.decimals)
    }

    public get depositType(): string {
        return this.params?.depositType || 'default'
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

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tokensDisposer: IReactionDisposer | undefined

}
