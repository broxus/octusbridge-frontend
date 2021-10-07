import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import {
    IReactionDisposer,
    makeAutoObservable,
    reaction,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'

import { TokenAbi } from '@/misc'
import {
    EventStateStatus,
    NetworkShape,
    TonTransferQueryParams,
    TonTransferStoreData,
    TonTransferStoreState,
} from '@/modules/Bridge/types'
import { findNetwork } from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { error } from '@/utils'


export class TonTransfer {

    protected data: TonTransferStoreData = {
        amount: '',
        token: undefined,
        withdrawalId: undefined,
    }

    protected state: TonTransferStoreState = {
        isContractDeployed: false,
        eventState: undefined,
        prepareState: undefined,
        releaseState: undefined,
    }

    constructor(
        protected readonly tonWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: TonTransferQueryParams,
    ) {
        makeAutoObservable(this)
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        const runCheck = async () => {
            switch (true) {
                case this.prepareState !== 'confirmed':
                    this.changeState('prepareState', 'pending')

                    if (!this.state.isContractDeployed) {
                        this.checkContract()
                    }
                    else {
                        try { await this.resolve() }
                        catch (e) {}
                    }
                    break

                case this.prepareState === 'confirmed' && (this.eventState?.status !== 'confirmed'):
                    if (this.token === undefined) {
                        break
                    }

                    this.changeState('eventState', {
                        confirmations: this.eventState?.confirmations || 0,
                        requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                        status: 'pending',
                    })
                    await this.tokensCache.syncEvmToken(this.token.root, this.evmWallet.chainId)
                    this.runEventUpdater()
                    break

                default:
            }
        }

        this.#chainIdDisposer = reaction(() => this.evmWallet.chainId, async value => {
            if (
                this.evmWallet.isConnected
                && this.tonWallet.isConnected
                && value === this.rightNetwork?.chainId
            ) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, async () => {
            if (
                this.evmWallet.isConnected
                && this.tonWallet.isConnected
                && this.evmWallet.chainId === this.rightNetwork?.chainId
            ) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, async () => {
            if (this.evmWallet.isConnected && this.tonWallet.isConnected) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#contractDisposer = reaction(() => this.state.isContractDeployed, async () => {
            if (this.evmWallet.isConnected && this.tonWallet.isConnected) {
                try { await this.resolve() }
                catch (e) {}
            }
        })

        this.changeState('prepareState', 'pending')

        if (this.evmWallet.isConnected && this.tonWallet.isConnected) {
            await runCheck()
        }
    }

    public dispose(): void {
        this.#chainIdDisposer?.()
        this.#evmWalletDisposer?.()
        this.#tonWalletDisposer?.()
        this.#contractDisposer?.()
        this.stopEventUpdater()
        this.stopReleaseUpdater()
    }

    public changeData<K extends keyof TonTransferStoreData>(
        key: K,
        value: TonTransferStoreData[K],
    ): void {
        this.data[key] = value
    }

    public changeState<K extends keyof TonTransferStoreState>(
        key: K,
        value: TonTransferStoreState[K],
    ): void {
        this.state[key] = value
    }

    public checkContract(): void {
        const check = async () => {
            if (this.contractAddress !== undefined) {
                this.changeState('prepareState', this.state.prepareState || 'pending')

                try {
                    await ton.ensureInitialized()

                    const { state } = await ton.getFullContractState({
                        address: new Address(this.contractAddress),
                    })

                    if (state?.isDeployed) {
                        this.changeState('isContractDeployed', true)
                    }
                }
                catch (e) {
                    error('Check contract error', e)
                }
            }
        }

        check().then(() => {
            if (!this.state.isContractDeployed) {
                setTimeout(() => {
                    this.checkContract()
                }, 5000)
            }
        })
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.contractAddress === undefined
            || this.leftNetwork === undefined
        ) {
            return
        }

        const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))

        const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()
        const eventData = await eventContract.methods.getDecodedData({ answerId: 0 }).call()

        const proxyAddress = eventDetails._initializer
        const proxyContract = new Contract(TokenAbi.TokenTransferProxy, proxyAddress)

        const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

        const {
            chainId,
            ethereum_address,
            owner_address,
            tokens,
        } = eventData

        const token = this.tokensCache.get(tokenAddress.toString())

        if (token === undefined) {
            return
        }

        const leftAddress = owner_address.toString()
        const rightAddress = `0x${new BigNumber(ethereum_address).toString(16).padStart(40, '0')}`

        this.changeData('amount', tokens)
        this.changeData('chainId', chainId)
        this.changeData('leftAddress', leftAddress)
        this.changeData('rightAddress', rightAddress)
        this.changeData('token', token)
        this.changeState('prepareState', 'confirmed')

        if (this.evmWallet.chainId === chainId) {
            this.changeState('eventState', {
                confirmations: this.eventState?.confirmations || 0,
                requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                status: this.eventState?.status || 'pending',
            })
            await this.tokensCache.syncEvmToken(token.root, chainId)
            this.runEventUpdater()
        }
    }

    protected runEventUpdater(): void {
        this.stopEventUpdater();

        (async () => {
            if (
                !this.evmWallet.isConnected
                || !this.tonWallet.isConnected
                || this.evmWallet.web3 === undefined
                || this.contractAddress === undefined
            ) {
                return
            }

            const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

            let status: EventStateStatus = 'pending'

            if (eventDetails._status === '2') {
                status = 'confirmed'
            }
            else if (eventDetails._status === '3') {
                status = 'rejected'
            }

            this.changeState('eventState', {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status,
            })

            if (this.eventState?.status !== 'confirmed') {
                return
            }

            const proxyAddress = eventDetails._initializer
            const proxyContract = new Contract(TokenAbi.TokenTransferProxy, proxyAddress)

            const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

            const token = this.tokensCache.get(tokenAddress.toString())

            if (token === undefined) {
                return
            }

            const { chainId } = await eventContract.methods.getDecodedData({ answerId: 0 }).call()

            await this.tokensCache.syncEvmToken(token.root, chainId)

            const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

            const eventConfig = new Contract(TokenAbi.TonEventConfig, proxyDetails.value0.tonConfiguration)

            const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()

            const eventAbi = atob(eventConfigDetails._basicConfiguration.eventABI)
            const eventDataEncoded = mapTonCellIntoEthBytes(
                eventAbi,
                eventDetails._eventInitData.voteData.eventData,
            )

            const encodedEvent = this.evmWallet.web3.eth.abi.encodeParameters([{
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
                configurationWid: proxyDetails.value0.tonConfiguration.toString().split(':')[0],
                configurationAddress: `0x${proxyDetails.value0.tonConfiguration.toString().split(':')[1]}`,
                eventContractWid: this.contractAddress.split(':')[0],
                eventContractAddress: `0x${this.contractAddress.split(':')[1]}`,
                proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                round: (await eventContract.methods.round_number({}).call()).round_number,
            }])
            const withdrawalId = this.evmWallet.web3.utils.keccak256(encodedEvent)

            this.changeData('encodedEvent', encodedEvent)
            this.changeData('withdrawalId', withdrawalId)

            if (
                this.evmWallet.isConnected
                && this.evmWallet.chainId === this.rightNetwork?.chainId
                && this.eventState.status === 'confirmed'
            ) {
                this.runReleaseUpdater()
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

    public async release(reject?: () => void): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.rightNetwork === undefined
            || this.contractAddress === undefined
            || this.token === undefined
            || this.data.encodedEvent === undefined
        ) {
            return
        }

        const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))
        const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

        const signatures = eventDetails._signatures.map(sign => {
            const signature = `0x${Buffer.from(sign, 'base64').toString('hex')}`
            const address = this.evmWallet.web3!.eth.accounts.recover(
                this.evmWallet.web3!.utils.sha3(this.data.encodedEvent!)!,
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

        const wrapperContract = this.tokensCache.getEthTokenVaultWrapperContract(
            this.token.root,
            this.rightNetwork.chainId,
        )

        if (wrapperContract === undefined) {
            return
        }

        try {
            await wrapperContract.methods.saveWithdraw(
                this.data.encodedEvent,
                signatures.map(({ signature }) => signature),
                0,
            ).send({
                from: this.evmWallet.address,
            })
        }
        catch (e: any) {
            if (e.code === 4001) {
                reject?.()
            }
            error('Release tokens error', e)
        }
    }

    protected runReleaseUpdater(): void {
        this.stopReleaseUpdater();

        (async () => {
            if (
                this.data.withdrawalId !== undefined
                && this.token !== undefined
                && this.rightNetwork !== undefined
                && this.evmWallet.chainId === this.rightNetwork.chainId
            ) {
                const vaultContract = this.tokensCache.getEthTokenVaultContract(
                    this.token.root,
                    this.rightNetwork.chainId,
                )
                const released = await vaultContract?.methods.withdrawIds(this.data.withdrawalId).call()

                if (released) {
                    this.changeState('releaseState', 'confirmed')
                }
            }
        })().finally(() => {
            if (this.releaseState !== 'confirmed' && this.releaseState !== 'rejected') {
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

    public get amount(): TonTransferStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        return this.data.token === undefined
            ? new BigNumber(0)
            : new BigNumber(this.data.amount).shiftedBy(-this.data.token.decimals)
    }

    public get leftAddress(): TonTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): TonTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType) as NetworkShape
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

    public get contractAddress(): TonTransferQueryParams['contractAddress'] | undefined {
        return this.params?.contractAddress
    }

    public get prepareState(): TonTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get eventState(): TonTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get releaseState(): TonTransferStoreState['releaseState'] {
        return this.state.releaseState
    }

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #contractDisposer: IReactionDisposer | undefined

}
