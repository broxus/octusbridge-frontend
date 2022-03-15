import {
    CastedVotes,
    PendingReward, RelayConfig, StackingDetails, UserDetails,
} from '@/misc'
import { CommonGraphShape } from '@/modules/Chart/types'

export enum ActionType {
    Stake,
    Redeem,
}

export type AccountDataStoreState = {
    isLoading?: boolean;
    hasAccount?: boolean;
}

export type AccountDataStoreData = {
    stakingDetails?: StackingDetails;
    userDetails?: UserDetails;
    pendingReward?: PendingReward;
    relayConfig?: RelayConfig;
    currency?: CurrencyResponse;
    castedVotes?: CastedVotes;
}

export type RedeemFormStoreState = {
    isLoading: boolean;
}

export type RedeemFormStoreData = {
    amount: string;
}

export type StakingFormStoreState = {
    isLoading: boolean;
}

export type StakingFormStoreData = {
    amount: string;
}

export type StakingMainApiResponse = {
    averageApr?: string;
    reward30d?: string;
    reward30dChange?: string;
    stakeholders?: number;
    tvl?: string;
    tvlChange?: string;
}

export type StakingUserApiRequest = {
    userAddress: string;
}

export type StakingUserApiResponse = {
    averageApr?: string;
    user30dReward?: string;
    user30dRewardChange?: string;
    userFrozenStake?: string;
    userTvl?: string;
    userTvlChange?: string;
}

export type TransactionOrdering =
    | 'amountascending'
    | 'amountdescending'
    | 'timestampblockascending'
    | 'timestampblockatdescending'

export type TransactionKindApiResponse =
    | 'Deposit'
    | 'Withdraw'
    | 'Claim'
    | 'Freeze'

export type TransactionKindApiRequest = Lowercase<TransactionKindApiResponse>

export type TransactionsApiRequest = {
    limit: number;
    offset: number
    userAddress?: string;
    amountGe?: string;
    amountLe?: string;
    ordering?: TransactionOrdering;
    timestampBlockGe?: number;
    timestampBlockLe?: number;
    transactionKind?: TransactionKindApiRequest;
}

export type Transaction = {
    amountExec?: string;
    timestampBlock?: number;
    transactionHash?: string;
    transactionKind?: TransactionKindApiResponse;
}

export type TransactionsApiResponse = {
    totalCount: number;
    transactions: Transaction[];
}

export type StakeholderKindApiResponse = 'Ordinary' | 'Relay'
export type StakeholderKindApiRequest = Lowercase<StakeholderKindApiResponse>

export type StakeholderApiOrdering =
    | 'updateatascending'
    | 'updateatdescending'
    | 'stakeascending'
    | 'stakedescending'
    | 'frozenstakeascending'
    | 'frozenstakedescending'
    | 'lastrewardascending'
    | 'lastrewarddescending'
    | 'totalrewardascending'
    | 'totalrewarddescending'
    | 'createdatascending'
    | 'createdatdescending'

export type StakeholdersApiParams = {
    limit: number;
    offset: number;
    ordering: StakeholderApiOrdering;
}

export type StakeholdersApiFilters = {
    createdAtGe?: number;
    createdAtLe?: number;
    frozenStakeGe?: string;
    frozenStakeLe?: string;
    lastRewardGe?: string;
    lastRewardLe?: string;
    stakeholderKind?: StakeholderKindApiRequest;
    totalRewardGe?: string;
    totalRewardLe?: string;
    untilFrozenGe?: string;
    untilFrozenLe?: string;
    userBalanceGe?: string;
    userBalanceLe?: string;
}

export type StakeholdersApiRequest = StakeholdersApiParams & StakeholdersApiFilters

export type Stakeholder = {
    createdAt?: number;
    frozenStakeBalance?: string;
    lastReward?: string;
    stakeBalance?: string;
    totalReward?: string;
    userAddress?: string;
    userType?: StakeholderKindApiResponse;
}

export type StakeholdersApiResponse = {
    stakeholders: Stakeholder[],
    totalCount: number;
}

export type ExplorerChartType = 'TVL' | 'APR'

export type GraphRequest = {
    from: number;
    timeframe: string;
    to: number;
}

export type GraphResponse = {
    data: string;
    timestamp: number;
}[]

export type CurrencyResponse = {
    address: string;
    currency: string;
    fee24h: string;
    price: string;
    priceChange: string;
    transactionsCount24h: number;
    tvl: string;
    tvlChange: string;
    volume24h: string;
    volume7d: string;
    volumeChange24h: string;
    volumeChange7d: string;
}

export type ChartStoreData = {
    chart?: CommonGraphShape[];
}

export type ChartStoreState = {
    isLoading?: boolean;
}

export type UserStakingStoreData = {
    userInfo?: StakingUserApiResponse;
}

export type ClaimFormState = {
    isLoading?: boolean;
}

export type TransactionsStoreData = {
    transactions?: TransactionsApiResponse;
}

export type TransactionsStoreState = {
    isLoading?: boolean;
}

export type StakeholdersStoreData = {
    stakeholders?: StakeholdersApiResponse;
}

export type StakeholdersStoreState = {
    isLoading?: boolean;
}

export type MainInfoData = {
    mainInfo?: StakingMainApiResponse;
}

export type MainInfoState = {
    isLoading?: boolean;
}
