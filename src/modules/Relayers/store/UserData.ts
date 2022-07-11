import BigNumber from 'bignumber.js'
import { makeAutoObservable, runInAction } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import { StakingAccountAddress } from '@/config'
import { StackingAbi, UserDataAbi } from '@/misc'
import { normalizeEthAddress, normalizeTonPubKey } from '@/modules/Relayers/utils'
import { UserDataStoreData } from '@/modules/Relayers/types'
import { useEverWallet } from '@/stores/EverWalletService'
import { RelayersDataStore } from '@/modules/Relayers/store/RelayersData'
import rpc from '@/hooks/useRpcClient'
import { error } from '@/utils'

export class UserDataStore {

    protected data: UserDataStoreData = {}

    protected stakingContract = rpc.createContract(
        StackingAbi.Root,
        StakingAccountAddress,
    )

    protected relayersData = new RelayersDataStore()

    protected everWallet = useEverWallet()

    constructor() {
        makeAutoObservable(this)
    }

    public dispose(): void {
        this.data = {}
    }

    public async fetch(): Promise<void> {
        try {
            const { address } = this.everWallet

            if (!address) {
                throw new Error('Ton wallet must be connected')
            }

            const { value0: userDataAddress } = await this.stakingContract.methods.getUserDataAddress({
                answerId: 0,
                user: new Address(address),
            }).call()

            const userDataContract = rpc.createContract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            runInAction(() => {
                this.data.userDetails = userDetails
            })

            this.relayersData.fetchRelayConfig()
        }
        catch (e) {
            error(e)
        }
    }

    public get relayTonPubkey(): string | undefined {
        const tonPubkeyNum = this.data.userDetails?.relay_ton_pubkey

        if (!tonPubkeyNum || tonPubkeyNum === '0') {
            return undefined
        }

        const tonPubkey = new BigNumber(tonPubkeyNum).toString(16).padStart(64, '0')

        return normalizeTonPubKey(tonPubkey)
    }

    public get relayEthAddress(): string | undefined {
        const ethAddressNum = this.data.userDetails?.relay_eth_address

        if (!ethAddressNum || ethAddressNum === '0') {
            return undefined
        }

        const ethAddress = new BigNumber(ethAddressNum).toString(16).padStart(40, '0')

        return normalizeEthAddress(ethAddress)
    }

    public get address(): string | undefined {
        return this.everWallet.address
    }

    public get isRelay(): boolean {
        return !!this.relayEthAddress && !!this.relayTonPubkey
    }

    public get isConnected(): boolean {
        return this.everWallet.isConnected
    }

    public get relayIsLowBalance(): boolean | undefined {
        if (!this.relayersData.relayConfig?.minRelayDeposit) {
            return undefined
        }

        if (!this.data.userDetails?.token_balance) {
            return undefined
        }

        return new BigNumber(this.data.userDetails.token_balance)
            .lt(this.relayersData.relayConfig.minRelayDeposit)
    }

}
