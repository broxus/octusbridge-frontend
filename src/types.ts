export type NetworkType = 'evm' | 'everscale' & string

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
    type: NetworkType;
}

export type LabeledNetwork = {
    label: string;
    value: string;
}
