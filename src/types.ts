export type NetworkShape = {
    chainId: string;
    currencySymbol: string;
    explorerBaseUrl: string;
    id: string;
    label: string;
    name: string;
    rpcUrl: string;
    type: string;
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
