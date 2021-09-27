import BigNumber from 'bignumber.js'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
    runInAction,
    when,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'

import { TokenAbi } from '@/misc'
import {
    DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA,
    DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE,
} from '@/modules/CrosschainTransfer/constants'
import {
    CrosschainTransferStep,
    CrosschainTransferStoreData,
    CrosschainTransferStoreState,
    NetworkFields,
} from '@/modules/CrosschainTransfer/types'
import { findNetwork, getFreeTonNetwork } from '@/modules/CrosschainTransfer/utils'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import {
    TokenCache,
    TokensCacheService,
    useTokensCache,
} from '@/stores/TokensCacheService'
import { debug, error, isGoodBignumber } from '@/utils'


export class CrosschainTransfer {

    /**
     *
     * @protected
     */
    protected data: CrosschainTransferStoreData = DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA

    /**
     *
     * @protected
     */
    protected state: CrosschainTransferStoreState = DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE

    constructor(
        protected readonly tonWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
    ) {
        makeAutoObservable<CrosschainTransfer, 'handleChangeToken'>(this, {
            handleChangeToken: action.bound,
        })
    }

    /**
     *
     */
    public init(): void {
        this.#tonWalletDisposer = when(() => !this.tonWallet.isConnected, () => {
            this.changeData('leftNetwork', undefined)
            this.changeData('leftAddress', '')
        })

        this.#evmWalletDisposer = when(() => !this.evmWallet.isConnected, () => {
            this.changeData('leftNetwork', undefined)
            this.changeData('leftAddress', '')
        })

        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
    }

    /**
     *
     */
    public dispose(): void {
        this.#tonWalletDisposer?.()
        this.#evmWalletDisposer?.()
        this.#tokenDisposer?.()
        this.reset()
    }

    public changeData<K extends keyof CrosschainTransferStoreData>(
        key: K,
        value: CrosschainTransferStoreData[K],
    ): void {
        this.data[key] = value
    }

    public changeNetwork<K extends keyof NetworkFields>(key: K, value: NetworkFields[K]): void {
        if (value === undefined) {
            return
        }

        if (key === 'leftNetwork') {
            if (value.chainId === '1' && value.type === 'ton') {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('rightAddress', this.evmWallet.address || '')
                this.changeData('rightNetwork', this.leftNetwork)
            }
            else {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('rightAddress', this.tonWallet.address || '')
                this.changeData('rightNetwork', getFreeTonNetwork())
            }
        }

        if (key === 'rightNetwork') {
            if (value.chainId !== '1' && value.type !== 'ton') {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('leftNetwork', getFreeTonNetwork())
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
            else {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('leftNetwork', this.rightNetwork)
                this.changeData('rightAddress', this.tonWallet.address || '')
            }
        }

        this.changeData(key, value)
        this.changeData('amount', '')
        this.changeData('selectedToken', undefined)
    }

    public changeStep(value: CrosschainTransferStoreState['step']): void {
        this.changeState('step', value)
    }

    protected changeState<K extends keyof CrosschainTransferStoreState>(
        key: K,
        value: CrosschainTransferStoreState[K],
    ): void {
        this.state[key] = value
    }

    protected reset(): void {
        this.data = DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA
        this.state = DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE
    }

    protected async handleChangeToken(selectedToken?: string): Promise<void> {
        if (selectedToken === undefined) {
            return
        }

        if (this.isEvmToTon) {
            await this.tokensCache.syncEvmToken(selectedToken, this.leftNetwork!.chainId)
            const vault = this.tokensCache.getTokenVault(selectedToken, this.leftNetwork!.chainId)
            runInAction(() => {
                this.data.balance = vault?.balance
            })
        }
        else {
            await this.tokensCache.syncTonToken(selectedToken)
            runInAction(() => {
                this.data.balance = this.token?.balance
            })
        }
    }

    public async approve(): Promise<void> {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return
        }

        const vault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (vault === undefined) {
            return
        }

        const tokenContract = this.tokensCache.getEthTokenContract(this.token.root, this.leftNetwork.chainId)

        if (tokenContract === undefined) {
            return
        }

        this.changeState('isAwaitConfirmation', true)

        let result: unknown

        try {
            if (this.approvalStrategy === 'infinity') {
                result = await tokenContract.methods.approve(
                    vault.vault,
                    '340282366920938463426481119284349108225',
                ).send({
                    from: this.evmWallet.address,
                })
            }
            else {
                result = await tokenContract.methods.approve(
                    vault.vault,
                    this.amountNumber.toFixed(),
                ).send({
                    from: this.evmWallet.address,
                })
            }
        }
        catch (e) {
            this.changeState('isAwaitConfirmation', false)
            error('Approve error', e)
        }

        debug('Approve result', result)
    }

    public async checkAllowance(): Promise<void> {
        if (
            this.token === undefined
            || this.data.selectedToken === undefined
            || this.leftNetwork?.chainId === undefined
        ) {
            return
        }

        const vault = this.tokensCache.getTokenVault(
            this.data.selectedToken,
            this.leftNetwork.chainId,
        )

        if (vault?.decimals === undefined) {
            return
        }

        const tokenContract = this.tokensCache.getEthTokenContract(
            this.data.selectedToken,
            this.leftNetwork.chainId,
        )

        if (tokenContract === undefined) {
            return
        }

        const allowance = await tokenContract.methods.allowance(
            this.evmWallet.address,
            vault.vault,
        ).call()

        const delta = new BigNumber(allowance).minus(
            this.amountNumber.shiftedBy(vault.decimals),
        )

        if (delta.lt(0)) {
            this.changeData('approvalDelta', delta.abs())
            this.changeStep(CrosschainTransferStep.SELECT_APPROVAL_STRATEGY)
        }
        else {
            this.changeStep(CrosschainTransferStep.TRANSFER)
        }
    }

    public async transfer(rejected?: () => void): Promise<void> {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return
        }

        const vault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (vault?.decimals === undefined) {
            return
        }

        const wrapperContract = this.tokensCache.getEthTokenVaultWrapperContract(
            this.token.root,
            this.leftNetwork.chainId,
        )

        if (wrapperContract === undefined) {
            return
        }

        const target = this.rightAddress.split(':')

        try {
            await wrapperContract.methods.deposit(
                [target[0], `0x${target[1]}`],
                this.amountNumber.shiftedBy(vault.decimals),
            ).send({
                from: this.evmWallet.address,
            }).once('transactionHash', (transactionHash: string) => {
                this.changeData('txHash', transactionHash)
            })
        }
        catch (e) {
            error('Transfer deposit error', e)
            rejected?.()
        }
    }

    public async prepareTonToEvm(reject?: () => void): Promise<void> {
        if (this.rightNetwork?.chainId === undefined) {
            return
        }

        const chainId = this.rightNetwork?.chainId
        const evmAddress = this.rightAddress
        const { proxy } = this.tokensCache.assets[this.token!.root]

        const r = [{ name: 'addr', type: 'uint160' }, { name: 'chainId', type: 'uint32' }] as const

        const data = await ton.packIntoCell({
            structure: r,
            data: {
                chainId,
                addr: evmAddress,
            },
        })

        const proxyContract = new Contract(TokenAbi.TokenTransferProxy, new Address(proxy))
        const proxyDetails = await proxyContract.methods.getDetails({
            answerId: 0,
        }).call()
        const tonConfigurationAddress = proxyDetails.value0.tonConfiguration
        const tonConfigurationContract = new Contract(TokenAbi.TonEventConfig, tonConfigurationAddress)

        const subscriber = ton.createSubscriber()

        try {
            const eventStream = subscriber.transactions(
                tonConfigurationAddress,
            ).flatMap(a => a.transactions).filterMap(async tx => {
                const decodedTx = await tonConfigurationContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                    const { eventData } = decodedTx.input.eventVoteData
                    const r2 = [
                        { name: 'wid', type: 'int8' },
                        { name: 'addr', type: 'uint256' },
                        { name: 'tokens', type: 'uint128' },
                        { name: 'eth_addr', type: 'uint160' },
                        { name: 'chainId', type: 'uint32' },
                    ] as const
                    const event = await ton.unpackFromCell({
                        structure: r2,
                        boc: eventData,
                        allowPartial: true,
                    })

                    const checkAddress = `${event.data.wid}:${new BigNumber(event.data.addr).toString(16).padStart(64, '0')}`
                    const checkEvmAddress = `0x${new BigNumber(event.data.eth_addr).toString(16).padStart(40, '0')}`

                    if (
                        checkAddress.toLowerCase() === this.leftAddress.toLowerCase()
                        && checkEvmAddress.toLowerCase() === evmAddress.toLowerCase()
                    ) {
                        const eventAddress = await tonConfigurationContract.methods.deriveEventAddress({
                            answerId: 0,
                            eventVoteData: decodedTx.input.eventVoteData,
                        }).call()
                        return eventAddress.eventContract
                    }
                    return undefined
                }
                return undefined
            })

            const walletContract = new Contract(TokenAbi.Wallet, new Address(this.token!.wallet!))
            await walletContract.methods.burnByOwner({
                tokens: this.amountNumber.shiftedBy(this.token!.decimals!).toFixed(),
                grams: '0',
                send_gas_to: this.tonWallet.account!.address,
                callback_address: new Address(proxy),
                callback_payload: data.boc,
            }).send({
                from: new Address(this.leftAddress),
                amount: '6000000000',
                bounce: true,
            })

            const eventAddress = await eventStream.first()
            console.log(eventAddress)

            runInAction(() => {
                // for redirect
                this.data.txHash = eventAddress.toString()
            })
        }
        catch (e) {
            await subscriber.unsubscribe()
            reject?.()
            console.log(e)
        }
    }

    public get amount(): CrosschainTransferStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.data.amount)
    }

    public get balance(): CrosschainTransferStoreData['balance'] {
        return this.data.balance
    }

    public get decimals(): number | undefined {
        if (this.token?.root === undefined || this.leftNetwork?.chainId === undefined) {
            return undefined
        }

        if (this.isTonToEvm) {
            return this.token?.decimals
        }

        return this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)?.decimals
    }

    public get leftNetwork(): CrosschainTransferStoreData['leftNetwork'] {
        return this.data.leftNetwork
    }

    public get rightNetwork(): CrosschainTransferStoreData['rightNetwork'] {
        return this.data.rightNetwork
    }

    public get leftAddress(): CrosschainTransferStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): CrosschainTransferStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get txHash(): CrosschainTransferStoreData['txHash'] {
        return this.data.txHash
    }

    public get step(): CrosschainTransferStoreState['step'] {
        return this.state.step
    }

    public get approvalStrategy(): CrosschainTransferStoreData['approvalStrategy'] {
        return this.data.approvalStrategy
    }

    public get token(): TokenCache | undefined {
        if (this.data.selectedToken === undefined) {
            return undefined
        }

        if (this.isEvmToTon && this.leftNetwork !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.leftNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        if (this.isTonToEvm && this.rightNetwork !== undefined) {
            return this.tokensCache.filterTokensByChainId(this.rightNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        return undefined
    }

    public get isAwaitConfirmation(): boolean {
        return this.state.isAwaitConfirmation
    }

    public get isAssetValid(): boolean {
        return (
            this.data.selectedToken !== undefined
            && isGoodBignumber(this.amountNumber)
        )
    }

    public get isRouteValid(): boolean {
        return (
            this.tonWallet.isConnected
            && this.evmWallet.isConnected
            && this.leftNetwork !== undefined
            && !!this.leftAddress
            && this.rightNetwork !== undefined
            && !!this.rightAddress
        )
    }

    public get isTonToEvm(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        const network = findNetwork(this.leftNetwork.chainId, this.leftNetwork.type)
        return network?.type === 'ton'
    }

    public get isEvmToTon(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        const network = findNetwork(this.leftNetwork.chainId, this.leftNetwork.type)
        return network?.type === 'evm'
    }

    #tonWalletDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}

const CrosschainTransferStore = new CrosschainTransfer(
    useTonWallet(),
    useEvmWallet(),
    useTokensCache(),
)

export function useCrosschainTransfer(): CrosschainTransfer {
    return CrosschainTransferStore
}
