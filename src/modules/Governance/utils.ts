import BigNumber from 'bignumber.js'

import {
    Description, ProposalsRequest, ProposalsResponse, UserProposalsResponse,
    VotesRequest, VotesResponse,
} from '@/modules/Governance/types'
import { DaoIndexerApiBaseUrl } from '@/config'
import { handleApi, isGoodBignumber } from '@/utils'

export async function handleProposals(data: ProposalsRequest): Promise<ProposalsResponse> {
    const url = `${DaoIndexerApiBaseUrl}/proposals/search`
    const result = await handleApi<ProposalsResponse>({ url, data })
    return result
}

export async function handleUserProposals(
    voter: string,
    data: ProposalsRequest,
): Promise<UserProposalsResponse> {
    const url = `${DaoIndexerApiBaseUrl}/voters/${voter}/search`
    const result = await handleApi<UserProposalsResponse>({ url, data })
    return result
}

export async function handleVotes(data: VotesRequest): Promise<VotesResponse> {
    const url = `${DaoIndexerApiBaseUrl}/votes/search`
    const result = await handleApi<VotesResponse>({ url, data })
    return result
}

export function parseDescription(description: string): Description | undefined {
    try {
        const json = JSON.parse(description)

        return {
            title: json[0],
            link: json[1],
            description: json[2],
        }
    }
    catch (e) {
        return undefined
    }
}

export function getVotesPercents(forVotes: string, againstVotes: string): [number, number] {
    const allVotesBN = new BigNumber(againstVotes).plus(forVotes)
    const left = isGoodBignumber(allVotesBN)
        ? new BigNumber(forVotes).times(100).dividedBy(allVotesBN).integerValue()
            .toNumber()
        : 0
    const right = isGoodBignumber(allVotesBN)
        ? new BigNumber(againstVotes).times(100).dividedBy(allVotesBN).integerValue()
            .toNumber()
        : 0

    return [left, right]
}
