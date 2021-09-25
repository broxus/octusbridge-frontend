import BigNumber from 'bignumber.js'

export type NetworkShape = {
    label: string;
    chainId: string;
    type: string;
}

export type ApprovalStrategies = 'infinity' | 'fixed'

export type CrosschainTransferStoreData = {
    amount: string;
    approvalDelta: BigNumber;
    approvalStrategy: ApprovalStrategies;
    leftAddress: string;
    leftNetwork?: NetworkShape;
    rightAddress: string;
    rightNetwork?: NetworkShape;
    selectedToken?: string;
    txHash?: string;
}

export type AddressesFields = Pick<CrosschainTransferStoreData, 'leftAddress' | 'rightAddress'>

export type NetworkFields = Pick<CrosschainTransferStoreData, 'leftNetwork' | 'rightNetwork'>

export enum CrosschainTransferStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainTransferStoreState = {
    isAwaitConfirmation: boolean;
    step: CrosschainTransferStep;
}
