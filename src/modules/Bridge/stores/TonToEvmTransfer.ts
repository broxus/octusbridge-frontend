import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import isEqual from 'lodash.isequal'
import {
    IReactionDisposer,
    makeAutoObservable,
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
    TonTransferQueryParams,
    TonTransferStoreData,
    TonTransferStoreState,
} from '@/modules/Bridge/types'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenAssetVault, TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'


export class TonToEvmTransfer {

    protected data: TonTransferStoreData

    protected state: TonTransferStoreState

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly tonWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: TonTransferQueryParams,
    ) {
        this.data = DEFAULT_TON_TO_EVM_TRANSFER_STORE_DATA
        this.state = DEFAULT_TON_TO_EVM_TRANSFER_STORE_STATE

        makeAutoObservable(this)
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        const runCheck = async () => {
            switch (true) {
                case this.prepareState?.status !== 'confirmed':
                    this.changeState('prepareState', {
                        status: 'pending',
                    })

                    if (!this.state.isContractDeployed) {
                        this.checkContract()
                    }
                    else {
                        try { await this.resolve() }
                        catch (e) {}
                    }
                    break

                case this.prepareState?.status === 'confirmed' && this.eventState?.status !== 'confirmed':
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

                case (
                    this.prepareState?.status === 'confirmed'
                    && this.eventState?.status === 'confirmed'
                    && this.releaseState?.status !== 'confirmed'
                ):
                    this.runReleaseUpdater()
                    break

                default:
            }
        }

        this.#chainIdDisposer = reaction(() => this.evmWallet.chainId, async value => {
            if (this.evmWallet.isConnected && value === this.rightNetwork?.chainId) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, async isConnected => {
            if (isConnected && this.evmWallet.chainId === this.rightNetwork?.chainId) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, async isConnected => {
            if (isConnected) {
                await runCheck()
            }
        }, { delay: 30 })

        this.#contractDisposer = reaction(() => this.state.isContractDeployed, async () => {
            if (this.tonWallet.isConnected) {
                try { await this.resolve() }
                catch (e) {}
            }
        })

        if (this.tonWallet.isConnected) {
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
            if (this.contractAddress === undefined) {
                return
            }

            this.changeState('prepareState', {
                status: this.prepareState?.status || 'pending',
            })

            try {
                await rpc.ensureInitialized()

                const { state } = await rpc.getFullContractState({
                    address: this.contractAddress,
                })

                if (state?.isDeployed) {
                    this.changeState('isContractDeployed', true)
                }
            }
            catch (e) {
                error('Check contract error', e)
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
            || this.prepareState?.status === 'confirmed'
        ) {
            return
        }

        const eventContract = rpc.createContract(TokenAbi.TokenTransferTonEvent, this.contractAddress)

        const [eventDetails, eventData] = await Promise.all([
            eventContract.methods.getDetails({ answerId: 0 }).call(),
            eventContract.methods.getDecodedData({ answerId: 0 }).call(),
        ])

        const proxyAddress = eventDetails._initializer
        const proxyContract = rpc.createContract(TokenAbi.TokenTransferProxy, proxyAddress)

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
        this.changeData('leftAddress', leftAddress.toLowerCase())
        this.changeData('rightAddress', rightAddress.toLowerCase())
        this.changeData('token', token)
        this.changeState('prepareState', {
            status: 'confirmed',
        })

        this.changeState('eventState', {
            confirmations: this.eventState?.confirmations || 0,
            requiredConfirmations: this.eventState?.requiredConfirmations || 0,
            status: this.eventState?.status || 'pending',
        })

        if (this.evmWallet.chainId === chainId) {
            await this.tokensCache.syncEvmToken(token.root, chainId)
            this.runEventUpdater()
        }
    }

    public async release(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.web3 === undefined
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.token === undefined
                || this.data.encodedEvent === undefined
            ) {
                return
            }

            this.changeState('releaseState', {
                ...this.releaseState,
                status: 'pending',
            })

            const eventContract = rpc.createContract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
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
                this.changeState('releaseState', {
                    ...this.releaseState,
                    status: 'disabled',
                })
                return
            }

            try {
                tries += 1

                await wrapperContract.methods.saveWithdraw(
                    this.data.encodedEvent,
                    signatures.map(({ signature }) => signature),
                    0,
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
                    this.changeState('releaseState', {
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
                || !this.tonWallet.isConnected
                || this.evmWallet.web3 === undefined
                || this.contractAddress === undefined
            ) {
                return
            }

            const eventContract = rpc.createContract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
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

            if (status !== 'confirmed') {
                return
            }

            if (this.data.withdrawalId === undefined || this.data.encodedEvent === undefined) {
                this.changeState('releaseState', {
                    status: 'pending',
                })
            }

            const proxyAddress = eventDetails._initializer
            const proxyContract = rpc.createContract(TokenAbi.TokenTransferProxy, proxyAddress)

            const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

            const token = this.tokensCache.get(tokenAddress.toString())

            if (token === undefined) {
                return
            }

            const { chainId } = await eventContract.methods.getDecodedData({ answerId: 0 }).call()

            await this.tokensCache.syncEvmToken(token.root, chainId)

            const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

            const eventConfig = rpc.createContract(TokenAbi.TonEventConfig, proxyDetails.value0.tonConfiguration)
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
                configurationWid: proxyDetails.value0.tonConfiguration.toString().split(':')[0],
                configurationAddress: `0x${proxyDetails.value0.tonConfiguration.toString().split(':')[1]}`,
                eventContractWid: this.contractAddress.toString().split(':')[0],
                eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                round: (await eventContract.methods.round_number({}).call()).round_number,
            }])
            const withdrawalId = this.evmWallet.web3.utils.keccak256(encodedEvent)

            this.changeData('encodedEvent', encodedEvent)
            this.changeData('withdrawalId', withdrawalId)

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
                const vaultContract = this.tokensCache.getEthTokenVaultContract(
                    this.token.root,
                    this.rightNetwork.chainId,
                )
                const isReleased = await vaultContract?.methods.withdrawalIds(this.data.withdrawalId).call()

                if (this.releaseState?.status === 'pending' && this.releaseState?.isReleased === undefined) {
                    this.changeState('releaseState', {
                        isReleased,
                        status: isReleased ? 'confirmed' : 'disabled',
                    })
                }

                if (isReleased) {
                    this.changeState('releaseState', {
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

    public get amount(): TonTransferStoreData['amount'] {
        return this.data.amount
    }

    public get leftAddress(): TonTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): TonTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get eventState(): TonTransferStoreState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): TonTransferStoreState['prepareState'] {
        return this.state.prepareState
    }

    public get releaseState(): TonTransferStoreState['releaseState'] {
        return this.state.releaseState
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

    public get contractAddress(): Address | undefined {
        return this.params?.contractAddress !== undefined
            ? new Address(this.params.contractAddress)
            : undefined
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

    protected get tokenVault(): TokenAssetVault | undefined {
        if (this.token === undefined || this.rightNetwork?.chainId === undefined) {
            return undefined
        }
        return this.tokensCache.getTokenVault(this.token.root, this.rightNetwork.chainId)
    }

    #chainIdDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #contractDisposer: IReactionDisposer | undefined

}
