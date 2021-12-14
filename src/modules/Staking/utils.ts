import { Contract } from 'ton-inpage-provider'

import { BridgeConstants, StackingAbi, StackingContract } from '@/misc'
import {
    GraphRequest, GraphResponse, StakeholderKindApiResponse, StakeholdersApiRequest,
    StakeholdersApiResponse, StakingMainApiResponse, StakingUserApiRequest,
    StakingUserApiResponse, TransactionKindApiResponse, TransactionsApiRequest,
    TransactionsApiResponse,
} from '@/modules/Staking/types'
import { IndexerApiBaseUrl } from '@/config'

export function getStackingContract(): StackingContract {
    return new Contract(StackingAbi.Root, BridgeConstants.StakingAccountAddress)
}

async function handleApi<R>(params: {
    url: string;
    data?: object;
    method?: 'POST' | 'GET';
}): Promise<R> {
    const response = await fetch(params.url, {
        method: params.method || 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: params.data ? JSON.stringify(params.data) : undefined,
    })

    if (!response.ok) {
        throw response
    }

    const result: R = await response.json()

    return result
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
