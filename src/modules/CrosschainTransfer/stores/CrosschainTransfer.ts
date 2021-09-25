import BigNumber from 'bignumber.js'
import {
    action,
    IReactionDisposer,
    makeAutoObservable,
    reaction,
    when,
} from 'mobx'
import { Contract } from 'web3-eth-contract'

import { EthAbi } from '@/misc'
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
import { CrystalWalletService, useCrystalWallet } from '@/stores/CrystalWalletService'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import {
    TokenCache as EvmTokenCache,
    EvmTokensCacheService,
    TokenAssetVault,
    useEvmTokensCache,
} from '@/stores/EvmTokensCacheService'
import {
    TokenCache as TonTokenCache,
    TonTokensCacheService,
    useTonTokensCache,
} from '@/stores/TonTokensCacheService'
import { debug, error, isGoodBignumber } from '@/utils'


export class CrosschainTransfer {

    protected data: CrosschainTransferStoreData = DEFAULT_CROSSCHAIN_TRANSFER_STORE_DATA

    protected state: CrosschainTransferStoreState = DEFAULT_CROSSCHAIN_TRANSFER_STORE_STATE

    constructor(
        protected readonly crystalWallet: CrystalWalletService,
        protected readonly toTokensCache: TonTokensCacheService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly evmTokensCache: EvmTokensCacheService,
    ) {
        makeAutoObservable<CrosschainTransfer, 'handleChangeToken'>(this, {
            handleChangeToken: action.bound,
        })
    }

