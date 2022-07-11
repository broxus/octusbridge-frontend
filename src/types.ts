import { Address } from 'everscale-inpage-provider'

export type WalletNativeCoin = {
    balance?: string;
    decimals: number;
    icon?: string;
    name?: string;
    symbol: string;
}

export type TokenCache = {
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

export interface Token<Addr = unknown> {
    address: Addr;
    decimals: number;
    logoURI?: string;
    name?: string;
    symbol: string;
}

export interface TokenRaw<Addr = unknown> extends Token<Addr> {
    chainId?: string;
    vendor?: string;
    verified?: boolean;
    version?: number;
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

export type TokensListManifest = {
    name: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    keywords: string[];
    timestamp: string;
    tokens: TokenRaw<string>[];
}
