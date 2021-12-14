import { Address, DecodedAbiFunctionInputs, FullContractState } from 'ton-inpage-provider'

import { TokenAbi } from '@/misc'
import { TokenCache } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/types'


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
    leftAddress: string;
    leftNetwork?: NetworkShape;
    minAmount?: string;
    maxTokenAmount?: string;
    maxTonsAmount?: string;
    maxTransferFee?: string;
    minReceiveTokens?: string;
    minTonsAmount?: string;
    minTransferFee?: string;
    pairAddress?: Address;
    pairState?: FullContractState;
    rightAddress: string;
    rightNetwork?: NetworkShape;
    selectedToken?: string;
    swapType: '0' | '1';
    tokenAmount?: string;
    tonsAmount?: string;
    txHash?: string;
}

export type CrosschainBridgeStoreState = {
    approvalStrategy: ApprovalStrategies;
    isPendingAllowance: boolean;
    isPendingApproval: boolean;
    isProcessing: boolean;
    isSwapEnabled: boolean;
    step: CrosschainBridgeStep;
}

export type AddressesFields = Pick<CrosschainBridgeStoreData, 'leftAddress' | 'rightAddress'>

export type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']

export type NetworkFields = Pick<CrosschainBridgeStoreData, 'leftNetwork' | 'rightNetwork'>

export type EventStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type PrepareStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type ReleaseStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type SwapStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type EvmTransferQueryParams = {
    depositType?: string;
    fromId: string;
    fromType: string;
    toId: string;
    toType: string;
    txHash: string;
}

export type EvmTransferStoreData = {
    amount: string;
    deriveEventAddress?: Address;
    ethConfigAddress?: Address;
    eventVoteData?: EventVoteData;
    leftAddress?: string;
    rightAddress?: string;
    token?: TokenCache;
}

export type EvmTransferStoreState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
    prepareState?: {
        errorMessage?: string;
        isDeployed?: boolean;
        isDeploying?: boolean;
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
        tonBalance?: string;
        wtonBalance?: string;
        wtonWallet?: Address;
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
    swapAmount?: string;
    tokenAmount?: string;
    withdrawalId?: string;
}

export type EvmHiddenSwapTransferStoreState = EvmSwapTransferStoreState & {
    secondEventState?: TonTransferStoreState['eventState'];
    secondPrepareState?: TonTransferStoreState['prepareState'];
    releaseState?: TonTransferStoreState['releaseState'];
}

export type TonTransferQueryParams = {
    contractAddress: string;
    fromId: string;
    fromType: string;
    toId: string;
    toType: string;
}

export type TonTransferStoreData = {
    amount: string;
    chainId?: string;
    encodedEvent?: string;
    leftAddress?: string;
    rightAddress?: string;
    token?: TokenCache;
    withdrawalId?: string;
}

export type TonTransferStoreState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
    isContractDeployed: boolean;
    prepareState?: {
        errorMessage?: string;
        status: PrepareStateStatus;
    };
    releaseState?: {
        errorMessage?: string;
        isReleased?: boolean;
        status: ReleaseStateStatus;
    };
}

export type TransferSummaryData = {
    amount?: string;
    bridgeFee?: string;
    depositType?: string;
    everscaleAddress?: string;
    minTransferFee?: string;
    maxTransferFee?: string;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    swapAmount?: string;
    token?: TokenCache;
    tokenAmount?: string;
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
