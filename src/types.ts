import { Address } from 'everscale-inpage-provider'

export type Token = {
    balance?: string;
    chainId?: string;
    decimals: number;
    icon?: string;
    name?: string;
    root: string;
    rootOwnerAddress?: Address;
    symbol: string;
    totalSupply?: string;
    updatedAt?: number;
    vendor?: string | null;
    verified?: boolean;
    wallet?: string;
}

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
