import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import {
    IReactionDisposer,
    makeAutoObservable,
    runInAction, when,
} from 'mobx'
import ton, { Address, Contract } from 'ton-inpage-provider'

import { TokenAbi } from '@/misc'
import { NetworkShape, TonTransferStatusParams } from '@/modules/CrosschainTransfer/types'
import { TonWalletService } from '@/stores/TonWalletService'
import { TokenCache, TokensCacheService } from '@/stores/TokensCacheService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { findNetwork } from '@/modules/CrosschainTransfer/utils'


type TonTransferStatusStoreData = {
    amount: string;
    chainId?: string | number;
    encodedEvent?: string;
    leftAddress?: string;
    rightAddress?: string;
    token: TokenCache | undefined;
    withdrawalId?: string;
}

type TonTransferStatusStoreState = {
    isContractDeployed: boolean;
    prepared?: boolean;
    eventState?: {
        status: 'confirmed' | 'pending' | 'disabled' | 'rejected';
        confirmations: number;
        requiredConfirmations: number;
    };
    releaseState?: 'confirmed' | 'pending' | 'disabled' | 'rejected';
}


export class TonTransferStatus {

    protected data: TonTransferStatusStoreData = {
        amount: '',
        token: undefined,
        withdrawalId: undefined,
    }

    protected state: TonTransferStatusStoreState = {
        isContractDeployed: false,
        prepared: undefined,
        eventState: undefined,
        releaseState: undefined,
    }

