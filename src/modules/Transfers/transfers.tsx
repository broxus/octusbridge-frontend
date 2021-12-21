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
import {
    useDateParam, useDictParam, usePagination, useTableOrder, useTextParam,
} from '@/hooks'
import {
    TransferKindFilter, TransfersFilters, TransfersOrdering, TransfersRequestStatus, TransferType,
} from '@/modules/Transfers/types'
import { TokenCache, useTokensCache } from '@/stores/TokensCacheService'
import { error, sliceAddress } from '@/utils'
import { networks } from '@/config'

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

    const [createdAtGe, setCreatedAtGe] = useDateParam('created-ge')
    const [createdAtLe, setCreatedAtLe] = useDateParam('created-le')

    const [tonTokenAddress, setTonTokenAddress] = useTextParam('token')
    const [status, setStatus] = useDictParam<TransfersRequestStatus>(
        'status', ['confirmed', 'pending', 'rejected'],
    )
    const [transferType, setTransferType] = useDictParam<TransferType>(
        'type', ['Credit', 'Default', 'Transit'],
    )

    const [fromId, setFromId] = useTextParam('from')
    const [toId, setToId] = useTextParam('to')

    const validTypes: TransferType[] = (() => {
        const from = networks.find(item => item.id === fromId)
        const to = networks.find(item => item.id === toId)

        if (from && to && from.type === 'evm' && to.type === 'evm') {
            return ['Transit']
        }
        if (from && to && from.type === 'evm' && to.type === 'ton') {
            return ['Default', 'Credit']
        }
        if (from && to && from.type === 'ton' && to.type === 'evm') {
            return ['Default']
        }
        if (from && from.type === 'evm') {
            return ['Default', 'Credit', 'Transit']
        }
        if (to && to.type === 'evm') {
            return ['Default', 'Transit']
        }
        if (from && from.type === 'ton') {
            return ['Default']
        }
        if (to && to.type === 'ton') {
            return ['Credit', 'Default']
        }
        return ['Default', 'Credit', 'Transit']
    })()

    const mapTransferTypeToFilter = (): TransferKindFilter[] => {
        switch (transferType) {
            case 'Credit':
                return ['creditethtoton']
            case 'Transit':
                return ['ethtoeth']
            case 'Default':
                return ['tontoeth', 'ethtoton']
            default:
                return []
        }
    }

    const mapExtraFilters = () => {
        const from = networks.find(item => item.id === fromId)
        const to = networks.find(item => item.id === toId)
        const selectedKinds = mapTransferTypeToFilter()

        let ethTonChainId,
            tonEthChainId,
            transferKinds: TransferKindFilter[] | undefined

        if (from && to && from.type === 'evm' && to.type === 'evm') {
            ethTonChainId = parseInt(from.chainId, 10)
            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = ['ethtoeth']
        }
        else if (from && to && from.type === 'evm' && to.type === 'ton') {
            const validKinds = ['ethtoton', 'creditethtoton'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            ethTonChainId = parseInt(from.chainId, 10)
            transferKinds = selected.length ? selected : validKinds
        }
        else if (from && to && from.type === 'ton' && to.type === 'evm') {
            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = ['tontoeth']
        }
        else if (from && from.type === 'evm') {
            const validKinds = ['ethtoton', 'creditethtoton', 'ethtoeth'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            ethTonChainId = parseInt(from.chainId, 10)
            transferKinds = selected.length ? selected : []
        }
        else if (to && to.type === 'evm') {
            const validKinds = ['tontoeth', 'ethtoeth'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = selected.length ? selected : []
        }
        else if (from && from.type === 'ton') {
            transferKinds = ['tontoeth']
        }
        else if (to && to.type === 'ton') {
            const validKinds = ['creditethtoton', 'ethtoton'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            transferKinds = selected.length ? selected : validKinds
        }
        else {
            transferKinds = selectedKinds
        }

        return { ethTonChainId, tonEthChainId, transferKinds }
    }

    const fetchAll = async () => {
        if (!tokensCache.isInitialized) {
            return
        }

        try {
            await transfers.fetch({
                status,
                createdAtGe,
                createdAtLe,
                userAddress,
                tonTokenAddress,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
                ...mapExtraFilters(),
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
        setTransferType(filters.transferType)
        setFromId(filters.fromId)
        setToId(filters.toId)
        setTonTokenAddress(filters.tonTokenAddress)
        setCreatedAtGe(filters.createdAtGe)
        setCreatedAtLe(filters.createdAtLe)
    }

    React.useEffect(() => {
        fetchAll()
    }, [
        status,
        transferType,
        fromId,
        toId,
        createdAtGe,
        createdAtLe,
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
                            loading={pendingTransfers.loading}
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
                            fromId,
                            toId,
                            status,
                            transferType,
                            createdAtGe,
                            createdAtLe,
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
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_BC_FROM',
                                    })}
                                >
                                    <NetworkFilter
                                        id={filters.fromId}
                                        networks={networks}
                                        onChange={changeFilter('fromId')}
                                    />
                                </FilterField>

                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_BC_TO',
                                    })}
                                >
                                    <NetworkFilter
                                        id={filters.toId}
                                        networks={networks}
                                        onChange={changeFilter('toId')}
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
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_TYPE',
                                    })}
                                >
                                    <RadioFilter<TransferType>
                                        value={filters.transferType}
                                        onChange={changeFilter('transferType')}
                                        labels={[{
                                            id: 'Default',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_TYPE_DEFAULT',
                                            }),
                                            disabled: !validTypes.includes('Default'),
                                        }, {
                                            id: 'Credit',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_TYPE_CREDIT',
                                            }),
                                            disabled: !validTypes.includes('Credit'),
                                        }, {
                                            id: 'Transit',
                                            name: intl.formatMessage({
                                                id: 'TRANSFERS_TYPE_TRANSIT',
                                            }),
                                            disabled: !validTypes.includes('Transit'),
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
