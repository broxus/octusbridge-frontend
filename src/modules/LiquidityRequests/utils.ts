import { type SearchNotInstantRequest, type SearchNotInstantResponse } from '@/modules/LiquidityRequests/types'
import { handleApi } from '@/utils'

export async function handleLiquidityRequests(params: SearchNotInstantRequest): Promise<SearchNotInstantResponse> {
    return handleApi({
        data: params,
        url: 'https://api-test.octusbridge.io/v1/transfers/search_not_instant',
    })
}
