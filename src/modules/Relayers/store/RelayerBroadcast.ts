import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'

import { RELAYER_BROADCAST_STORE_DATA, RELAYER_BROADCAST_STORE_STATE } from '@/modules/Relayers/constants'
import { ConfirmationStatus, RelayerBroadcastStoreData, RelayerBroadcastStoreState } from '@/modules/Relayers/types'
import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { getStakingContract } from '@/modules/Staking/utils'
import { error, throwException } from '@/utils'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'
import { BridgeAbi } from '@/misc'

export class RelayerBroadcastStore {

    protected state: RelayerBroadcastStoreState = RELAYER_BROADCAST_STORE_STATE

    protected data: RelayerBroadcastStoreData = RELAYER_BROADCAST_STORE_DATA

    protected stackingContract = getStakingContract()

    constructor(
        protected tonWallet: EverWalletService,
        protected stakingData: StakingDataStore,
    ) {
        makeAutoObservable(this, {
            broadcast: action.bound,
        })
    }

    public async broadcast(): Promise<void> {
        this.setIsLoading(true)

        try {
            await this.stakingData.forceUpdate()

            if (!this.tonWalletBalanceIsValid) {
                throwException('Ton wallet balance is invalid')
            }

            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.stakingData.bridgeEventConfigEthTon) {
                throwException('bridgeEventConfigEthTon must be defined in staking data')
            }

            if (!this.stakingData.eventVoteData) {
                throwException('eventVoteData must be defined in staking data')
            }

            if (!this.stakingData.eventInitialBalance) {
                throwException('eventInitialBalance must be defined in staking data')
            }

            const eventConfigContract = rpc.createContract(
                BridgeAbi.EthereumEventConfiguration,
                this.stakingData.bridgeEventConfigEthTon,
            )

            await eventConfigContract.methods.deployEvent({
                eventVoteData: this.stakingData.eventVoteData,
            }).send({
                bounce: true,
                amount: this.stakingData.eventInitialBalance,
                from: this.tonWallet.account.address,
            })

            this.setIsSubmitted(true)
        }
        catch (e) {
            error(e)
        }
    }

    protected setIsLoading(value: boolean): void {
        this.state.isLoading = value
    }

    protected setIsSubmitted(value: boolean): void {
        this.state.isSubmitted = value
    }

    public get isLoading(): boolean {
        return this.state.isLoading
    }

    public get isSubmitted(): boolean {
        return this.state.isSubmitted
    }

    public get tonPubkeyStatus(): ConfirmationStatus {
        if (this.stakingData.tonPubkeyConfirmed) {
            return 'confirmed'
        }

        if (this.stakingData.relayTonPubkey) {
            return 'checking'
        }

        return 'disabled'
    }

    public get ethAddressStatus(): ConfirmationStatus {
        if (this.stakingData.eventVoteData || this.stakingData.ethAddressConfirmed) {
            return 'confirmed'
        }

        if (this.stakingData.relayEthAddress) {
            return 'checking'
        }

        return 'disabled'
    }

    public get broadcastStatus(): ConfirmationStatus {
        if (this.stakingData.ethAddressConfirmed && this.stakingData.tonPubkeyConfirmed) {
            return 'confirmed'
        }

        if (this.stakingData.eventStateIsDeployed) {
            return 'checking'
        }

        if (this.isLoading) {
            return 'pending'
        }

        return 'disabled'
    }

    public get tonWalletBalanceIsValid(): boolean {
        if (
            !this.stakingData.tonWalletBalance
            || !this.stakingData.eventInitialBalance
        ) {
            return false
        }

        return new BigNumber(this.stakingData.tonWalletBalance)
            .gte(this.stakingData.eventInitialBalance)
    }

}
