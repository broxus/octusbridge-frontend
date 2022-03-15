import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import {
    ETH_ADDRESS_REGEXP, RELAYER_LINK_STORE_DATA, RELAYER_LINK_STORE_STATE,
    TON_PUBLIC_KEY_REGEXP,
} from '@/modules/Relayers/constants'
import { RelayerLinkStoreData, RelayerLinkStoreState } from '@/modules/Relayers/types'
import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { normalizeEthAddress, normalizeTonPubKey } from '@/modules/Relayers/utils'
import { getStakingContract } from '@/modules/Staking/utils'
import { error, throwException } from '@/utils'
import { EverWalletService } from '@/stores/EverWalletService'

export class RelayerLinkStore {

    protected state: RelayerLinkStoreState = RELAYER_LINK_STORE_STATE

    protected data: RelayerLinkStoreData = RELAYER_LINK_STORE_DATA

    protected stackingContract = getStakingContract()

    constructor(
        protected tonWallet: EverWalletService,
        protected stakingData: StakingDataStore,
    ) {
        makeAutoObservable(this, {
            linkAccounts: action.bound,
            confirming: action.bound,
            cancel: action.bound,
            setTonPublicKey: action.bound,
            setEthAddress: action.bound,
        })
    }

    public async linkAccounts(): Promise<void> {
        this.setIsLoading(true)

        try {
            await this.stakingData.forceUpdate()

            if (!this.isValid) {
                throwException('Create relayer form is invalid')
            }

            if (!this.tonWallet.address) {
                throwException('Ton wallet must be connected')
            }

            if (!this.stakingData.relayInitialTonDeposit) {
                throwException('relayInitialTonDeposit must be defined in staking data')
            }

            const tonPubKey = normalizeTonPubKey(this.tonPublicKey)
            const ethAddress = normalizeEthAddress(this.ethAddress)

            await this.stackingContract.methods.linkRelayAccounts({
                ton_pubkey: tonPubKey,
                eth_address: ethAddress,
            })
                .send({
                    amount: this.stakingData.relayInitialTonDeposit,
                    from: new Address(this.tonWallet.address),
                    bounce: true,
                })

            this.setIsSubmitted(true)

            await new Promise<void>(resolve => {
                const intervalId = window.setInterval(() => {
                    if (
                        tonPubKey === this.stakingData.relayTonPubkey
                        && ethAddress === this.stakingData.relayEthAddress
                    ) {
                        clearInterval(intervalId)
                        resolve()
                    }
                }, 1000)
            })

            this.setLinked(true)
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setIsLoading(false)
        }
    }

    public confirming(): void {
        this.state.isConfirming = true
    }

    public cancel(): void {
        this.state.isConfirming = false
    }

    protected setIsSubmitted(value: boolean): void {
        this.state.isSubmitted = value
    }

    protected setIsLoading(value: boolean): void {
        this.state.isLoading = value
    }

    protected setLinked(value: boolean): void {
        this.state.isLinked = value
    }

    public setTonPublicKey(value: string): void {
        this.data.tonPublicKey = value
    }

    public setEthAddress(value: string): void {
        this.data.ethAddress = value
    }

    public get isLoading(): boolean {
        return this.state.isLoading
    }

    public get isConfirming(): boolean {
        return this.state.isConfirming
    }

    public get isLinked(): boolean {
        return this.state.isLinked
    }

    public get isSubmitted(): boolean {
        return this.state.isSubmitted
    }

    public get tonPublicKey(): string {
        return this.data.tonPublicKey
    }

    public get ethAddress(): string {
        return this.data.ethAddress
    }

    public get isValid(): boolean {
        return this.isTonPublicKeyValid
            && this.isEthAddressValid
            && this.stakingBalanceIsValid
            && this.tonWalletBalanceIsValid
    }

    public get isTonPublicKeyValid(): boolean {
        return TON_PUBLIC_KEY_REGEXP.test(this.tonPublicKey)
    }

    public get isEthAddressValid(): boolean {
        return ETH_ADDRESS_REGEXP.test(this.ethAddress)
    }

    public get tonWalletBalanceIsValid(): boolean {
        if (
            !this.stakingData.tonWalletBalance
            || !this.stakingData.relayInitialTonDeposit
        ) {
            return false
        }

        return new BigNumber(this.stakingData.tonWalletBalance)
            .gte(this.stakingData.relayInitialTonDeposit)
    }

    public get stakingBalanceIsValid(): boolean {
        if (
            !this.stakingData.stakingBalance
            || !this.stakingData.minRelayDeposit
        ) {
            return false
        }

        return new BigNumber(this.stakingData.stakingBalance)
            .gte(this.stakingData.minRelayDeposit)
    }

}
