import BigNumber from 'bignumber.js'
import bs58 from 'bs58'
import { Address } from 'everscale-inpage-provider'
import {
    computed,
    makeObservable,
    reaction,
    toJS,
} from 'mobx'
import type { IReactionDisposer } from 'mobx'
import { Connection } from '@solana/web3.js'

import initBridge, { unpackDeposit, unpackTokenSettings } from '@/wasm/bridge'
import rpc from '@/hooks/useRpcClient'
import staticRpc from '@/hooks/useStaticRpc'
import {
    getFullContractState,
    solEverEventConfigurationContract, tokenTransferSolEverEventContract,
} from '@/misc/contracts'
import { Pipeline } from '@/models'
import type {
    EventStateStatus,
    PrepareStateStatus,
    SolanaEventVoteData,
    SolanaTransferUrlParams,
    TransferStateStatus,
} from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import type { BridgeAsset, BridgeAssetsService } from '@/stores/BridgeAssetsService'
import type { EverWalletService } from '@/stores/EverWalletService'
import type { SolanaWalletService } from '@/stores/SolanaWalletService'
import type { NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork, throwException,
} from '@/utils'


export type SolanaEverscalePipelineData = {
    amount: string;
    deriveEventAddress?: Address;
    eventVoteData?: SolanaEventVoteData;
    leftAddress?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    token?: BridgeAsset;
}

export type SolanaEverscalePipelineState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
    isCheckingTransaction: boolean;
    prepareState?: {
        errorMessage?: string;
        isDeployed?: boolean;
        isDeploying?: boolean;
        isTokenDeployed?: boolean;
        isTokenDeploying?: boolean;
        status: PrepareStateStatus;
    };
    transferState?: {
        errorMessage?: string;
        status: TransferStateStatus;
    };
}


