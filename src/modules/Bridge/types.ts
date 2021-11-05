import BigNumber from 'bignumber.js'
import { Address, DecodedAbiFunctionInputs } from 'ton-inpage-provider'
import { LogItem } from 'abi-decoder'

import { TokenAbi } from '@/misc'
import { TokenCache } from '@/stores/TokensCacheService'
import { CreditProcessorState, NetworkShape } from '@/types'


export type ApprovalStrategies = 'infinity' | 'fixed'

export enum CrosschainBridgeStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainBridgeStoreData = {
    amount: string;
    approvalDelta?: BigNumber;
    balance?: string;
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
        isBroadcasting?: boolean;
        isOutdated?: boolean;
        status: PrepareStateStatus;
    };
    transferState?: {
        confirmedBlocksCount: number;
        errorMessage?: string;
        eventBlocksToConfirm: number;
        status: TransferStateStatus;
    },
}

export type EvmSwapTransferStoreState = {
    creditProcessorState?: CreditProcessorState;
    swapState?: {
        errorMessage?: string;
        isCanceling?: boolean;
        isStuck?: boolean;
        isWithdrawing?: boolean;
        owner?: Address;
        status: SwapStateStatus;
        tokenBalance?: string;
        tokenWallet?: Address;
        tonBalance?: string;
        wtonBalance?: string;
        wtonWallet?: Address;
    }
} & EvmTransferStoreState

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
        status: EventStateStatus;
        confirmations: number;
        requiredConfirmations: number;
    };
    prepareState?: PrepareStateStatus;
    releaseState?: ReleaseStateStatus;
}

export type TransferSummaryData = {
    amount?: string;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    token?: TokenCache;
}


