import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import bs58 from 'bs58'
import { Address } from 'everscale-inpage-provider'
import { type IReactionDisposer, computed, makeObservable, reaction, toJS } from 'mobx'

import {
    everSolEventConfigurationContract,
    getFullContractState,
    solanaTokenTransferProxyContract,
    tokenTransferEverSolEventContract,
} from '@/misc/contracts'
import { Pipeline } from '@/models'
import {
    type EventStateStatus,
    type PrepareStateStatus,
    type ReleaseStateStatus,
    type TvmTransferUrlParams,
} from '@/modules/Bridge/types'
import { findAssociatedTokenAddress, ixFromRust } from '@/modules/Bridge/utils'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type SolanaWalletService } from '@/stores/SolanaWalletService'
import { type NetworkShape } from '@/types'
import { debug, error, findNetwork } from '@/utils'
import initBridge, { getProposalAddress, withdrawalRequest } from '@/wasm/bridge'
import initRoundLoader, { unpackRelayRound } from '@/wasm/round_loader'

export type TvmSolanaPipelineData = {
    amount: string
    chainId?: string
    leftAddress?: string
    pipeline?: Pipeline
    rightAddress?: string
    token?: BridgeAsset
}

export type TvmSolanaPipelineState = {
    eventState?: {
        confirmations: number
        errorMessage?: string
        requiredConfirmations: number
        status: EventStateStatus
    }
    isCheckingContract: boolean
    prepareState?: {
        errorMessage?: string
        status: PrepareStateStatus
    }
    releaseState?: {
        errorMessage?: string
        isReleased?: boolean
        status: ReleaseStateStatus
        ttl?: number
    }
}

/* eslint-disable no-bitwise */
function intToUint8Array(i: number): Uint8Array {
    return Uint8Array.of((i & 0xff000000) >> 24, (i & 0x00ff0000) >> 16, (i & 0x0000ff00) >> 8, (i & 0x000000ff) >> 0)
}

