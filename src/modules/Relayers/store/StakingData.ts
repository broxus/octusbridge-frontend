import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { action, makeAutoObservable } from 'mobx'
import { Address, FullContractState } from 'everscale-inpage-provider'
import { addABI, decodeLogs, keepNonDecodedLogs } from 'abi-decoder'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'

import { TokensCacheService } from '@/stores/TokensCacheService'
import { StakingDataStoreData, StakingDataStoreState } from '@/modules/Relayers/types'
import { STAKING_DATA_STORE_DEFAULT_DATA, STAKING_DATA_STORE_DEFAULT_STATE } from '@/modules/Relayers/constants'
import { normalizeEthAddress, normalizeTonPubKey } from '@/modules/Relayers/utils'
import { getStakingContract } from '@/modules/Staking/utils'
import { error, throwException } from '@/utils'
import {
    EventVoteData, RelayConfig, StackingDetails, UserDetails,
} from '@/misc/types'
import {
    BridgeAbi,
    EthAbi, EventConfigDetails, UserDataAbi,
} from '@/misc'
import { Web3Url } from '@/config'
import rpc from '@/hooks/useRpcClient'
import { EverWalletService } from '@/stores/EverWalletService'
import { TokenCache } from '@/types'

export class StakingDataStore {

    protected state: StakingDataStoreState = STAKING_DATA_STORE_DEFAULT_STATE

    protected data: StakingDataStoreData = STAKING_DATA_STORE_DEFAULT_DATA

    protected stackingContract = getStakingContract()

    protected syncTimeoutId?: number

    protected web3 = new Web3(Web3Url)

    constructor(
        public readonly tokensCache: TokensCacheService,
        public readonly tonWallet: EverWalletService,
    ) {
        makeAutoObservable(this, {
            connectTonWallet: action.bound,
        })
    }

