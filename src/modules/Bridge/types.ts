import { Address, DecodedAbiFunctionInputs } from 'ton-inpage-provider'
import { LogItem } from 'abi-decoder'

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
    creditFactoryFee?: string;
    depositType: 'default' | 'credit';
    leftAddress: string;
    leftNetwork?: NetworkShape;
    minAmount?: string;
    maxTokensAmount?: string;
    maxTonsAmount?: string;
    minTonsAmount?: string;
    minReceiveTokens?: string;
    pairAddress?: Address;
    rightAddress: string;
    rightNetwork?: NetworkShape;
    selectedToken?: string;
    swapType: '0' | '1';
    tokensAmount?: string;
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
    creditProcessorAddress?: Address;
    deriveEventAddress?: Address;
    ethConfigAddress?: Address;
    eventVoteData?: EventVoteData;
    leftAddress?: string;
    log?: LogItem;
    rightAddress?: string;
    token: TokenCache | undefined;
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
    token: TokenCache | undefined;
    withdrawalId?: string;
}

export type TonTransferStoreState = {
    isContractDeployed: boolean;
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
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
    decimals?: number;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    token?: TokenCache;
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
