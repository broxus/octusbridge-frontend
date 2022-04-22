import { Address } from 'everscale-inpage-provider'

export type WalletNativeCoin = {
    balance?: string;
    decimals: number;
    icon?: string;
    name?: string;
    symbol: string;
}

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

export type NetworkType = 'evm' | 'everscale' | 'solana' & string

export type NetworkShape = {
    badge?: string;
    chainId: string;
    currencySymbol: string;
    disabled?: boolean;
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