export class TvmSolanaPipeline extends BaseStore<TvmSolanaPipelineData, TvmSolanaPipelineState> {

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly everWallet: EverWalletService,
        protected readonly solanaWallet: SolanaWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: TvmTransferUrlParams,
    ) {
        super()

        this.setData(() => ({ amount: '' }))
        this.setState(() => ({ isCheckingContract: false }))

        makeObservable<TvmSolanaPipeline>(this, {
            amount: computed,
            contractAddress: computed,
            isEverscaleBasedToken: computed,
            leftAddress: computed,
            rightAddress: computed,
            eventState: computed,
            prepareState: computed,
            releaseState: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            token: computed,
            useEverWallet: computed,
            useSolanaWallet: computed,
            useBridgeAssets: computed,
            success: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.contractAddress === undefined) {
            return
        }

        this.#bridgeAssetsDisposer = reaction(
            () => this.bridgeAssets.isReady,
            async isReady => {
                if (isReady) {
                    await this.checkContract(true)
                }
            },
            { fireImmediately: true },
        )
    }

    public dispose(): void {
        this.#bridgeAssetsDisposer?.()
        this.stopEventUpdater()
        this.stopReleaseUpdater()
    }

    public async checkContract(force: boolean = false): Promise<void> {
        if (this.contractAddress === undefined || (this.state.isCheckingContract && !force)) {
            return
        }

        this.setState({
            isCheckingContract: true,
            prepareState: {
                status: this.prepareState?.status || 'pending',
            },
        })

        try {
            const state = await getFullContractState(this.contractAddress)

            if (!state?.isDeployed) {
                setTimeout(async () => {
                    await this.checkContract(true)
                }, 5000)
            }
 else {
                this.setState('isCheckingContract', false)
            }
        }
 catch (e) {
            error('Check contract error', e)
            this.setState('isCheckingContract', false)
            return
        }

        if (!this.state.isCheckingContract) {
            try {
                await this.resolve()
            }
 catch (e) {
                error('Resolve error', e)
            }
        }
    }

    public async resolve(): Promise<void> {
        if (this.contractAddress === undefined || this.leftNetwork === undefined) {
            return
        }

        const [eventDetails, eventData] = await Promise.all([
            tokenTransferEverSolEventContract(this.contractAddress).methods.getDetails({ answerId: 0 }).call(),
            tokenTransferEverSolEventContract(this.contractAddress).methods.getDecodedData({ answerId: 0 }).call(),
        ])

        const proxyAddress = (
            await everSolEventConfigurationContract(eventDetails._eventInitData.configuration)
                .methods.getDetails({ answerId: 0 })
                .call()
        )._networkConfiguration.eventEmitter

        const { senderAddress, solanaOwnerAddress, tokens: amount } = eventData

        const tokenAddress = (
            await solanaTokenTransferProxyContract(proxyAddress).methods.getTokenRoot({ answerId: 0 }).call()
        ).value0

        const token = this.bridgeAssets.get(
            this.leftNetwork.type,
            this.leftNetwork.chainId,
            tokenAddress.toString().toLowerCase(),
        )

        if (token === undefined) {
            return
        }

        this.setData({
            amount: new BigNumber(amount || 0).shiftedBy(-token.decimals).toFixed(),
            leftAddress: senderAddress.toString(),
            rightAddress: bs58.encode(Buffer.from(new BigNumber(solanaOwnerAddress).toString(16), 'hex')),
            token,
        })

        this.setState({
            prepareState: {
                status: 'confirmed',
            },
            releaseState: {
                status: 'pending',
            },
        })

        if (
            this.token?.root !== undefined
            && this.leftNetwork?.type !== undefined
            && this.leftNetwork?.chainId !== undefined
            && this.rightNetwork?.type !== undefined
            && this.rightNetwork?.chainId !== undefined
        ) {
            const pipeline = await this.bridgeAssets.pipeline(
                this.token.root,
                `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            )

            this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
        }

        this.runReleaseUpdater()
    }

    public async release(): Promise<void> {
        if (
            this.solanaWallet.publicKey == null
            || this.solanaWallet.connection === undefined
            || this.rightAddress === undefined
            || this.leftNetwork === undefined
            || this.rightNetwork === undefined
            || this.contractAddress === undefined
            || this.pipeline === undefined
            || this.pipeline?.name === undefined
            || this.pipeline?.solanaTokenAddress === undefined
            || this.token === undefined
        ) {
            return
        }

        try {
            this.setState('releaseState', {
                ...this.releaseState,
                status: 'pending',
            })

            const rightAddressKey = new PublicKey(this.rightAddress)
            let transaction = new Transaction()

            const account = (
                await this.connection?.getParsedTokenAccountsByOwner(rightAddressKey, {
                    programId: TOKEN_PROGRAM_ID,
                })
            )?.value
                .filter(
                    item => this.pipeline?.solanaTokenAddress?.equals(
                        new PublicKey(item.account.data.parsed.info.mint),
                    ),
                )
                .sort(
                    (a, b) => a.account.data.parsed.info.tokenAmount.uiAmount
                        - b.account.data.parsed.info.tokenAmount.uiAmount,
                )
                .pop()?.pubkey

            if (account == null) {
                const associatedTokenAddress = await findAssociatedTokenAddress(
                    rightAddressKey,
                    this.pipeline.solanaTokenAddress,
                )
                const instruction = await createAssociatedTokenAccountInstruction(
                    this.solanaWallet.publicKey,
                    associatedTokenAddress,
                    rightAddressKey,
                    this.pipeline.solanaTokenAddress,
                )
                transaction = transaction.add(instruction)
            }

            const eventContract = tokenTransferEverSolEventContract(this.contractAddress)
            const cachedState = await getFullContractState(this.contractAddress)
            const [eventDetails, roundNumber, eventData] = await Promise.all([
                eventContract.methods.getDetails({ answerId: 0 }).call({ cachedState }),
                (await eventContract.methods.round_number({}).call({ cachedState })).round_number,
                eventContract.methods.getDecodedData({ answerId: 0 }).call({ cachedState }),
            ])

            const { senderAddress, solanaOwnerAddress, tokens } = eventData

            const instruction = await withdrawalRequest(
                this.solanaWallet.publicKey.toBase58(),
                this.solanaWallet.publicKey.toBase58(),
                this.pipeline.name,
                Number(eventDetails._eventInitData.voteData.eventTimestamp),
                BigInt(eventDetails._eventInitData.voteData.eventTransactionLt),
                bs58.encode(Buffer.from(eventDetails._eventInitData.configuration.toString().split(':')[1], 'hex')),
                senderAddress.toString(),
                bs58.encode(Buffer.from(new BigNumber(solanaOwnerAddress).toString(16), 'hex')),
                tokens,
                Number(roundNumber),
            )

            transaction = transaction.add(ixFromRust(instruction))
            const signature = await this.solanaWallet.adapter.sendTransaction(transaction, this.solanaWallet.connection)

            const latestBlockHash = await this.connection?.getLatestBlockhash()
            await this.solanaWallet.connection.confirmTransaction(
                {
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature,
                },
                'processed',
            )
        }
 catch (e) {
            this.setState('releaseState', {
                ...this.releaseState,
                status: 'disabled',
            })
            error('Release tokens error', e)
        }
    }

    protected runReleaseUpdater(): void {
        debug('runReleaseUpdater', toJS(this.data), toJS(this.state))

        this.stopReleaseUpdater();
(async () => {
            if (
                this.contractAddress !== undefined
                && this.token !== undefined
                && this.pipeline !== undefined
                && this.pipeline.settings !== undefined
                && this.rightNetwork !== undefined
            ) {
                const network = findNetwork(this.pipeline.chainId, 'solana')

                if (network === undefined) {
                    return
                }

                const eventContract = tokenTransferEverSolEventContract(this.contractAddress)
                const cachedState = await getFullContractState(this.contractAddress)
                const [eventDetails, roundNumber, eventData] = await Promise.all([
                    eventContract.methods.getDetails({ answerId: 0 }).call({ cachedState }),
                    (await eventContract.methods.round_number({}).call({ cachedState })).round_number,
                    eventContract.methods.getDecodedData({ answerId: 0 }).call({ cachedState }),
                ])

                const { senderAddress, solanaOwnerAddress, tokens: amount } = eventData

                await initBridge()

                const proposalAddress = await getProposalAddress(
                    this.pipeline.settings.toBase58(),
                    Number(roundNumber),
                    Number(eventDetails._eventInitData.voteData.eventTimestamp),
                    BigInt(eventDetails._eventInitData.voteData.eventTransactionLt),
                    bs58.encode(Buffer.from(eventDetails._eventInitData.configuration.toString().split(':')[1], 'hex')),
                    senderAddress.toString(),
                    bs58.encode(Buffer.from(new BigNumber(solanaOwnerAddress).toString(16), 'hex')),
                    amount,
                )

                let ttl: number | undefined

                try {
                    const [publicKey] = await PublicKey.findProgramAddress(
                        [intToUint8Array(Number(roundNumber)).reverse()],
                        new PublicKey('RLoadKXJz5Nsj4YW6mefe1eNVdFUsZvxyinir7fpEeM'),
                    )

                    const round = await this.connection?.getAccountInfo(publicKey)

                    await initRoundLoader()

                    const decodedRound = round?.data ? await unpackRelayRound(round.data) : undefined
                    ttl = decodedRound?.round_end
                }
 catch (e) {
                    error(e)
                }

                const firstIteration = this.releaseState?.isReleased === undefined
                const isReleased = (await this.connection?.getAccountInfo(new PublicKey(proposalAddress))) != null

                if (this.releaseState?.status === 'pending' && firstIteration) {
                    const status = isReleased ? 'confirmed' : 'disabled'
                    this.setState('releaseState', {
                        isReleased,
                        status,
                        ttl,
                    })
                }

                if (isReleased) {
                    this.setState({
                        eventState: {
                            confirmations: this.eventState?.confirmations ?? 0,
                            requiredConfirmations: this.eventState?.requiredConfirmations ?? 0,
                            status: 'pending',
                        },
                        releaseState: {
                            ...this.releaseState,
                            isReleased: true,
                            status: 'confirmed',
                        },
                    })

                    this.runEventUpdater()
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

    protected runEventUpdater(): void {
        debug('runEventUpdater', toJS(this.data), toJS(this.state))

        this.stopEventUpdater();
(async () => {
            if (this.contractAddress === undefined || this.pipeline === undefined || this.leftNetwork === undefined) {
                return
            }

            const eventContract = tokenTransferEverSolEventContract(this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

            let status: EventStateStatus = 'pending'

            if (eventDetails._status === '2') {
                status = 'confirmed'
            }
 else if (eventDetails._status === '3') {
                status = 'rejected'
            }

            this.setState('eventState', {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status,
            })
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

    protected get connection(): Connection {
        const network = findNetwork(this.rightNetwork?.chainId as string, 'solana')
        return new Connection(network?.rpcUrl as string, { commitment: 'finalized' })
    }

    public get amount(): TvmSolanaPipelineData['amount'] {
        return this.data.amount
    }

    public get pipeline(): TvmSolanaPipelineData['pipeline'] {
        return this.data.pipeline
    }

    public get leftAddress(): TvmSolanaPipelineData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): TvmSolanaPipelineData['rightAddress'] {
        return this.data.rightAddress
    }

    public get eventState(): TvmSolanaPipelineState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): TvmSolanaPipelineState['prepareState'] {
        return this.state.prepareState
    }

    public get releaseState(): TvmSolanaPipelineState['releaseState'] {
        return this.state.releaseState
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType)
    }

    public get rightNetwork(): NetworkShape | undefined {
        if (this.params?.toId === undefined || this.params?.toType === undefined) {
            return undefined
        }
        return findNetwork(this.params.toId, this.params.toType)
    }

    public get isEverscaleBasedToken(): boolean {
        return this.pipeline?.tokenBase === 'tvm'
    }

    public get token(): BridgeAsset | undefined {
        return this.data.token
    }

    public get contractAddress(): Address | undefined {
        return this.params?.contractAddress !== undefined ? new Address(this.params.contractAddress) : undefined
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useSolanaWallet(): SolanaWalletService {
        return this.solanaWallet
    }

    public get useBridgeAssets(): BridgeAssetsService {
        return this.bridgeAssets
    }

    public get success(): boolean {
        return this.eventState?.status === 'confirmed'
    }

    #bridgeAssetsDisposer: IReactionDisposer | undefined

}
