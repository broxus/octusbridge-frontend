export type TransferKind = 'TonToEth' | 'EthToTon'

export type TransfersApiStatus =
    | 'Pending'
    | 'Rejected'
    | 'Confirmed'

export type TransfersApiRequestStatus = Lowercase<TransfersApiStatus>

export type TransfersApiOrdering =
    | 'volumeexecascending'
    | 'volumeexecdescending'
    | 'updateatascending'
    | 'updateatdescending'
    | 'createdatascending'
    | 'createdatdescending';

export type TransfersApiTransfer = {
    confirmVotes?: number;
    createdAt?: number;
    currencyAddress?: string;
    rejectVotes?: number;
    requiredVotes?: number;
    status?: TransfersApiStatus;
    volumeExec?: string;
    transferKind?: TransferKind;
    chainId?: number;
    contractAddress?: string;
    ethTransactionHash?: string;
    tonTransactionHash?: string;
}

export type TransfersApiParams = {
    limit?: number;
    offset?: number;
    ordering?: TransfersApiOrdering;
    userAddress: string;
}

export type TransfersApiFilters = {
    createdAtGe?: number;
    createdAtLe?: number;
    status?: TransfersApiRequestStatus;
    volumeExecGe?: string;
    volumeExecLe?: string;
    chainId?: number;
    tonTokenAddress?: string;
}

export type TransfersApiRequest = TransfersApiParams & TransfersApiFilters

export type TransfersApiResponse = {
    totalCount: number;
    transfers: TransfersApiTransfer[];
}

export type TransfersStoreData = {
    apiResponse?: TransfersApiResponse;
}

export type TransfersStoreState = {
    loading?: boolean;
    page: number;
    limit: number;
}
