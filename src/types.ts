export type NetworkShape = {
    chainId: string;
    currencySymbol: string;
    explorerBaseUrl: string;
    id: string;
    label: string;
    name: string;
    rpcUrl: string;
    tokenType?: string;
    transactionType?: string;
    type: string;
}

export type LabeledNetwork = {
    label: string;
    value: string;
}
