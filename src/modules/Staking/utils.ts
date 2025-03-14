import { type ProviderRpcClient } from 'everscale-inpage-provider'

import { DexIndexerApiBaseUrl, IndexerApiBaseUrl, StakingAccountAddress } from '@/config'
import { StackingAbi, type StackingContract } from '@/misc'
import {
    type CurrencyResponse, type GraphRequest, type GraphResponse, type StakeholderKindApiResponse,
    type StakeholdersApiRequest, type StakeholdersApiResponse, type StakingMainApiResponse,
    type StakingUserApiRequest, type StakingUserApiResponse, type TransactionKindApiResponse,
    type TransactionsApiRequest, type TransactionsApiResponse,
} from '@/modules/Staking/types'
import { handleApi } from '@/utils'

export function getStakingContract(rpc: ProviderRpcClient): StackingContract {
    return rpc.createContract(StackingAbi.Root, StakingAccountAddress)
}

export async function handleMainInfoApi(): Promise<StakingMainApiResponse> {
    const url = `${IndexerApiBaseUrl}/staking/main`
    const result = await handleApi<StakingMainApiResponse>({ url, method: 'GET' })
    return result
}

export async function handleUserApi(data: StakingUserApiRequest): Promise<StakingUserApiResponse> {
    const url = `${IndexerApiBaseUrl}/staking`
    const result = await handleApi<StakingUserApiResponse>({ url, data })
    return result
}

export async function handleTransactionsApi(data: TransactionsApiRequest): Promise<TransactionsApiResponse> {
    const url = `${IndexerApiBaseUrl}/staking/search/transactions`
    const result = await handleApi<TransactionsApiResponse>({ url, data })
    return result
}

export async function handleStakeholdersApi(data: StakeholdersApiRequest): Promise<StakeholdersApiResponse> {
    const url = `${IndexerApiBaseUrl}/staking/search/stakeholders`
    const result = await handleApi<StakeholdersApiResponse>({ url, data })
    return result
}

export async function handleTvlApi(data: GraphRequest): Promise<GraphResponse> {
    const url = `${IndexerApiBaseUrl}/staking/search/graph/tvl`
    const result = await handleApi<GraphResponse>({ url, data })
    return result
}

export async function handleAprApi(data: GraphRequest): Promise<GraphResponse> {
    const url = `${IndexerApiBaseUrl}/staking/search/graph/apr`
    const result = await handleApi<GraphResponse>({ url, data })
    return result
}

export async function handleCurrency(address: string): Promise<CurrencyResponse> {
    const url = `${DexIndexerApiBaseUrl}/currencies/${address}`
    const result = await handleApi<CurrencyResponse>({ url })
    return result
}

export function mapStakeholderKindToIntlId(kind?: StakeholderKindApiResponse): string {
    switch (kind) {
        case 'Ordinary':
            return 'STAKEHOLDERS_TYPE_ORDINARY'
        case 'Relay':
            return 'STAKEHOLDERS_TYPE_RELAY'
        default:
            return 'NO_VALUE'
    }
}

export function mapTransactionKindToIntlId(kind?: TransactionKindApiResponse): string {
    switch (kind) {
        case 'Claim':
            return 'STAKING_TRANSACTIONS_CLAIM'
        case 'Deposit':
            return 'STAKING_TRANSACTIONS_DEPOSIT'
        case 'Freeze':
            return 'STAKING_TRANSACTIONS_FREEZE'
        case 'Withdraw':
            return 'STAKING_TRANSACTIONS_WITHDRAW'
        default:
            return 'NO_VALUE'
    }
}