export class SolanaEverscalePipeline extends BaseStore<SolanaEverscalePipelineData, SolanaEverscalePipelineState> {

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected txPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly solanaWallet: SolanaWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: SolanaTransferUrlParams,
    ) {
        super()

        this.setData({ amount: '0' })
        this.setState({ isCheckingTransaction: false })

        makeObservable(this, {
            amount: computed,
            leftAddress: computed,
            rightAddress: computed,
            token: computed,
            eventState: computed,
            prepareState: computed,
            transferState: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            txSignature: computed,
            useEverWallet: computed,
            useSolanaWallet: computed,
            useBridgeAssets: computed,
        })
    }

    public async init(): Promise<void> {
        await initBridge()

        if (this.txSignature === undefined) {
            return
        }

        this.#bridgeAssetsDisposer = reaction(() => this.bridgeAssets.isReady, async isReady => {
            if (isReady) {
                await this.checkTransaction(true)
            }
        }, { fireImmediately: true })
    }

    public dispose(): void {
        this.#bridgeAssetsDisposer?.()
        this.stopPrepareUpdater()
    }

    public async checkTransaction(force: boolean = false): Promise<void> {
        if (this.txSignature === undefined || (this.state.isCheckingTransaction && !force)) {
            return
        }

        this.setState({
            isCheckingTransaction: true,
            transferState: {
                status: this.transferState?.status || 'pending',
            },
        })

        try {
            const txReceipt = await this.connection?.getParsedTransaction(this.txSignature)

            if (txReceipt == null) {
                setTimeout(async () => {
                    await this.checkTransaction(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingTransaction', false)
            }
        }
        catch (e) {
            error('Check transaction error', e)
            this.setState('isCheckingTransaction', false)
            return
        }

        if (!this.state.isCheckingTransaction) {
            try {
                switch (true) {
                    case this.transferState?.status === 'confirmed' && this.prepareState?.status !== 'confirmed':
                        await this.runPrepareUpdater()
                        break

                    default:
                        await this.resolve()
                }
            }
            catch (e) {
                error('Resolve error', e)
            }
        }
    }

    public async resolve(): Promise<void> {
        if (
            this.txSignature === undefined
            || this.leftNetwork === undefined
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        const network = findNetwork(this.leftNetwork.chainId, 'solana')

        if (network === undefined) {
            return
        }

        this.setState('transferState', {
            status: 'pending',
        })

        try {
            const txReceipt = await this.connection?.getConfirmedTransaction(this.txSignature)

            if (txReceipt == null) {
                await this.checkTransaction()
                return
            }

            const [instruction] = txReceipt.transaction.instructions
            const depositAccount = instruction.keys[4]
            const settingsAccount = instruction.keys[7]

            const [depositInfo, tokenInfo] = await Promise.all([
                this.connection?.getAccountInfo(depositAccount.pubkey),
                this.connection?.getAccountInfo(settingsAccount.pubkey),
            ])

            if (depositInfo == null || tokenInfo == null) {
                throwException('Cant find deposit or token info')
                return
            }

            const deposit = unpackDeposit(depositInfo.data)
            const settings = unpackTokenSettings(tokenInfo.data)
            const mint = bs58.encode(settings.kind.Solana.mint)
            const token: BridgeAsset | undefined = this.bridgeAssets.get('solana', '1', mint)

            if (token === undefined) {
                return
            }

            this.setData('token', token)

            if (
                this.token?.root !== undefined
                && this.leftNetwork?.type !== undefined
                && this.leftNetwork?.chainId !== undefined
                && this.rightNetwork?.type !== undefined
                && this.rightNetwork?.chainId !== undefined
            ) {
                const pipeline = await this.bridgeAssets.pipeline(
                    token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    this.depositType,
                )

                this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
            }

            if (this.pipeline?.solanaConfiguration === undefined) {
                return
            }

            const amount = new BigNumber(deposit.event.data.amount || 0)
                .shiftedBy(-(this.pipeline?.solanaTokenDecimals ?? 0))

            const { blockTime, slot } = txReceipt
            const accountSeed = deposit.meta.seed

            const targetWid = deposit.event.data.recipient_address.AddrStd.workchain_id
            const targetAddress = Buffer.from(deposit.event.data.recipient_address.AddrStd.address).toString('hex')
            const senderAddress = bs58.encode(deposit.event.data.sender_address)

            const eventData = await staticRpc.packIntoCell({
                data: {
                    sender_add: `0x${Buffer.from(deposit.event.data.sender_address).toString('hex')}`,
                    tokens: deposit.event.data.amount,
                    receiver_addr: new Address(`${targetWid}:${targetAddress}`),
                },
                structure: [
                    { name: 'sender_add', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ] as const,
            })
            const eventVoteData = {
                accountSeed,
                blockTime: blockTime?.toString() ?? '0',
                eventData: eventData.boc,
                slot: slot.toString(),
                txSignature: this.txSignature,
            }

            const deriveEventAddress = (await solEverEventConfigurationContract(this.pipeline.solanaConfiguration)
                .methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                })
                .call())
                .eventContract

            this.setData({
                amount: amount.toFixed(),
                deriveEventAddress,
                eventVoteData,
                leftAddress: senderAddress,
                rightAddress: `${targetWid}:${targetAddress}`.toLowerCase(),
            })

            this.setState('transferState', {
                status: 'confirmed',
            })

            this.runPrepareUpdater()
        }
        catch (e) {
            error('Resolve error', e)
            this.setState('transferState', {
                status: 'disabled',
            })
        }
    }

    public async prepare(): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
            || this.pipeline?.solanaConfiguration === undefined
            || this.data.eventVoteData === undefined
        ) {
            return
        }

        this.setState('prepareState', {
            ...this.prepareState,
            isDeploying: true,
            status: 'pending',
        })

        try {
            await solEverEventConfigurationContract(this.pipeline.solanaConfiguration, rpc)
                .methods.deployEvent({
                    eventVoteData: this.data.eventVoteData,
                })
                .send({
                    amount: '6000000000',
                    bounce: true,
                    from: this.everWallet.account.address,
                })
        }
        catch (e: any) {
            error('Prepare error', e)
            this.setState('prepareState', {
                ...this.prepareState,
                status: 'disabled',
            })
        }
        finally {
            this.setState('prepareState', {
                ...this.prepareState,
                isDeploying: false,
            } as SolanaEverscalePipelineState['prepareState'])
        }
    }

    protected runPrepareUpdater(): void {
        debug('runPrepareUpdater', toJS(this.data), toJS(this.state))

        this.stopPrepareUpdater();

        (async () => {
            if (this.rightNetwork === undefined || this.prepareState?.isDeploying === true) {
                return
            }

            if (this.deriveEventAddress === undefined) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
                return
            }

            const isFirstIteration = this.prepareState?.isDeployed === undefined

            if (isFirstIteration) {
                this.setState('prepareState', {
                    ...this.prepareState,
                    status: 'pending',
                })
            }

            const cachedState = await getFullContractState(this.deriveEventAddress)

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (isFirstIteration) {
                    this.setState('prepareState', {
                        ...this.prepareState,
                        isDeployed: false,
                        status: 'disabled',
                    })
                }

                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }

                return
            }

            const eventDetails = await tokenTransferSolEverEventContract(this.deriveEventAddress)
                .methods.getDetails({ answerId: 0 })
                .call({ cachedState })

            const eventState: SolanaEverscalePipelineState['eventState'] = {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status: 'pending',
            }

            if (eventDetails._status === '2') {
                eventState.status = 'confirmed'
            }
            else if (eventDetails._status === '3') {
                eventState.status = 'rejected'
            }

            if (this.prepareState?.status !== 'confirmed') {
                this.setState('prepareState', {
                    ...this.prepareState,
                    isDeployed: true,
                    status: 'confirmed',
                })
            }

            this.setState('eventState', eventState)
        })().finally(() => {
            if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                this.txPrepareUpdater = setTimeout(() => {
                    this.runPrepareUpdater()
                }, 5000)
            }
        })
    }

    protected stopPrepareUpdater(): void {
        if (this.txPrepareUpdater !== undefined) {
            clearTimeout(this.txPrepareUpdater)
            this.txPrepareUpdater = undefined
        }
    }

    protected get connection(): Connection {
        const network = findNetwork(this.leftNetwork?.chainId as string, 'solana')
        return new Connection(network?.rpcUrl as string, { commitment: 'finalized' })
    }

    public get pipeline(): SolanaEverscalePipelineData['pipeline'] {
        return this.data.pipeline
    }

    public get amount(): SolanaEverscalePipelineData['amount'] {
        return this.data.amount
    }

    public get deriveEventAddress(): SolanaEverscalePipelineData['deriveEventAddress'] {
        return this.data.deriveEventAddress
    }

    public get leftAddress(): SolanaEverscalePipelineData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): SolanaEverscalePipelineData['rightAddress'] {
        return this.data.rightAddress
    }

    public get token(): SolanaEverscalePipelineData['token'] {
        return this.data.token
    }

    public get eventState(): SolanaEverscalePipelineState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): SolanaEverscalePipelineState['prepareState'] {
        return this.state.prepareState
    }

    public get transferState(): SolanaEverscalePipelineState['transferState'] {
        return this.state.transferState
    }

    public get depositType(): SolanaTransferUrlParams['depositType'] {
        return this.params?.depositType
    }

    public get txSignature(): SolanaTransferUrlParams['txSignature'] | undefined {
        return this.params?.txSignature
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get depositFee(): string {
        if (this.pipeline?.isMultiVault) {
            return this.amountNumber
                .times(this.pipeline?.depositFee ?? 0)
                .div(10000)
                .dp(0, BigNumber.ROUND_UP)
                .shiftedBy(-(this.pipeline.evmTokenDecimals || 0))
                .toFixed()
        }
        return '0'
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

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useSolanaWallet(): SolanaWalletService {
        return this.solanaWallet
    }

    public get useBridgeAssets(): BridgeAssetsService {
        return this.bridgeAssets
    }

    #bridgeAssetsDisposer: IReactionDisposer | undefined

}