    protected async getRelayConfig(): Promise<RelayConfig | undefined> {
        try {
            const { value0: relayConfig } = await this.stackingContract.methods.getRelayConfig({
                answerId: 0,
            }).call()

            return relayConfig
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    protected async getStackingDetails(): Promise<StackingDetails | undefined> {
        try {
            const { value0: stackingDetails } = await this.stackingContract.methods.getDetails({
                answerId: 0,
            }).call()

            return stackingDetails
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    protected async getUserDetails(): Promise<UserDetails | undefined> {
        try {
            const ownerAddress = this.tonWallet.account?.address

            if (!ownerAddress) {
                throwException('Ton wallet must be connected')
            }

            const { value0: userDataAddress } = await this.stackingContract.methods.getUserDataAddress({
                answerId: 0,
                user: ownerAddress,
            }).call()

            const userDataContract = rpc.createContract(UserDataAbi.Root, userDataAddress)

            const { value0: userDetails } = await userDataContract.methods.getDetails({
                answerId: 0,
            }).call()

            return userDetails
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    static async getEventConfigDetails(
        stackingDetails: StackingDetails,
    ): Promise<EventConfigDetails | undefined> {
        try {
            const eventConfigContract = rpc.createContract(
                BridgeAbi.EthereumEventConfiguration,
                stackingDetails.bridge_event_config_eth_ton,
            )
            const eventConfigDetails = await eventConfigContract.methods.getDetails({
                answerId: 0,
            }).call()

            return eventConfigDetails
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    protected async getEventVoteData(
        userDetails: UserDetails,
        eventConfigDetails: EventConfigDetails,
    ): Promise<EventVoteData | undefined> {
        try {
            const eventEmitterBN = new BigNumber(eventConfigDetails._networkConfiguration.eventEmitter)
            const eventEmitterAddress = `0x${eventEmitterBN.toString(16).padStart(40, '0')}`
            const topic = this.web3.utils.keccak256('RelayAddressVerified(uint160,int8,uint256)')
            const logs = await this.web3.eth.getPastLogs({
                address: eventEmitterAddress,
                topics: [topic],
                fromBlock: 0,
            })

            keepNonDecodedLogs()
            addABI(EthAbi.StakingRelayVerifier)

            const decodedLogs = decodeLogs(logs)
            const eventIndex = decodedLogs.findIndex(log => (
                log.name === 'RelayAddressVerified'
                && (log.events[0] as any).value === userDetails.relay_eth_address
            ))

            if (eventIndex > -1) {
                const event = logs[eventIndex]
                const networkBlockNumber = await this.web3.eth.getBlockNumber()
                const eventBlocksToConfirm = parseInt(
                    eventConfigDetails._networkConfiguration.eventBlocksToConfirm,
                    10,
                )

                if (networkBlockNumber - event.blockNumber >= eventBlocksToConfirm) {
                    const eventData = mapEthBytesIntoTonCell(
                        atob(eventConfigDetails._basicConfiguration.eventABI),
                        event.data,
                    )

                    return {
                        eventData,
                        eventBlock: event.blockHash,
                        eventBlockNumber: event.blockNumber!.toString(),
                        eventIndex: event.logIndex!.toString(),
                        eventTransaction: event.transactionHash,
                    }
                }

                return undefined
            }

            return undefined
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    static async getEventState(
        stackingDetails: StackingDetails,
        eventVoteData: EventVoteData,
    ): Promise<FullContractState | undefined> {
        try {
            const eventConfigContract = rpc.createContract(
                BridgeAbi.EthereumEventConfiguration,
                stackingDetails.bridge_event_config_eth_ton,
            )
            const eventAddress = await eventConfigContract.methods.deriveEventAddress({
                eventVoteData,
                answerId: 0,
            }).call()
            const { state: eventState } = await rpc.getFullContractState({
                address: eventAddress.eventContract,
            })

            return eventState
        }
        catch (e) {
            error(e)

            return undefined
        }
    }

    protected async syncData(): Promise<void> {
        try {
            const [
                relayConfig, stackingDetails, userDetails,
            ] = await Promise.all([
                this.getRelayConfig(),
                this.getStackingDetails(),
                this.getUserDetails(),
            ])
            const eventConfigDetails = stackingDetails
                ? await StakingDataStore.getEventConfigDetails(stackingDetails)
                : undefined
            const eventVoteData = userDetails && eventConfigDetails
                ? await this.getEventVoteData(userDetails, eventConfigDetails)
                : undefined
            const eventState = stackingDetails && eventVoteData
                ? await StakingDataStore.getEventState(stackingDetails, eventVoteData)
                : undefined

            if (stackingDetails) {
                await this.tokensCache.syncToken(stackingDetails.tokenRoot.toString())
            }

            if (this.isConnected) {
                this.setData({
                    relayConfig,
                    stackingDetails,
                    userDetails,
                    eventVoteData,
                    eventState,
                    eventConfigDetails,
                })
            }
        }
        catch (e) {
            error(e)
        }
    }

    public startUpdater(): void {
        this.stopUpdater()

        this.syncTimeoutId = window.setTimeout(async () => {
            try {
                await this.syncData()
            }
            catch (e) {
                error(e)
            }
            this.startUpdater()
        }, 5000)
    }

    public stopUpdater(): void {
        clearTimeout(this.syncTimeoutId)

        this.syncTimeoutId = undefined
    }

    public async forceUpdate(): Promise<void> {
        const hasUpdater = Boolean(this.syncTimeoutId)

        if (hasUpdater) {
            this.stopUpdater()
        }

        try {
            await this.syncData()

            if (hasUpdater) {
                this.startUpdater()
            }
        }
        catch (e) {
            error(e)
        }
    }

    public async fetchData(): Promise<void> {
        this.setIsLoading(true)

        try {
            await this.syncData()
            this.setIsLoaded(true)
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setIsLoading(false)
        }
    }

    public dispose(): void {
        this.state = STAKING_DATA_STORE_DEFAULT_STATE
        this.data = STAKING_DATA_STORE_DEFAULT_DATA
    }

    public async connectTonWallet(): Promise<void> {
        await this.tonWallet.connect()
    }

    protected setData(value: StakingDataStoreData): void {
        this.data = value
    }

    protected setIsLoading(value: boolean): void {
        this.state.isLoading = value
    }

    protected setIsLoaded(value: boolean): void {
        this.state.isLoaded = value
    }

    public get isLoading(): boolean {
        return this.state.isLoading
            || this.tonWallet.isConnecting
            || this.tonWallet.isInitializing
    }

    public get isLoaded(): boolean {
        return this.state.isLoaded
    }

    public get isConnected(): boolean {
        return this.tonWallet.isInitialized
            && this.tokensCache.isReady
            && this.tonWallet.isConnected
    }

    public get stakingToken(): TokenCache | undefined {
        if (!this.data.stackingDetails) {
            return undefined
        }

        return this.tokensCache.get(
            this.data.stackingDetails?.tokenRoot.toString(),
        )
    }

    public get stakingTokenSymbol(): string | undefined {
        return this.stakingToken?.symbol
    }

    public get stakingTokenDecimals(): number | undefined {
        return this.stakingToken?.decimals
    }

    public get stakingBalance(): string {
        return this.data.userDetails?.token_balance || '0'
    }

    public get tonWalletBalance(): string {
        return this.tonWallet.balance
    }

    public get tonPubkeyConfirmed(): boolean | undefined {
        return this.data.userDetails?.ton_pubkey_confirmed
    }

    public get ethAddressConfirmed(): boolean | undefined {
        return this.data.userDetails?.eth_address_confirmed
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

    public get relayInitialTonDeposit(): string | undefined {
        if (!this.data.relayConfig) {
            return undefined
        }

        return new BigNumber(this.data.relayConfig.relayInitialTonDeposit)
            .plus('500000000')
            .toFixed()
    }

    public get eventInitialBalance(): string | undefined {
        if (!this.data.eventConfigDetails) {
            return undefined
        }

        return new BigNumber(this.data.eventConfigDetails._basicConfiguration.eventInitialBalance)
            .plus('500000000')
            .toFixed()
    }

    public get minRelayDeposit(): string | undefined {
        return this.data.relayConfig?.minRelayDeposit
    }

    public get bridgeEventConfigEthTon(): Address | undefined {
        return this.data.stackingDetails?.bridge_event_config_eth_ton
    }

    public get eventVoteData(): EventVoteData | undefined {
        return this.data.eventVoteData
    }

    public get eventStateIsDeployed(): boolean | undefined {
        return this.data.eventState?.isDeployed
    }

    public get isNeedToCreateKeys(): boolean {
        if (
            this.isConnected
            && this.state.isLoaded
            && !this.relayEthAddress
            && !this.relayTonPubkey
        ) {
            return true
        }

        return false
    }

}
