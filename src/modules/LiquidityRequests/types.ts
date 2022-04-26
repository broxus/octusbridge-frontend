export type SearchNotInstantOrdering =
    | 'volumeexecascending'
    | 'volumeexecdescending'
    | 'bountyascending'
    | 'bountydescending'
    | 'createdatascending'
    | 'createdatdescending'

export type SearchNotInstantStatus =
    | 'Open'
    | 'Close'

export type SearchNotInstant = {
    bounty: string;
    chainId: number;
    contractAddress: string;
    currentAmount: string;
    ethTokenAddress: string;
    ethUserAddress: string;
    payloadId: string;
    status: SearchNotInstantStatus;
    timestamp: number;
    tonTokenAddress: string;
    tonUserAddress: string;
    userId: string;
    volumeExec: string;
    volumeUsdtExec: string;
}

export type SearchNotInstantFilters = {
    bountyGe?: string;
    bountyLe?: string;
    chainId?: number;
    createdAtGe?: number;
    createdAtLe?: number;
    ethTokenAddress?: string;
    status?: SearchNotInstantStatus;
    tonTokenAddress?: string;
    userAddress?: string;
    volumeExecGe?: string;
    volumeExecLe?: string;
    contractAddress?: string;
}

export type SearchNotInstantParams = {
    limit: number;
    offset: number;
    ordering: SearchNotInstantOrdering;
}

export type SearchNotInstantRequest =
    & SearchNotInstantFilters
    & SearchNotInstantParams

export type SearchNotInstantResponse = {
    totalCount: number;
    transfers: SearchNotInstant[];
}
