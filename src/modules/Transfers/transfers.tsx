import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    DateFilter, FilterField, Filters, NetworkFilter, RadioFilter,
    TextFilter, TokenFilter,
} from '@/components/common/Filters'
import {
    Container, Header, Section, Title,
} from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { useTransfers } from '@/modules/Transfers/hooks/useTransfers'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import {
    useDateParam, useDictParam, usePagination, useTableOrder,
    useTextParam, useUrlParams,
} from '@/hooks'
import {
    TransferKindFilter, TransfersFilters, TransfersOrdering, TransfersRequestStatus, TransferType,
} from '@/modules/Transfers/types'
import { useTonWallet } from '@/stores/TonWalletService'
import { TokenCache, useTokensCache } from '@/stores/TokensCacheService'
import { error, sliceAddress } from '@/utils'
import { networks } from '@/config'

function TransfersInner(): JSX.Element {
    const intl = useIntl()
    const transfers = useTransfers()
    const pendingTransfers = useTransfers()
    const tokensCache = useTokensCache()
    const tonWallet = useTonWallet()

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

    const urlParams = useUrlParams()

    const [userAddress] = useTextParam('user')

    const [createdAtGe] = useDateParam('createdge')
    const [createdAtLe] = useDateParam('createdle')

    const [tonTokenAddress] = useTextParam('token')
    const [status] = useDictParam<TransfersRequestStatus>(
        'status', ['confirmed', 'pending', 'rejected'],
    )
    const [transferType] = useDictParam<TransferType>(
        'type', ['Credit', 'Default', 'Transit'],
    )

    const [fromId] = useTextParam('from')
    const [toId] = useTextParam('to')

    let titleId = 'TRANSFERS_ALL_TITLE'

    if (tonWallet.address && tonWallet.address === userAddress) {
        titleId = 'TRANSFERS_MY_TITLE'
    }
    else if (userAddress) {
        titleId = 'TRANSFERS_USER_TITLE'
    }

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

        urlParams.set({
            status: filters.status,
            type: filters.transferType,
            from: filters.fromId,
            to: filters.toId,
            token: filters.tonTokenAddress,
            createdge: filters.createdAtGe?.toString(),
            createdle: filters.createdAtLe?.toString(),
            user: filters.userAddress,
        })
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
        <Container size="lg">
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
                    <Title size="lg">
                        {intl.formatMessage({
                            id: titleId,
                        })}
                    </Title>

                    <Filters<TransfersFilters>
                        filters={{
                            fromId,
                            toId,
                            status,
                            transferType,
                            createdAtGe,
                            createdAtLe,
                            tonTokenAddress,
                            userAddress,
                        }}
                        onChange={changeFilters}
                    >
                        {(filters, changeFilter) => (
                            <>
                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_USER',
                                    })}
                                >
                                    <TextFilter
                                        value={filters.userAddress}
                                        onChange={changeFilter('userAddress')}
                                        placeholder={intl.formatMessage({
                                            id: 'TRANSFERS_USER_ADDRESS',
                                        })}
                                    />
                                </FilterField>
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
        </Container>
    )
}

export const Transfers = observer(TransfersInner)
