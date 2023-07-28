import { type DecodedAbiFunctionInputs } from 'everscale-inpage-provider'

import { type BridgeAbi } from '@/misc'
import { type Pipeline } from '@/models'
import { type NetworkShape, type NetworkType } from '@/types'

export type ApprovalStrategies = 'infinity' | 'fixed'

export enum TransitOperation {
    BurnToAlienProxy = '0',
    BurnToMergePool = '1',
    TransferToNativeProxy = '2'
}

export enum BurnType {
    Withdraw,
    Swap
}

export enum CrosschainBridgeStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainBridgeStoreData = {
    amount: string
    bridgeFee?: string
    eventInitialBalance?: number
    evmGas?: string
    evmPendingWithdrawal?: EvmPendingWithdrawal
    expectedEversAmount?: string
    gasPrice?: string
    gasUsage?: string
    leftAddress: string
    leftNetwork?: NetworkShape
    maxTransferFee?: string
    minTransferFee?: string
    pendingWithdrawals?: PendingWithdrawal[]
    pipeline?: Pipeline
    rate?: string
    rightAddress: string
    rightNetwork?: NetworkShape
    secondPipeline?: Pipeline
    selectedToken?: string
    txHash?: string
}

export type CrosschainBridgeStoreState = {
    approvalStrategy: ApprovalStrategies
    isCalculating: boolean
    isFetching: boolean
    isLocked: boolean
    isPendingAllowance: boolean
    isPendingApproval: boolean
    isProcessing: boolean
    isSwapEnabled?: boolean
    step: CrosschainBridgeStep
}

export type AddressesFields = Pick<CrosschainBridgeStoreData, 'leftAddress' | 'rightAddress'>

export type EvmEventVoteData = DecodedAbiFunctionInputs<typeof BridgeAbi.EthereumEverscaleEventConfiguration, 'deployEvent'>['eventVoteData']

export type SolanaEventVoteData = DecodedAbiFunctionInputs<typeof BridgeAbi.SolanaEverscaleEventConfiguration, 'deployEvent'>['eventVoteData']

export type NetworkFields = Pick<CrosschainBridgeStoreData, 'leftNetwork' | 'rightNetwork'>

export type EventStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type PrepareStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type ReleaseStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferUrlBaseParams = {
    fromId: string;
    fromType: NetworkType;
    toId: string;
    toType: NetworkType;
}

export type EvmTransferUrlParams = TransferUrlBaseParams & {
    txHash: string;
}

export type TvmTransferUrlParams = TransferUrlBaseParams & {
    contractAddress: string;
}

export type SolanaTransferUrlParams = TransferUrlBaseParams & {
    txSignature: string;
}

export type PendingWithdrawalStatus = 'Close' | 'Open'

export type PendingWithdrawal = {
    id: string;
    amount: string;
    bounty: string;
    recipient: string;
    timestamp?: string;
    approveStatus?: string;
}

export type PendingWithdrawalId = {
    recipient: string;
    id: string;
}

export type EvmPendingWithdrawal = {
    chainId: string;
    evmTokenAddress: string;
    withdrawalIds: PendingWithdrawalId[];
}
