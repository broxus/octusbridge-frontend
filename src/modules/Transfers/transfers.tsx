import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    DateFilter,
    FilterField,
    Filters,
    RadioFilter,
    TextFilter,
} from '@/components/common/Filters'
import { Select } from '@/components/common/Select'
import { Header, Section, Title } from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { networks } from '@/config'
import { useTransfers } from '@/modules/Transfers/hooks/useTransfers'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import { usePagination } from '@/hooks/usePagination'
import { useTableOrder } from '@/hooks/useTableOrder'
import { useDateParam } from '@/hooks/useDateParam'
import { useTextParam } from '@/hooks/useTextParam'
import { useDictParam } from '@/hooks/useDictParam'
import {
    TransfersApiFilters,
    TransfersApiOrdering,
    TransfersApiRequestStatus,
} from '@/modules/Transfers/types'
import { useTokensCache } from '@/stores/TokensCacheService'
import { error, findNetwork, sliceAddress } from '@/utils'

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

    const tableOrder = useTableOrder<TransfersApiOrdering>('createdatdescending')
    const pendingTableOrder = useTableOrder<TransfersApiOrdering>('createdatdescending')

    const evmNetworks = networks.filter(item => item.type === 'evm')
    const evmChainIds = evmNetworks.map(item => item.chainId)

    const [createdAtGe, setCreatedAtGe] = useDateParam('createdAtGe')
    const [createdAtLe, setCreatedAtLe] = useDateParam('createdAtLe')
    const [volumeExecGe, setVolumeExecGe] = useTextParam('volumeExecGe')
    const [volumeExecLe, setVolumeExecLe] = useTextParam('volumeExecLe')
    const [status, setStatus] = useDictParam<TransfersApiRequestStatus>(
        'status', ['confirmed', 'pending', 'rejected'],
    )
    const [chainId, setChainId] = useDictParam<typeof evmChainIds[number]>(
        'chainId', evmChainIds,
    )
    const chainIdNum = chainId ? parseInt(chainId, 10) : undefined

    const fetchAll = async () => {
        if (!tokensCache.isInitialized) {
            return
        }
        try {
            await transfers.fetch({
                status,
                createdAtGe,
                createdAtLe,
                volumeExecGe,
                volumeExecLe,
                userAddress,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
                chainId: chainIdNum,
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

    const changeFilters = (filters: TransfersApiFilters) => {
        pagination.submit(1)
        setStatus(filters.status)
        setChainId(filters.chainId?.toString())
        setCreatedAtGe(filters.createdAtGe)
        setCreatedAtLe(filters.createdAtLe)
        setVolumeExecGe(filters.volumeExecGe)
        setVolumeExecLe(filters.volumeExecLe)
    }

    React.useEffect(() => {
        fetchAll()
    }, [
        status,
        chainId,
        createdAtGe,
        createdAtLe,
        volumeExecGe,
        volumeExecLe,
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

                    <Filters<TransfersApiFilters>
                        filters={{
                            status,
                            createdAtGe,
                            createdAtLe,
                            volumeExecGe,
                            volumeExecLe,
                            chainId: chainIdNum,
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
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_AMOUNT',
                                    })}
                                >
                                    <TextFilter
                                        value={filters.volumeExecGe}
                                        onChange={changeFilter('volumeExecGe')}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_FROM',
                                        })}
                                    />
                                    <TextFilter
                                        value={filters.volumeExecLe}
                                        onChange={changeFilter('volumeExecLe')}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_TO',
                                        })}
                                    />
                                </FilterField>
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_BC',
                                    })}
                                >
                                    <Select
                                        options={evmNetworks.map(item => ({
                                            value: parseInt(item.chainId, 10),
                                            label: item.label,
                                        }))}
                                        value={filters.chainId
                                            ? findNetwork(filters.chainId.toString(), 'evm')?.label
                                            : undefined}
                                        inputValue={filters.chainId?.toString()}
                                        onChange={changeFilter('chainId')}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_BC',
                                        })}
                                    />
                                </FilterField>
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_STATUS',
                                    })}
                                >
                                    <RadioFilter<TransfersApiRequestStatus>
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
