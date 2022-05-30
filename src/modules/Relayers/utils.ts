import BigNumber from 'bignumber.js'

import { ETH_ADDRESS_REGEXP, TON_PUBLIC_KEY_REGEXP } from '@/modules/Relayers/constants'
import { IndexerApiBaseUrl, networks } from '@/config'
import { handleApi } from '@/utils'
import {
    AllRelayRoundsInfoRequest, AllRelayRoundsInfoResponse, GlobalRelayersEventsParams,
    RelayersEventsParams, RelayersEventsResponse, RelayersEventsTransferKind,
    RelayersSearchParams, RelayersSearchResponse, RelayInfoParams,
    RelayInfoResponse, RelayRoundInfoParams, RelayRoundInfoResponse,
    RelayRoundsInfoRequest, RelayRoundsInfoResponse, RelaysRoundInfoRequest,
    RelaysRoundInfoResponse, RoundInfoParams, RoundInfoResponse,
    RoundsCalendarParams, RoundsCalendarResponse, RoundStatus,
} from '@/modules/Relayers/types'
import { NetworkShape } from '@/types'
import { RatioStatus } from '@/components/common/Ratio'

function normalizeKey(pattern: RegExp, value: string): string {
    const result = value.toLowerCase()
    const match = value.match(pattern)

    if (!match) {
        return result
    }

    return match[1] ? result : `0x${result}`
}

export function normalizeTonPubKey(value: string): string {
    return normalizeKey(TON_PUBLIC_KEY_REGEXP, value)
}

export function normalizeEthAddress(value: string): string {
    return normalizeKey(ETH_ADDRESS_REGEXP, value)
}

export function handleRelayers(params: RelayersSearchParams): Promise<RelayersSearchResponse> {
    return handleApi<RelayersSearchResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/search/relays`,
        data: params,
    })
}

export function handleRoundInfo(params: RoundInfoParams): Promise<RoundInfoResponse> {
    return handleApi<RoundInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/round_info`,
        data: params,
    })
}

export function handleRelayRoundInfo(params: RelayRoundInfoParams): Promise<RelayRoundInfoResponse> {
    return handleApi<RelayRoundInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/relay_round_info`,
        data: params,
    })
}

export function handleRoundsCalendar(params: RoundsCalendarParams): Promise<RoundsCalendarResponse> {
    return handleApi<RoundsCalendarResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/rounds_calendar`,
        data: params,
    })
}

export function handleRelayInfo(params: RelayInfoParams): Promise<RelayInfoResponse> {
    return handleApi<RelayInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/relay_info`,
        data: params,
    })
}

export function handleRelayersEvents(params: RelayersEventsParams): Promise<RelayersEventsResponse> {
    return handleApi<RelayersEventsResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/search/relays_events`,
        data: params,
    })
}

export function handleGlobalRelayersEvents(params: GlobalRelayersEventsParams): Promise<RelayersEventsResponse> {
    return handleApi<RelayersEventsResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/search/global_relays_events`,
        data: params,
    })
}

export function handleRelayRoundsInfo(params: RelayRoundsInfoRequest): Promise<RelayRoundsInfoResponse> {
    return handleApi<RelayRoundsInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/relay_rounds_info`,
        data: params,
    })
}

export function handleRelaysRoundInfo(params: RelaysRoundInfoRequest): Promise<RelaysRoundInfoResponse> {
    return handleApi<RelaysRoundInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/relays_round_info`,
        data: params,
    })
}

export function handleAllRelayRoundsInfo(params: AllRelayRoundsInfoRequest): Promise<AllRelayRoundsInfoResponse> {
    return handleApi<AllRelayRoundsInfoResponse>({
        url: `${IndexerApiBaseUrl}/relays_pages/all_relay_rounds_info`,
        data: params,
    })
}

export function getRoundStatus(startTime: number, endTime: number): RoundStatus {
    const date = Date.now()

    if (startTime <= date && endTime > date) {
        return 'active'
    }

    if (endTime <= date) {
        return 'finished'
    }

    return 'waiting'
}

const evmNetworks = networks
    .filter(item => item.type === 'evm')
    .reduce<{[k: string]: NetworkShape | undefined}>((acc, item) => ({
        ...acc,
        [item.chainId]: item,
    }), {})

const tonNetworks = networks
    .filter(item => item.type === 'everscale')
    .reduce<{[k: string]: NetworkShape | undefined}>((acc, item) => ({
        ...acc,
        [item.chainId]: item,
    }), {})

function getEvmName(chainId: number): string | undefined {
    return evmNetworks[chainId]?.currencySymbol
}

export function getEventFromName(transferKind: RelayersEventsTransferKind, chainId: number): string | undefined {
    if (transferKind === 'tontoeth') {
        return tonNetworks[1]?.currencySymbol
    }
    if (transferKind === 'ethtoton' || transferKind === 'creditethtoton') {
        return getEvmName(chainId)
    }
    return undefined
}

export function getEventToName(transferKind: RelayersEventsTransferKind, chainId: number): string | undefined {
    if (transferKind === 'ethtoton' || transferKind === 'creditethtoton') {
        return tonNetworks[1]?.currencySymbol
    }
    if (transferKind === 'tontoeth') {
        return getEvmName(chainId)
    }
    return undefined
}

export enum RelayStatus {
    Success = 'success',
    Warning = 'warning',
    Fail = 'fail',
}

export function getEventsShare(value?: number, total?: number): string {
    if (value && total) {
        return new BigNumber(value)
            .times(100)
            .dividedBy(total)
            .dp(2)
            .toFixed()
    }

    return '0'
}

export function getRelayStatus(eventsShare: string): RelayStatus {
    if (new BigNumber(eventsShare).gte(70)) {
        return RelayStatus.Success
    }

    if (new BigNumber(eventsShare).gte(50)) {
        return RelayStatus.Warning
    }

    return RelayStatus.Fail
}

export function mapRelayStatusToRatio(val: RelayStatus): RatioStatus {
    switch (val) {
        case RelayStatus.Success:
            return RatioStatus.Success
        case RelayStatus.Warning:
            return RatioStatus.Warning
        default:
            return RatioStatus.Fail
    }
}

export function getEvmNetworkColor(chainId: number): string {
    switch (chainId) {
        case 1:
            return '#AD90E9'
        case 56:
            return '#3A458C'
        case 250:
            return '#C5E4F3'
        case 137:
            return '#69B99C'
        case 43114:
            return '#EFA2C5'
        default:
            return '#FCF1F1'
    }
}

export function getEvmNetworkName(chainId: number): string | null {
    return networks.find(item => (
        item.chainId === chainId.toString() && item.type === 'evm'
    ))?.name ?? null
}
