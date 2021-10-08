import BigNumber from 'bignumber.js'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
} from 'mobx'
import ton, { Address } from 'ton-inpage-provider'

import {
    DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA,
    DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    NetworkFields,
} from '@/modules/Bridge/types'
import { findNetwork, getTonMainNetwork } from '@/modules/Bridge/utils'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TokenCache, TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { debug, error, isGoodBignumber } from '@/utils'


export class CrosschainBridge {

    protected data: CrosschainBridgeStoreData = DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA

    protected state: CrosschainBridgeStoreState = DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly tonWallet: TonWalletService,
        protected readonly tokensCache: TokensCacheService,
    ) {
        makeAutoObservable<CrosschainBridge, 'handleChangeToken'>(this, {
            handleChangeToken: action.bound,
        })
    }

    public init(): void {
        this.#evmWalletDisposer = reaction(() => this.evmWallet.isConnected, connected => {
            if (connected) {
                if (this.isEvmToTon && !this.leftAddress) {
                    this.changeData('leftAddress', this.evmWallet.address || '')
                }
                else if (this.isTonToEvm && !this.rightAddress) {
                    this.changeData('rightAddress', this.evmWallet.address || '')
                }
            }
            else if (this.leftNetwork?.type === 'evm') {
                this.changeData('amount', '')
                this.changeData('leftAddress', '')
                this.changeData('leftNetwork', undefined)
                this.changeData('selectedToken', undefined)
                this.changeStep(CrosschainBridgeStep.SELECT_ROUTE)
            }
            else if (this.rightNetwork?.type === 'evm') {
                this.changeData('rightAddress', '')
                this.changeData('rightNetwork', undefined)
            }
        })

        this.#tonWalletDisposer = reaction(() => this.tonWallet.isConnected, connected => {
            if (connected) {
                if (this.isEvmToTon && !this.rightAddress) {
                    this.changeData('rightAddress', this.tonWallet.address || '')
                }
                else if (this.isTonToEvm && !this.leftAddress) {
                    this.changeData('leftAddress', this.tonWallet.address || '')
                }
            }
            else if (this.rightNetwork?.type === 'ton') {
                this.changeData('rightAddress', '')
                this.changeData('rightNetwork', undefined)
            }
            else if (this.leftNetwork?.type === 'ton') {
                this.changeData('amount', '')
                this.changeData('leftAddress', '')
                this.changeData('leftNetwork', undefined)
                this.changeData('selectedToken', undefined)
                this.changeStep(CrosschainBridgeStep.SELECT_ROUTE)
            }
        })

        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
    }

    public dispose(): void {
        this.#tonWalletDisposer?.()
        this.#evmWalletDisposer?.()
        this.#tokenDisposer?.()
        this.reset()
    }

    public changeData<K extends keyof CrosschainBridgeStoreData>(
        key: K,
        value: CrosschainBridgeStoreData[K],
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
                this.changeData('rightNetwork', getTonMainNetwork())
            }
        }

        if (key === 'rightNetwork') {
            if (value.chainId !== '1' && value.type !== 'ton') {
                this.changeData('leftAddress', this.tonWallet.address || '')
                this.changeData('leftNetwork', getTonMainNetwork())
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

    public changeStep(value: CrosschainBridgeStoreState['step']): void {
        this.changeState('step', value)
    }

    public changeState<K extends keyof CrosschainBridgeStoreState>(
        key: K,
        value: CrosschainBridgeStoreState[K],
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
            this.changeData('balance', vault?.balance)
        }
        else {
            await this.tokensCache.syncTonToken(selectedToken)
            this.changeData('balance', this.token?.balance)
            await this.tokensCache.syncEvmToken(selectedToken, this.rightNetwork!.chainId)
        }
    }

    public async approve(reject?: () => void): Promise<void> {
        if (this.token === undefined || this.leftNetwork === undefined) {
            return
        }

        const vault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (vault?.decimals === undefined) {
            return
        }

        const tokenContract = await this.tokensCache.getEthTokenContract(this.token.root, this.leftNetwork.chainId)

        if (tokenContract === undefined) {
            return
        }

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
                    this.amountNumber.shiftedBy(vault.decimals).toFixed(),
                ).send({
                    from: this.evmWallet.address,
                })
            }

            this.changeStep(CrosschainBridgeStep.TRANSFER)
        }
        catch (e) {
            error('Approve error', e)
            reject?.()
        }

        debug('Approve result', result)
    }

    public async checkAllowance(): Promise<void> {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return
        }

        const vault = this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)

        if (vault?.decimals === undefined) {
            return
        }

        const tokenContract = await this.tokensCache.getEthTokenContract(
            this.token.root,
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
            this.changeStep(CrosschainBridgeStep.SELECT_APPROVAL_STRATEGY)
        }
        else {
            this.changeStep(CrosschainBridgeStep.TRANSFER)
        }
    }

    public async transfer(reject?: () => void): Promise<void> {
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
                this.amountNumber.shiftedBy(vault.decimals).toFixed(),
            ).send({
                from: this.evmWallet.address,
            }).once('transactionHash', (transactionHash: string) => {
                this.changeData('txHash', transactionHash)
            })
        }
        catch (e) {
            reject?.()
            error('Transfer deposit error', e)
        }
    }

    public async prepareTonToEvm(reject?: () => void): Promise<void> {
        if (
            this.rightNetwork?.chainId === undefined
            || !this.rightAddress
            || this.token === undefined
        ) {
            return
        }

        const tonConfigurationContract = await this.tokensCache.getTonConfigurationContract(this.token.root)

        if (tonConfigurationContract === undefined) {
            return
        }

        const subscriber = ton.createSubscriber()

        try {
            const eventStream = subscriber.transactions(
                tonConfigurationContract.address,
            ).flatMap(item => item.transactions).filterMap(async tx => {
                const decodedTx = await tonConfigurationContract.decodeTransaction({
                    methods: ['deployEvent'],
                    transaction: tx,
                })

                if (decodedTx?.method === 'deployEvent' && decodedTx.input) {
                    const { eventData } = decodedTx.input.eventVoteData
                    const event = await ton.unpackFromCell({
                        allowPartial: true,
                        boc: eventData,
                        structure: [
                            { name: 'wid', type: 'int8' },
                            { name: 'addr', type: 'uint256' },
                            { name: 'tokens', type: 'uint128' },
                            { name: 'eth_addr', type: 'uint160' },
                            { name: 'chainId', type: 'uint32' },
                        ] as const,
                    })
                    const checkAddress = `${event.data.wid}:${new BigNumber(event.data.addr).toString(16).padStart(64, '0')}`
                    const checkEvmAddress = `0x${new BigNumber(event.data.eth_addr).toString(16).padStart(40, '0')}`

                    if (
                        checkAddress.toLowerCase() === this.leftAddress.toLowerCase()
                        && checkEvmAddress.toLowerCase() === this.rightAddress.toLowerCase()
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

            const walletContract = await this.tokensCache.getTonTokenWalletContract(this.token.root)

            if (walletContract === undefined) {
                (() => {
                    throw new Error('Cannot define token wallet contract.')
                })()

                return
            }

            const data = await ton.packIntoCell({
                structure: [
                    { name: 'addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ] as const,
                data: {
                    chainId: this.rightNetwork.chainId,
                    addr: this.rightAddress,
                },
            })

            await walletContract.methods.burnByOwner({
                callback_address: new Address(this.token.proxy),
                callback_payload: data.boc,
                grams: '0',
                send_gas_to: this.tonWallet.account!.address,
                tokens: this.amountNumber.shiftedBy(this.decimals!).toFixed(),
            }).send({
                amount: '6000000000',
                bounce: true,
                from: new Address(this.leftAddress),
            })

            const eventAddress = await eventStream.first()

            // for redirect
            this.changeData('txHash', eventAddress.toString())
        }
        catch (e) {
            reject?.()
            error('Prepare TON to EVM error', e)
            await subscriber.unsubscribe()
        }
    }

    public get amount(): CrosschainBridgeStoreData['amount'] {
        return this.data.amount
    }

    public get balance(): CrosschainBridgeStoreData['balance'] {
        return this.data.balance
    }

    public get leftAddress(): CrosschainBridgeStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get leftNetwork(): CrosschainBridgeStoreData['leftNetwork'] {
        return this.data.leftNetwork
    }

    public get rightAddress(): CrosschainBridgeStoreData['rightAddress'] {
        return this.data.rightAddress
    }

    public get rightNetwork(): CrosschainBridgeStoreData['rightNetwork'] {
        return this.data.rightNetwork
    }

    public get txHash(): CrosschainBridgeStoreData['txHash'] {
        return this.data.txHash
    }

    public get approvalStrategy(): CrosschainBridgeStoreState['approvalStrategy'] {
        return this.state.approvalStrategy
    }

    public get step(): CrosschainBridgeStoreState['step'] {
        return this.state.step
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get decimals(): number | undefined {
        if (this.token === undefined || this.leftNetwork?.chainId === undefined) {
            return undefined
        }

        if (this.isTonToEvm) {
            return this.token.decimals
        }

        return this.tokensCache.getTokenVault(this.token.root, this.leftNetwork.chainId)?.decimals
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

    public get isAssetValid(): boolean {
        return (
            this.evmWallet.isConnected
            && this.tonWallet.isConnected
            && this.data.selectedToken !== undefined
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

    public get isEvmToTon(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        const network = findNetwork(this.leftNetwork.chainId, this.leftNetwork.type)
        return network?.type === 'evm'
    }

    public get isTonToEvm(): boolean {
        if (this.leftNetwork === undefined) {
            return false
        }
        const network = findNetwork(this.leftNetwork.chainId, this.leftNetwork.type)
        return network?.type === 'ton'
    }

    #evmWalletDisposer: IReactionDisposer | undefined

    #tonWalletDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}


const CrosschainBridgeStore = new CrosschainBridge(
    useEvmWallet(),
    useTonWallet(),
    useTokensCache(),
)

export function useBridge(): CrosschainBridge {
    return CrosschainBridgeStore
}
