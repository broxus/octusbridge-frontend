import { Address, DecodedAbiFunctionInputs, FullContractState } from 'everscale-inpage-provider'

import { NetworkShape, NetworkType } from '@/types'
import { BridgeAbi } from '@/misc'
import { EverscaleToken, EvmToken, Pipeline } from '@/models'
import { BridgeAsset } from '@/stores/BridgeAssetsService'

export type ApprovalStrategies = 'infinity' | 'fixed'

export enum CrosschainBridgeStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainBridgeStoreData = {
    amount: string;
    bridgeFee?: string;
    creditFactoryFee?: string;
    depositType: 'default' | 'credit';
    eversAmount?: string;
    hiddenBridgePipeline?: Pipeline;
    leftAddress: string;
    leftNetwork?: NetworkShape;
    maxEversAmount?: string;
    maxTokenAmount?: string;
    maxTransferFee?: string;
    minAmount?: string;
    minEversAmount?: string;
    minReceiveTokens?: string;
    minTransferFee?: string;
    pairAddress?: Address;
    pairState?: FullContractState;
    pipeline?: Pipeline;
    rightAddress: string;
    rightNetwork?: NetworkShape;
    selectedToken?: string;
    swapType: '0' | '1';
    tokenAmount?: string;
    txHash?: string;
    pendingWithdrawals?: PendingWithdrawal[];
}

export type CrosschainBridgeStoreState = {
    approvalStrategy: ApprovalStrategies;
    isCalculating: boolean;
    isFetching: boolean;
    isLocked: boolean;
    isPendingAllowance: boolean;
    isPendingApproval: boolean;
    isProcessing: boolean;
    isTokenChainSameToTargetChain: boolean;
    step: CrosschainBridgeStep;
    evmPendingWithdrawal?: EvmPendingWithdrawal;
}

export type AddressesFields = Pick<CrosschainBridgeStoreData, 'leftAddress' | 'rightAddress'>

export type EventVoteData = DecodedAbiFunctionInputs<typeof BridgeAbi.EthereumEventConfiguration, 'deployEvent'>['eventVoteData']

export type NetworkFields = Pick<CrosschainBridgeStoreData, 'leftNetwork' | 'rightNetwork'>

export type EventStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type PrepareStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type ReleaseStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type SwapStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type EvmTransferQueryParams = {
    depositType?: string;
    fromId: string;
    fromType: NetworkType;
    toId: string;
    toType: NetworkType;
    txHash: string;
}

export type EvmTransferStoreData = {
    amount: string;
    deriveEventAddress?: Address;
    eventVoteData?: EventVoteData;
    leftAddress?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    token?: (EverscaleToken | EvmToken);
    pendingWithdrawals?: PendingWithdrawal[];
}

export type EvmTransferStoreState = {
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
        confirmedBlocksCount: number;
        errorMessage?: string;
        eventBlocksToConfirm: number;
        status: TransferStateStatus;
    };
}

export type EvmSwapTransferStoreData = EvmTransferStoreData & {
    creditProcessorAddress?: Address;
}

export type EvmSwapTransferStoreState = {
    creditProcessorState?: CreditProcessorState;
    eventState?: EvmTransferStoreState['eventState'];
    isCheckingTransaction: boolean;
    prepareState?: {
        errorMessage?: string;
        isBroadcasting?: boolean;
        isOutdated?: boolean;
        status: PrepareStateStatus;
    };
    transferState?: EvmTransferStoreState['transferState'];
    swapState?: {
        deployer?: Address;
        errorMessage?: string;
        isCanceling?: boolean;
        isProcessing?: boolean;
        isStuck?: boolean;
        isWithdrawing?: boolean;
        owner?: Address;
        status: SwapStateStatus;
        tokenBalance?: string;
        tokenWallet?: Address;
        everBalance?: string;
        weverBalance?: string;
        weverWallet?: Address;
    };
}

