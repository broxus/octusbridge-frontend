import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'
import { Contract } from 'ton-inpage-provider'

import { RELAYER_BROADCAST_STORE_DATA, RELAYER_BROADCAST_STORE_STATE } from '@/modules/Relayers/constants'
import { ConfirmationStatus, RelayerBroadcastStoreData, RelayerBroadcastStoreState } from '@/modules/Relayers/types'
import { StakingDataStore } from '@/modules/Relayers/store/StakingData'
import { getStackingContract } from '@/modules/Staking/utils'
import { TonWalletService } from '@/stores/TonWalletService'
import { error, throwException } from '@/utils'
import { TokenAbi } from '@/misc'

export class RelayerBroadcastStore {

    protected state: RelayerBroadcastStoreState = RELAYER_BROADCAST_STORE_STATE

    protected data: RelayerBroadcastStoreData = RELAYER_BROADCAST_STORE_DATA

    protected stackingContract = getStackingContract()

    constructor(
        protected tonWallet: TonWalletService,
        protected stakingData: StakingDataStore,
    ) {
        makeAutoObservable(this, {
            broadcast: action.bound,
        })
    }

    public async broadcast(): Promise<void> {
        this.setIsLoading(true)

        try {
            if (!this.tonWallet.account?.address) {
                throwException('Wallet must be connected')
            }

            if (!this.stakingData.bridgeEventConfigEthTon) {
                throwException('bridgeEventConfigEthTon must be defined in staking data')
            }

            if (!this.stakingData.eventVoteData) {
                throwException('eventVoteData must be defined in staking data')
            }

            const eventConfigContract = new Contract(
                TokenAbi.EthEventConfig,
                this.stakingData.bridgeEventConfigEthTon,
            )

            const eventConfigDetails = await eventConfigContract.methods.getDetails({
                answerId: 0,
            }).call()

            await eventConfigContract.methods.deployEvent({
                eventVoteData: this.stakingData.eventVoteData,
            }).send({
                bounce: true,
                amount: new BigNumber(eventConfigDetails._basicConfiguration.eventInitialBalance)
                    .plus('500000000')
                    .toFixed(),
                from: this.tonWallet.account.address,
            })

            this.setIsSubmitted(true)
        }
        catch (e) {
            error(e)
            this.setIsLoading(false)
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
            return 'pending'
        }

        return 'disabled'
    }

    public get ethAddressStatus(): ConfirmationStatus {
        if (this.stakingData.eventVoteData || this.stakingData.ethAddressConfirmed) {
            return 'confirmed'
        }

        if (this.stakingData.relayEthAddress) {
            return 'pending'
        }

        return 'disabled'
    }

    public get broadcastStatus(): ConfirmationStatus {
        if (this.stakingData.ethAddressConfirmed && this.stakingData.tonPubkeyConfirmed) {
            return 'confirmed'
        }

        if (this.stakingData.eventStateIsDeployed) {
            return 'pending'
        }

        return 'disabled'
    }

}
