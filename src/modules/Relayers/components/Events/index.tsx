import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    DateFilter, FilterField, Filters, NUM_REGEXP,
    RadioFilter, TextFilter, TokenFilter,
} from '@/components/common/Filters'
import { Header, Section, Title } from '@/components/common/Section'
import { TokenBadge } from '@/components/common/TokenBadge'
import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { EventType } from '@/modules/Relayers/components/Events/type'
import { useRelayersEventsContext } from '@/modules/Relayers/providers/RelayersEvents'
import { formattedTokenAmount } from '@/utils'
import {
    useBNParam, useDateParam, useDictParam, useNumParam,
    usePagination, useTableOrder, useTextParam, useUrlParams,
} from '@/hooks'
import { RelayersEventsFilters, RelayersEventsOrdering, RelayersEventsTransferKind } from '@/modules/Relayers/types'
import { useTokensCache } from '@/stores/TokensCacheService'
import { Select } from '@/components/common/Select'
import { FromAddress } from '@/modules/Relayers/components/Events/FromAddress'
import { ToAddress } from '@/modules/Relayers/components/Events/ToAddress'
import { BridgeAsset, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { DateCard } from '@/components/common/DateCard'
import { networks } from '@/config'

import './index.scss'

const evmNetworks = networks.filter(item => item.type === 'evm')

type Props = {
    relay?: string;
    soon?: boolean;
    roundNum?: number;
}

export function EventsInner({
    relay,
    soon,
    roundNum,
}: Props): JSX.Element {
    const intl = useIntl()
    const urlParams = useUrlParams()
    const events = useRelayersEventsContext()
    const tokensCache = useTokensCache()
    const bridgeAssets = useBridgeAssets()
    const pagination = usePagination(events.totalCount)
    const tableOrder = useTableOrder<RelayersEventsOrdering>('timestampdescending')

    const [timestampGe] = useDateParam('date-ge')
    const [timestampLe] = useDateParam('date-le')
    const [amountGe] = useBNParam('amount-ge')
    const [amountLe] = useBNParam('amount-le')
    const [relayAddress] = useTextParam('relay')
    const [chainId] = useNumParam('chain-id')
    const [tokenAddress] = useTextParam('token')
    const [transferKind] = useDictParam('type', ['creditethtoton', 'ethtoton', 'tontoeth'])

    const tokens = React.useMemo(() => (
        evmNetworks
            .filter(item => item.type === 'evm')
            .flatMap(network => bridgeAssets.filterTokensByChain(network.chainId))
            .reduce<BridgeAsset[]>((acc, token) => (
                acc.find(({ root }) => root === token.root) ? acc : [...acc, token]
            ), [])
    ), [bridgeAssets.tokens])

    const changeFilters = (filters: RelayersEventsFilters) => {
        pagination.submit(1)

        urlParams.set({
            'date-ge': filters.timestampGe?.toString(),
            'date-le': filters.timestampLe?.toString(),
            'amount-ge': filters.amountGe?.toString(),
            'amount-le': filters.amountLe?.toString(),
            'chain-id': filters.chainId?.toString(),
            type: filters.transferKind,
            token: filters.tokenAddress,
            relay: filters.relayAddress,
        })
    }

    React.useEffect(() => {
        if (events.isReady) {
            events.fetch({
                roundNum,
                timestampGe,
                timestampLe,
                amountGe,
                amountLe,
                tokenAddress,
                chainId,
                transferKind,
                relayAddress: relay || relayAddress,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
    }, [
        events.isReady,
        roundNum,
        relay,
        timestampGe,
        timestampLe,
        amountGe,
        amountLe,
        relayAddress,
        tokenAddress,
        chainId,
        transferKind,
        pagination.offset,
        pagination.limit,
        tableOrder.order,
    ])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'EVENTS_TITLE',
                    })}
                </Title>

                <Filters
                    filters={{
                        timestampGe,
                        timestampLe,
                        amountGe,
                        amountLe,
                        relayAddress,
                        tokenAddress,
                        chainId,
                        transferKind,
                    }}
                    onChange={changeFilters}
                >
                    {(localFilters, changeLocalFilter) => (
                        <>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'EVENTS_TABLE_FILTER_DATE',
                                })}
                            >
                                <DateFilter
                                    onChange={changeLocalFilter('timestampGe')}
                                    value={localFilters.timestampGe}
                                />
                                <DateFilter
                                    onChange={changeLocalFilter('timestampLe')}
                                    value={localFilters.timestampLe}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'EVENTS_TABLE_FILTER_AMOUNT',
                                })}
                            >
                                <TextFilter
                                    value={localFilters.amountGe}
                                    onChange={changeLocalFilter('amountGe')}
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                />
                                <TextFilter
                                    value={localFilters.amountLe}
                                    onChange={changeLocalFilter('amountLe')}
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                />
                            </FilterField>
                            {!relay && (
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'EVENTS_TABLE_FILTER_RELAY',
                                    })}
                                >
                                    <TextFilter
                                        value={localFilters.relayAddress}
                                        onChange={changeLocalFilter('relayAddress')}
                                    />
                                </FilterField>
                            )}
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'EVENTS_TABLE_FILTER_CHAIN_ID',
                                })}
                            >
                                <Select
                                    allowClear
                                    value={localFilters.chainId?.toString()}
                                    onChange={changeLocalFilter('chainId')}
                                    options={evmNetworks.map(item => ({
                                        value: item.chainId,
                                        label: item.label,
                                    }))}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_BC',
                                    })}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'EVENTS_TABLE_FILTER_TOKEN',
                                })}
                            >
                                <TokenFilter
                                    tokens={tokens}
                                    tokenAddress={localFilters.tokenAddress}
                                    onChange={changeLocalFilter('tokenAddress')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'EVENTS_TABLE_FILTER_TYPE',
                                })}
                            >
                                <RadioFilter<RelayersEventsTransferKind>
                                    value={localFilters.transferKind}
                                    onChange={changeLocalFilter('transferKind')}
                                    labels={[{
                                        id: 'tontoeth',
                                        name: intl.formatMessage({
                                            id: 'EVENTS_TABLE_FILTER_TON_TO_ETH',
                                        }),
                                    }, {
                                        id: 'ethtoton',
                                        name: intl.formatMessage({
                                            id: 'EVENTS_TABLE_FILTER_ETH_TO_TON',
                                        }),
                                    }]}
                                />
                            </FilterField>
                        </>
                    )}
                </Filters>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    soon={soon}
                    onSort={tableOrder.onSort}
                    order={tableOrder.order}
                    loading={events.isLoading}
                    className="events-table"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TYPE',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_FROM',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TO',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TOKEN',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_AMOUNT',
                        }),
                        align: Align.right,
                        ascending: 'amountascending',
                        descending: 'amountdescending',
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_DATE',
                        }),
                        align: Align.right,
                        ascending: 'timestampascending',
                        descending: 'timestampdescending',
                    }]}
                    rows={events.items?.map(item => ({
                        cells: [
                            <EventType
                                chainId={item.chainId}
                                transferKind={item.transferKind}
                                contractAddress={item.contractAddress}
                            />,
                            <FromAddress
                                item={item}
                            />,
                            <ToAddress
                                item={item}
                            />,
                            <TokenBadge
                                size="small"
                                address={item.tokenAddress}
                                uri={tokensCache.get(item.tokenAddress)?.icon}
                                symbol={tokensCache.get(item.tokenAddress)?.symbol
                                    || intl.formatMessage({ id: 'NA' })}
                            />,
                            formattedTokenAmount(item.amount),
                            <DateCard
                                time={item.timestamp}
                            />,
                        ],
                    }))}
                />

                {!soon && (
                    <Pagination
                        page={pagination.page}
                        count={pagination.limit}
                        totalCount={pagination.totalCount}
                        totalPages={pagination.totalPages}
                        onSubmit={pagination.submit}
                    />
                )}
            </div>
        </Section>
    )
}

export const Events = observer(EventsInner)