export type EvmHiddenSwapTransferStoreData = EvmSwapTransferStoreData & {
    contractAddress?: Address;
    creditFactoryFee?: string;
    encodedEvent?: string;
    everscaleAddress?: string;
    maxTransferFee?: string;
    minTransferFee?: string;
    pairAddress?: Address;
    pairState?: FullContractState;
    pipelineCredit?: Pipeline;
    pipelineDefault?: Pipeline;
    swapAmount?: string;
    tokenAmount?: string;
    withdrawalId?: string;
}

export type EvmHiddenSwapTransferStoreState = EvmSwapTransferStoreState & {
    secondEventState?: EverscaleTransferStoreState['eventState'];
    secondPrepareState?: EverscaleTransferStoreState['prepareState'];
    releaseState?: EverscaleTransferStoreState['releaseState'];
}

export type EverscaleTransferQueryParams = {
    contractAddress: string;
    depositType?: string;
    fromId: string;
    fromType: NetworkType;
    toId: string;
    toType: NetworkType;
}

export type EverscaleTransferStoreData = {
    amount: string;
    chainId?: string;
    encodedEvent?: string;
    leftAddress?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    token?: BridgeAsset;
    withdrawalId?: string;
    pendingWithdrawalId?: string;
    pendingWithdrawalStatus?: PendingWithdrawalStatus;
    pendingWithdrawalBounty?: string;
}

export type EverscaleTransferStoreState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        roundNumber?: number;
        status: EventStateStatus;
    };
    isCheckingContract: boolean;
    isPendingWithdrawalSynced?: boolean;
    prepareState?: {
        errorMessage?: string;
        status: PrepareStateStatus;
    };
    releaseState?: {
        errorMessage?: string;
        isInsufficientVaultBalance?: boolean;
        isPendingClosing?: boolean;
        isPendingWithdrawal?: boolean;
        isReleased?: boolean;
        isSettingWithdrawBounty?: boolean;
        status: ReleaseStateStatus;
        ttl?: number;
    };
}

export type TransferSummaryData = {
    amount?: string;
    bridgeFee?: string;
    depositType?: string;
    depositFee?: string;
    everscaleAddress?: string;
    hiddenBridgePipeline?: Pipeline;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    maxTransferFee?: string;
    minTransferFee?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    swapAmount?: string;
    token?: (EverscaleToken | EvmToken);
    tokenAmount?: string;
    withdrawFee?: string;
    pendingWithdrawals?: PendingWithdrawal[];
}

export type TransferSummaryState = {
    isTransferPage?: boolean;
    isTransferReleased?: boolean;
}

export enum CreditProcessorState {
    Created,
    EventNotDeployed,
    EventDeployInProgress,
    EventConfirmed,
    EventRejected,
    CheckingAmount,
    CalculateSwap,
    SwapInProgress,
    SwapFailed,
    SwapUnknown,
    UnwrapInProgress,
    UnwrapFailed,
    ProcessRequiresGas,
    Processed,
    Cancelled,
}

export enum BurnCallbackOrdering {
    AMOUNT_EXEC_ASCENDING = 'amountexecascending',
    AMOUNT_EXEC_DESCENDING = 'amountexecdescending',
    CREATED_AT_ASCENDING = 'createdatascending',
    CREATED_AT_DESCENDING = 'createdatdescending',
}

export type SearchBurnCallbackInfoRequest = {
    amountGe?: string;
    amountLe?: string;
    callId?: number;
    chainId?: number;
    createdAtGe?: number;
    createdAtLe?: number;
    creditProcessorAddress?: string;
    ethUserAddress?: string;
    limit: number;
    offset: number;
    ordering?: BurnCallbackOrdering;
    proxyAddress?: string;
    tonEventUserAddress?: string;
}

export type BurnCallbackInfoResponse = {
    amount: string;
    burnCallbackTimestampLt: number;
    callId: number;
    chainId: number;
    createdAt: number;
    creditProcessorAddress?: string;
    ethUserAddress: string;
    proxyAddress: string;
    tonEventContractAddress?: string;
    tonTransactionHash?: string;
    userAddress?: string;
}

export type BurnCallbackTableResponse = {
    totalCount: number;
    transfers: BurnCallbackInfoResponse[];
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
