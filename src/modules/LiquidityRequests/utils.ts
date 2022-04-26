import { handleApi } from '@/utils'
import { IndexerApiBaseUrl } from '@/config'
import { SearchNotInstantRequest, SearchNotInstantResponse } from '@/modules/LiquidityRequests/types'

export async function handleLiquidityRequests(params: SearchNotInstantRequest): Promise<SearchNotInstantResponse> {
    return handleApi({
        url: `${IndexerApiBaseUrl}/transfers/search_not_instant`,
        data: params,
    })
}