    constructor(
        protected readonly crystalWallet: TonWalletService,
        protected readonly evmWallet: EvmWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: TonTransferStatusParams,
    ) {
        makeAutoObservable(this)
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        this.state.prepared = false

        this.#contractDisposer = when(() => this.state.isContractDeployed, async () => {
            await this.resolve()
        })

        this.checkContract()
    }

    public dispose(): void {
        this.#contractDisposer?.()
        this.stopEventUpdater()
        this.stopReleaseUpdater()
    }

    public checkContract(): void {
        const check = async () => {
            if (this.contractAddress !== undefined) {
                const { state } = await ton.getFullContractState({
                    address: new Address(this.contractAddress),
                })
                if (state?.isDeployed) {
                    runInAction(() => {
                        this.state.isContractDeployed = true
                        this.state.prepared = true
                    })
                }
            }
        }
        check().then(() => {
            if (!this.state.isContractDeployed) {
                setTimeout(async () => {
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
        ) {
            return
        }

        const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))

        const eventDetails = await eventContract.methods.getDetails({
            answerId: 0,
        }).call()
        const eventData = await eventContract.methods.getDecodedData({
            answerId: 0,
        }).call()

        const proxyAddress = eventDetails._initializer

        const proxyContract = new Contract(TokenAbi.TokenTransferProxy, proxyAddress)
        const tokenAddress = (await proxyContract.methods.getTokenRoot({
            answerId: 0,
        }).call()).value0

        const { chainId } = eventData
        const amount = eventData.tokens
        const token = this.tokensCache.get(tokenAddress.toString())

        await this.tokensCache.syncEvmToken(token!.root, chainId)

        const leftAddress = eventData.owner_address.toString()
        const rightAddress = `0x${new BigNumber(eventData.ethereum_address).toString(16).padStart(40, '0')}`

        runInAction(() => {
            this.data.amount = amount
            this.data.chainId = chainId
            this.data.token = token
            this.data.leftAddress = leftAddress
            this.data.rightAddress = rightAddress
        })

        this.runEventUpdater()
    }

    public async release(reject?: () => void): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.contractAddress === undefined
        ) {
            return
        }

        const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))
        const eventDetails = await eventContract.methods.getDetails({
            answerId: 0,
        }).call()

        const signatures = eventDetails._signatures.map(s => {
            const signature = `0x${Buffer.from(s, 'base64').toString('hex')}`
            const address = this.evmWallet.web3!.eth.accounts.recover(
                this.evmWallet.web3!.utils.sha3(this.data.encodedEvent!)!,
                signature,
            )
            const order = new BigNumber(address.slice(2).toUpperCase(), 16)
            return { address, signature, order }
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
            this.token!.root,
            this.rightNetwork!.chainId,
        )!

        try {
            await wrapperContract.methods.saveWithdraw(
                this.data.encodedEvent!,
                signatures.map(({ signature }) => signature),
                0,
            ).send({
                from: this.evmWallet.address,
            })
        }
        catch (e) {
            reject?.()
            console.log(e)
        }
    }

    protected runEventUpdater(): void {
        this.stopEventUpdater();

        (async () => {
            if (this.contractAddress === undefined) {
                return
            }

            const eventContract = new Contract(TokenAbi.TokenTransferTonEvent, new Address(this.contractAddress))

            const eventDetails = await eventContract.methods.getDetails({
                answerId: 0,
            }).call()

            runInAction(() => {
                this.state.eventState = {
                    requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                    confirmations: eventDetails._confirms.length,
                    // eslint-disable-next-line no-nested-ternary
                    status: eventDetails._status === '2'
                        ? 'confirmed'
                        : (eventDetails._status === '3' ? 'rejected' : 'pending'),
                }
            })

            if (this.state.eventState?.status === 'confirmed') {
                const eventData = await eventContract.methods.getDecodedData({
                    answerId: 0,
                }).call()

                const proxyAddress = eventDetails._initializer

                const proxyContract = new Contract(TokenAbi.TokenTransferProxy, proxyAddress)
                const tokenAddress = (await proxyContract.methods.getTokenRoot({
                    answerId: 0,
                }).call()).value0

                const { chainId } = eventData
                const token = this.tokensCache.get(tokenAddress.toString())

                await this.tokensCache.syncEvmToken(token!.root, chainId)

                const proxyDetails = await proxyContract.methods.getDetails({
                    answerId: 0,
                }).call()

                const eventConfig = new Contract(TokenAbi.TonEventConfig, proxyDetails.value0.tonConfiguration)
                const eventConfigDetails = await eventConfig.methods.getDetails({
                    answerId: 0,
                }).call()
                const eventAbi = atob(eventConfigDetails._basicConfiguration.eventABI)
                const eventDataEncoded = mapTonCellIntoEthBytes(
                    eventAbi,
                    eventDetails._eventInitData.voteData.eventData,
                )

                const encodedEvent = this.evmWallet.web3!.eth.abi.encodeParameters([{
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
                    eventContractWid: this.contractAddress.split(':')[0],
                    eventContractAddress: `0x${this.contractAddress.split(':')[1]}`,
                    proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                    round: (await eventContract.methods.round_number({}).call()).round_number,
                }])

                const withdrawalId = this.evmWallet.web3!.utils.keccak256(encodedEvent)

                runInAction(() => {
                    this.data.encodedEvent = encodedEvent
                    this.data.withdrawalId = withdrawalId
                })


                this.runReleaseUpdater()
            }
        })().finally(() => {
            if (this.state.eventState?.status !== 'confirmed' && this.state.eventState?.status !== 'rejected') {
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
        this.stopReleaseUpdater();

        (async () => {
            if (this.data.withdrawalId !== undefined) {
                const vaultContract = this.tokensCache.getEthTokenVaultContract(
                    this.token!.root,
                    this.rightNetwork!.chainId,
                )
                const released = await vaultContract?.methods.withdrawIds(this.data.withdrawalId).call()

                if (released) {
                    runInAction(() => {
                        this.state.releaseState = 'confirmed'
                    })
                }
            }
        })().finally(() => {
            if (this.state.releaseState !== 'confirmed' && this.state.releaseState !== 'rejected') {
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

    public get amount(): TonTransferStatusStoreData['amount'] {
        return this.data.amount
    }

    public get amountNumber(): BigNumber {
        return this.data.token === undefined
            ? new BigNumber(0)
            : new BigNumber(this.data.amount).shiftedBy(-this.data.token.decimals)
    }

    public get leftAddress(): TonTransferStatusStoreData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): TonTransferStatusStoreData['rightAddress'] {
        return this.data.rightAddress
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

    public get contractAddress(): TonTransferStatusParams['contractAddress'] | undefined {
        return this.params?.contractAddress
    }

    public get prepared(): TonTransferStatusStoreState['prepared'] {
        return this.state.prepared
    }

    public get eventState(): TonTransferStatusStoreState['eventState'] {
        return this.state.eventState
    }

    public get releaseState(): TonTransferStatusStoreState['releaseState'] {
        return this.state.releaseState
    }

    #contractDisposer: IReactionDisposer | undefined

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

}
