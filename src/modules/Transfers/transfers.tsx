import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    DateFilter, FilterField, Filters, NetworkFilter, RadioFilter, TokenFilter,
} from '@/components/common/Filters'
import { Header, Section, Title } from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { useTransfers } from '@/modules/Transfers/hooks/useTransfers'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import { usePagination } from '@/hooks/usePagination'
import { useTableOrder } from '@/hooks/useTableOrder'
import { useDateParam } from '@/hooks/useDateParam'
import { useTextParam } from '@/hooks/useTextParam'
import { useDictParam } from '@/hooks/useDictParam'
import { useNumParam } from '@/hooks/useNumParam'
// import { useBNParam } from '@/hooks/useBNParam'
import {
    TransfersFilters, TransfersOrdering, TransfersRequestStatus,
} from '@/modules/Transfers/types'
import { TokenCache, useTokensCache } from '@/stores/TokensCacheService'
import { error, sliceAddress } from '@/utils'
import { networks } from '@/config'

import './index.scss'

type Props = {
    title: string;
    userAddress: string;
}

function TransfersInner({
    title,
    userAddress,
}: Props): JSX.Element {
    const intl = useIntl()
    const transfers = useTransfers()
    const pendingTransfers = useTransfers()
    const tokensCache = useTokensCache()

    const pagination = usePagination(transfers.totalCount)
    const pendingPagination = usePagination(pendingTransfers.totalCount)

    const tableOrder = useTableOrder<TransfersOrdering>('createdatdescending')
    const pendingTableOrder = useTableOrder<TransfersOrdering>('createdatdescending')

    const evmNetworks = React.useMemo(() => (
        networks.filter(item => item.type === 'evm')
    ), [])

    const tokens = React.useMemo(() => (
        evmNetworks
            .flatMap(({ chainId }) => tokensCache.filterTokensByChainId(chainId))
            .reduce<TokenCache[]>((acc, token) => (
                acc.findIndex(({ root }) => root === token.root) === -1
                    ? [...acc, token]
                    : acc
            ), [])
    ), [tokensCache.tokens, evmNetworks])

    const [chainId, setChainId] = useNumParam('chain')
    const [createdAtGe, setCreatedAtGe] = useDateParam('created-ge')
    const [createdAtLe, setCreatedAtLe] = useDateParam('created-le')

    // TODO: Enable when api will support filtering by volumeExec
    // const [volumeExecGe, setVolumeExecGe] = useBNParam('volume-ge')
    // const [volumeExecLe, setVolumeExecLe] = useBNParam('volume-le')

    const [tonTokenAddress, setTonTokenAddress] = useTextParam('token')
    const [status, setStatus] = useDictParam<TransfersRequestStatus>(
        'status', ['confirmed', 'pending', 'rejected'],
    )

    const fetchAll = async () => {
        if (!tokensCache.isInitialized) {
            return
        }
        try {
            await transfers.fetch({
                chainId,
                status,
                createdAtGe,
                createdAtLe,
                // volumeExecGe,
                // volumeExecLe,
                userAddress,
                tonTokenAddress,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }
    }

    const fetchPending = async () => {
        if (!tokensCache.isInitialized) {
            return
        }
        try {
            await pendingTransfers.fetch({
                status: 'pending',
                userAddress,
                limit: pendingPagination.limit,
                offset: pendingPagination.offset,
                ordering: pendingTableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }
    }

    const changeFilters = (filters: TransfersFilters) => {
        pagination.submit(1)
        setStatus(filters.status)
        setChainId(filters.chainId)
        setTonTokenAddress(filters.tonTokenAddress)
        setCreatedAtGe(filters.createdAtGe)
        setCreatedAtLe(filters.createdAtLe)
        // setVolumeExecGe(filters.volumeExecGe)
        // setVolumeExecLe(filters.volumeExecLe)
    }

    React.useEffect(() => {
        fetchAll()
    }, [
        status,
        chainId,
        createdAtGe,
        createdAtLe,
        // volumeExecGe,
        // volumeExecLe,
        tonTokenAddress,
        userAddress,
        pagination.limit,
        pagination.offset,
        tableOrder.order,
        tokensCache.isInitialized,
    ])

    React.useEffect(() => {
        fetchPending()
    }, [
        userAddress,
        pendingPagination.limit,
        pendingPagination.offset,
        pendingTableOrder.order,
        tokensCache.isInitialized,
    ])

    return (
        <>
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'TRANSFERS_BREADCRUMB_BRIDGE',
                    }),
                    link: '/bridge',
                }, {
                    title: intl.formatMessage({
                        id: 'TRANSFERS_BREADCRUMB_ADDRESS',
                    }, {
                        address: sliceAddress(userAddress),
                    }),
                }]}
            />

            {pendingTransfers.totalCount !== undefined && pendingTransfers.totalCount > 0 && (
                <Section>
                    <Title>
                        {intl.formatMessage({
                            id: 'TRANSFERS_PENDING_TITLE',
                        })}
                    </Title>

                    <div className="card card--flat card--small">
                        <TransfersTable
                            items={pendingTransfers.items}
                            order={pendingTableOrder.order}
                            onSort={pendingTableOrder.onSort}
                        />

                        {pendingPagination.totalPages > 1 && (
                            <Pagination
                                page={pendingPagination.page}
                                totalPages={pendingPagination.totalPages}
                                onSubmit={pendingPagination.submit}
                            />
                        )}
                    </div>
                </Section>
            )}

            <Section>
                <Header size="lg">
                    <Title size="lg">{title}</Title>

                    <Filters<TransfersFilters>
                        filters={{
                            chainId,
                            status,
                            createdAtGe,
                            createdAtLe,
                            // volumeExecGe,
                            // volumeExecLe,
                            tonTokenAddress,
                        }}
                        onChange={changeFilters}
                    >
                        {(filters, changeFilter) => (
                            <>
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_DATE',
                                    })}
                                >
                                    <DateFilter
                                        value={filters.createdAtGe}
                                        onChange={changeFilter('createdAtGe')}
                                    />
                                    <DateFilter
                                        value={filters.createdAtLe}
                                        onChange={changeFilter('createdAtLe')}
                                    />
                                </FilterField>
                                {/* <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_AMOUNT',
                                    })}
                                >
                                    <TextFilter
                                        value={filters.volumeExecGe}
                                        onChange={changeFilter('volumeExecGe')}
                                        regexp={NUM_REGEXP}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_FROM',
                                        })}
                                    />
                                    <TextFilter
                                        value={filters.volumeExecLe}
                                        onChange={changeFilter('volumeExecLe')}
                                        regexp={NUM_REGEXP}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_TO',
                                        })}
                                    />
                                </FilterField> */}
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_BC',
                                    })}
                                >
                                    <NetworkFilter
                                        networks={evmNetworks}
                                        chainId={filters.chainId}
                                        onChange={changeFilter('chainId')}
                                    />
                                </FilterField>
                                {tokens && (
                                    <FilterField
                                        title={intl.formatMessage({
                                            id: 'TRANSFERS_TOKEN',
                                        })}
                                    >
                                        <TokenFilter
                                            tokens={tokens}
                                            tokenAddress={filters.tonTokenAddress}
                                            onChange={changeFilter('tonTokenAddress')}
                                        />
                                    </FilterField>
                                )}
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_STATUS',
                                    })}
                                >
                                    <RadioFilter<TransfersRequestStatus>
                                        value={filters.status}
                                        onChange={changeFilter('status')}
                                        labels={[{
                                            id: 'confirmed',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_STATUS_CONFIRMED',
                                            }),
                                        }, {
                                            id: 'pending',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_STATUS_PENDING',
                                            }),
                                        }, {
                                            id: 'rejected',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_STATUS_REJECTED',
                                            }),
                                        }]}
                                    />
                                </FilterField>
                            </>
                        )}
                    </Filters>
                </Header>

                <div className="card card--flat card--small">
                    <TransfersTable
                        loading={transfers.loading}
                        items={transfers.items}
                        order={tableOrder.order}
                        onSort={tableOrder.onSort}
                    />

                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onSubmit={pagination.submit}
                    />
                </div>
            </Section>
        </>
    )
}

export const Transfers = observer(TransfersInner)
