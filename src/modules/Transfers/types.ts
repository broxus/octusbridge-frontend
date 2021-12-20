export type TransferKind =
    | 'TonToEth'
    | 'EthToTon'
    | 'EthToEth'
    | 'CreditEthToTon'

export type TransferStatus =
    | 'Pending'
    | 'Rejected'
    | 'Confirmed'

export type TransfersRequestStatus = Lowercase<TransferStatus>

export type TransfersOrdering =
    | 'updateatascending'
    | 'updateatdescending'
    | 'createdatascending'
    | 'createdatdescending'

export type TransferOld = {
    confirmVotes?: number;
    createdAt?: number;
    currencyAddress?: string;
    rejectVotes?: number;
    requiredVotes?: number;
    status?: TransferStatus;
    volumeExec?: string;
    transferKind?: TransferKind;
    chainId?: number;
    contractAddress?: string;
    ethTransactionHash?: string;
    tonTransactionHash?: string;
}

export type Transfer = {
    ethTonChainId?: number;
    ethTonContractAddress?: string;
    ethTonEthTokenAddress?: string;
    ethTonEthUserAddress?: string;
    ethTonProxyAddress?: string;
    ethTonRequiredVotes?: number;
    ethTonStatus?: TransferStatus;
    ethTonTonTokenAddress?: string;
    ethTonTransactionHashEth?: string;
    ethTonVolumeExec: string;

    tonEthChainId?: number;
    tonEthContractAddress?: string;
    tonEthEthTokenAddress?: string;
    tonEthEthUserAddress?: string;
    tonEthProxyAddress?: string;
    tonEthRequiredVotes?: number;
    tonEthStatus?: TransferStatus;
    tonEthTonTokenAddress?: string;
    tonEthVolumeExec: string;

    createdAt: number;
    creditProcessorAddress?: string;
    tonUserAddress: string;
    transferKind: TransferKind;
    transferStatus: TransferStatus;
    updatedAt: number;
}

export type TransfersParams = {
    limit?: number;
    offset?: number;
    ordering?: TransfersOrdering;
    userAddress: string;
}

export type TransfersFilters = {
    createdAtGe?: number;
    createdAtLe?: number;
    status?: TransfersRequestStatus;
    volumeExecGe?: string;
    volumeExecLe?: string;
    chainId?: number;
    tonTokenAddress?: string;
}

export type TransfersRequest = TransfersParams & TransfersFilters

export type TransfersResponse = {
    totalCount: number;
    transfers: Transfer[];
}

export type TransfersStoreData = {
    apiResponse?: TransfersResponse;
}

export type TransfersStoreState = {
    loading?: boolean;
    page: number;
    limit: number;
}