    public init(): void {
        this.#crystalWalletDisposer = when(() => !this.crystalWallet.isConnected, () => {
            this.changeData('leftNetwork', undefined)
            this.changeData('leftAddress', '')
        })

        this.#evmWalletDisposer = when(() => !this.evmWallet.isConnected, () => {
            this.changeData('leftNetwork', undefined)
            this.changeData('leftAddress', '')
        })

        this.#tokenDisposer = reaction(() => this.data.selectedToken, this.handleChangeToken)
    }

    public dispose(): void {
        this.#crystalWalletDisposer?.()
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
                this.changeData('leftAddress', this.crystalWallet.address || '')
                this.changeData('rightAddress', this.evmWallet.address || '')
                this.changeData('rightNetwork', this.leftNetwork)
            }
            else {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('rightAddress', this.crystalWallet.address || '')
                this.changeData('rightNetwork', getFreeTonNetwork())
            }
        }

        if (key === 'rightNetwork') {
            if (value.chainId !== '1' && value.type !== 'ton') {
                this.changeData('leftAddress', this.crystalWallet.address || '')
                this.changeData('leftNetwork', getFreeTonNetwork())
                this.changeData('rightAddress', this.evmWallet.address || '')
            }
            else {
                this.changeData('leftAddress', this.evmWallet.address || '')
                this.changeData('leftNetwork', this.rightNetwork)
                this.changeData('rightAddress', this.crystalWallet.address || '')
            }
        }

        this.changeData(key, value)
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

    protected async handleChangeToken(root?: string): Promise<void> {
        if (root === undefined) {
            return
        }

        if (this.isEvmToTon) {
            if (
                this.evmWallet.web3 === undefined
                || this.evmTokenContract === undefined
                || this.evmTokenVault?.vault === undefined
                || this.evmTokenVaultContract === undefined
            ) {
                return
            }

            let address: string

            try {
                address = await this.evmTokenVaultContract.methods.token().call()
                this.evmTokensCache.update(root, 'evm', {
                    address,
                    decimals: (this.token as EvmTokenCache).evm.decimals,
                })

            }
            catch (e) {
                error(e)
                return
            }

            try {
                const balance = await this.evmTokenContract.methods.balanceOf(this.evmWallet.address).call()
                const decimals = await this.evmTokenContract.methods.decimals().call()

                this.evmTokensCache.update(root, 'evm', {
                    address,
                    decimals: parseInt(decimals, 10),
                })

                this.evmTokensCache.update(root, 'balance', balance)
            }
            catch (e) {
                error(e)
            }
        }
    }

    public async approve(): Promise<void> {
        if (this.evmTokenContract === undefined) {
            return
        }

        this.changeState('isAwaitConfirmation', true)

        let result: any // todo add type

        try {
            if (this.approvalStrategy === 'infinity') {
                result = await this.evmTokenContract.methods.approve(
                    this.evmTokenVault!.vault,
                    '340282366920938463426481119284349108225',
                ).send({
                    from: this.evmWallet.address,
                })

            }
            else {
                result = await this.evmTokenContract.methods.approve(
                    this.evmTokenVault!.vault,
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

        debug(result)
    }

    public async checkAllowance(): Promise<void> {
        if (
            !this.isEvmToTon
            || this.evmTokenContract === undefined
            || this.evmTokenVault === undefined
            || this.token === undefined
        ) {
            return
        }

        const allowance = await this.evmTokenContract.methods.allowance(
            this.evmWallet.address,
            this.evmTokenVault.vault,
        ).call()

        const delta = new BigNumber(allowance).minus(
            this.amountNumber.shiftedBy((this.token as EvmTokenCache).evm.decimals),
        )

        debug('ALLOWANCE', allowance, delta.toFixed())

        if (delta.lt(0)) {
            this.changeData('approvalDelta', delta.abs())
            this.changeStep(CrosschainTransferStep.SELECT_APPROVAL_STRATEGY)
        }
        else {
            this.changeStep(CrosschainTransferStep.TRANSFER)
        }
    }

    public async transfer(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.evmTokenVaultContract === undefined
            || this.leftNetwork === undefined
            || this.rightNetwork === undefined
        ) {
            return
        }

        const wrapperAddress = await this.evmTokenVaultContract.methods.wrapper().call()

        debug(wrapperAddress)

        const wrapper = new this.evmWallet.web3.eth.Contract(
            EthAbi.VaultWrapper,
            wrapperAddress,
        )

        const target = this.rightAddress.split(':')

        try {
            await wrapper.methods.deposit(
                [target[0], `0x${target[1]}`],
                this.amountNumber.shiftedBy((this.token as EvmTokenCache).evm.decimals),
            ).send({
                from: this.evmWallet.address,
            }).once('transactionHash', (transactionHash: string) => {
                this.changeData('txHash', transactionHash)
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get amount(): CrosschainTransferStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.data.amount)
    }

    public get approvalDelta(): CrosschainTransferStoreData['approvalDelta'] {
        return this.data.approvalDelta
    }

    public get formattedApprovalDelta(): string {
        const token = this.token as EvmTokenCache
        return this.approvalDelta.shiftedBy(-token.evm.decimals).toFixed()
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

    public get token(): TonTokenCache | EvmTokenCache | undefined {
        if (this.data.selectedToken === undefined) {
            return undefined
        }

        if (this.isEvmToTon && this.leftNetwork !== undefined) {
            return this.evmTokensCache.filterTokens(this.leftNetwork.chainId).find(
                ({ root }) => root === this.data.selectedToken,
            )
        }

        if (this.isTonToEvm) {
            return this.toTokensCache.get(this.data.selectedToken)
        }

        return undefined
    }

    public get evmTokenContract(): Contract | undefined {
        if (this.evmWallet.web3 === undefined || this.token === undefined) {
            return undefined
        }
        return new this.evmWallet.web3.eth.Contract(
            EthAbi.ERC20,
            (this.token as EvmTokenCache).evm.address,
        )
    }

    public get evmTokenVault(): TokenAssetVault | undefined {
        if (this.token === undefined) {
            return undefined
        }
        const asset = this.evmTokensCache.assets[(this.token as EvmTokenCache).root]
        return asset?.vaults.find(
            ({ chainId }) => chainId === this.leftNetwork?.chainId,
        )
    }

    public get evmTokenVaultContract(): Contract | undefined {
        if (this.evmWallet.web3 === undefined || this.evmTokenVault === undefined) {
            return undefined
        }
        return new this.evmWallet.web3.eth.Contract(
            EthAbi.Vault,
            this.evmTokenVault.vault,
        )
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
            this.crystalWallet.isConnected
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

    #crystalWalletDisposer: IReactionDisposer | undefined

    #evmWalletDisposer: IReactionDisposer | undefined

    #tokenDisposer: IReactionDisposer | undefined

}

const CrosschainTransferStore = new CrosschainTransfer(
    useCrystalWallet(),
    useTonTokensCache(),
    useEvmWallet(),
    useEvmTokensCache(),
)

export function useCrosschainTransfer(): CrosschainTransfer {
    return CrosschainTransferStore
}
