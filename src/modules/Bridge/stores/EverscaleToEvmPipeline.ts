import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import isEqual from 'lodash.isequal'
import {
    computed,
    IReactionDisposer,
    makeObservable,
    observable,
    reaction,
    toJS,
} from 'mobx'
import { Address } from 'everscale-inpage-provider'

import rpc from '@/hooks/useRpcClient'
import { TokenAbi } from '@/misc'
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
import { Pipeline, TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'


// noinspection DuplicatedCode
export class EverscaleToEvmPipeline extends BaseStore<EverscaleTransferStoreData, EverscaleTransferStoreState> {

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EverscaleTransferQueryParams,
    ) {
        super()

        this.data = DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA
        this.state = DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE

        makeObservable<
            EverscaleToEvmPipeline,
            | 'data'
            | 'state'
        >(this, {
            data: observable,
            state: observable,
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

        this.#chainIdDisposer = reaction(() => this.evmWallet.chainId, async value => {
            if (this.evmWallet.isConnected && value === this.rightNetwork?.chainId) {
                await this.checkContract()
            }
        }, { delay: 30 })

        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, async isConnected => {
            if (isConnected && this.evmWallet.chainId === this.rightNetwork?.chainId) {
                await this.checkContract()
            }
        }, { delay: 30 })

        this.#everWalletDisposer = reaction(() => this.everWallet.isConnected, async isConnected => {
            if (isConnected) {
                await this.checkContract()
            }
        }, { delay: 30 })

        if (this.everWallet.isConnected) {
            await this.checkContract()
        }
    }

    public dispose(): void {
        this.#chainIdDisposer?.()
        this.#evmWalletDisposer?.()
        this.#everWalletDisposer?.()
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
            await rpc.ensureInitialized()

            const { state } = await rpc.getFullContractState({
                address: this.contractAddress,
            })

            if (!state?.isDeployed) {
                setTimeout(async () => {
                    await this.checkContract(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingContract', false)
                await this.resolve()
            }
        }
        catch (e) {
            error('Check contract error', e)
            this.setState('isCheckingContract', false)
        }
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.contractAddress === undefined
            || this.leftNetwork === undefined
            || this.prepareState?.status === 'confirmed'
        ) {
            return
        }

        const eventContract = new rpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)

        const [eventDetails, eventData] = await Promise.all([
            eventContract.methods.getDetails({ answerId: 0 }).call(),
            eventContract.methods.getDecodedData({ answerId: 0 }).call(),
        ])

        const {
            chainId,
            ethereum_address,
            owner_address,
            tokens,
        } = eventData

        const proxyAddress = eventDetails._initializer
        const proxyContract = new rpc.Contract(TokenAbi.ProxyTokenTransferEverscale, proxyAddress)

        const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

        const token = this.tokensCache.get(tokenAddress.toString())

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

        if (this.evmWallet.chainId === chainId) {
            await this.tokensCache.syncEvmToken(this.pipeline)
            this.runEventUpdater()
        }
    }

    public async release(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.web3 === undefined
                || this.leftNetwork === undefined
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.token === undefined
                || this.data.encodedEvent === undefined
            ) {
                return
            }

            this.setState('releaseState', {
                ...this.releaseState,
                status: 'pending',
            })

            const eventContract = new rpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
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

            const vaultContract = this.tokensCache.getEvmTokenVaultContract(this.pipeline)

            if (vaultContract === undefined) {
                this.setState('releaseState', {
                    ...this.releaseState,
                    status: 'disabled',
                })
                return
            }

            try {
                tries += 1

                await vaultContract.methods.saveWithdraw(
                    this.data.encodedEvent,
                    signatures.map(({ signature }) => signature),
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                })
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

    protected runEventUpdater(): void {
        debug('runEventUpdater', toJS(this.data), toJS(this.state))

        this.stopEventUpdater();

        (async () => {
            if (
                !this.evmWallet.isConnected
                || !this.everWallet.isConnected
                || this.evmWallet.web3 === undefined
                || this.contractAddress === undefined
            ) {
                return
            }

            const eventContract = new rpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
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

            const proxyAddress = eventDetails._initializer
            const proxyContract = new rpc.Contract(TokenAbi.ProxyTokenTransferEverscale, proxyAddress)

            const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

            const token = this.tokensCache.get(tokenAddress.toString())

            if (token === undefined) {
                return
            }

            await this.tokensCache.syncEvmToken(this.pipeline)

            const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

            const eventConfig = new rpc.Contract(TokenAbi.EverscaleEventConfig, proxyDetails._config.tonConfiguration)
            const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()
            const eventDataEncoded = mapTonCellIntoEthBytes(
                Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
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
                configurationWid: proxyDetails._config.tonConfiguration.toString().split(':')[0],
                configurationAddress: `0x${proxyDetails._config.tonConfiguration.toString().split(':')[1]}`,
                eventContractWid: this.contractAddress.toString().split(':')[0],
                eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                round: (await eventContract.methods.round_number({}).call()).round_number,
            }])
            const withdrawalId = this.evmWallet.web3.utils.keccak256(encodedEvent)

            this.setData({
                encodedEvent,
                withdrawalId,
            })

            if (
                this.evmWallet.isConnected
                && this.evmWallet.chainId === this.rightNetwork?.chainId
                && this.eventState?.status === 'confirmed'
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

    protected runReleaseUpdater(): void {
        debug('runReleaseUpdater', toJS(this.data), toJS(this.state))

        this.stopReleaseUpdater();

        (async () => {
            if (
                this.data.withdrawalId !== undefined
                && this.token !== undefined
                && this.rightNetwork !== undefined
                && isEqual(this.rightNetwork.chainId, this.evmWallet.chainId)
            ) {
                const vaultContract = this.tokensCache.getEvmTokenVaultContract(this.pipeline)
                const isReleased = await vaultContract?.methods.withdrawalIds(this.data.withdrawalId).call()

                if (this.releaseState?.status === 'pending' && this.releaseState?.isReleased === undefined) {
                    this.setState('releaseState', {
                        isReleased,
                        status: isReleased ? 'confirmed' : 'disabled',
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

    public get amount(): EverscaleTransferStoreData['amount'] {
        return this.data.amount
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
            this.params?.depositType,
        )
    }

    public get token(): TokenCache | undefined {
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

    public get useTokensCache(): TokensCacheService {
        return this.tokensCache
    }

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #everWalletDisposer: IReactionDisposer | undefined

}
