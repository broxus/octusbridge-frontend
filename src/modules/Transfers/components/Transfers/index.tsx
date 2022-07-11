import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { networks } from '@/config'
import {
    DateFilter,
    FilterField,
    Filters,
    RadioFilter,
    TextFilter,
    TokenFilter,
} from '@/components/common/Filters'
import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import {
    useDateParam,
    useDictParam,
    usePagination,
    useTableOrder,
    useTextParam,
    useUrlParams,
} from '@/hooks'
import { useTransfersContext } from '@/modules/Transfers/providers'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import {
    TransferKindFilter,
    TransfersFilters,
    TransfersOrdering,
    TransfersRequestStatus,
    TransferType,
} from '@/modules/Transfers/types'
import { useEverWallet } from '@/stores/EverWalletService'
import { BridgeAsset, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { error } from '@/utils'
import { Select } from '@/components/common/Select'
import { Checkbox } from '@/components/common/Checkbox'


function TransfersListInner(): JSX.Element {
    const intl = useIntl()
    const transfers = useTransfersContext()
    const bridgeAssets = useBridgeAssets()
    const tonWallet = useEverWallet()

    const pagination = usePagination(transfers.totalCount)

    const tableOrder = useTableOrder<TransfersOrdering>('createdatdescending')

    const urlParams = useUrlParams()

    const [userAddress] = useTextParam('user')

    const [createdAtGe] = useDateParam('createdge')
    const [createdAtLe] = useDateParam('createdle')

    const [tonTokenAddress] = useTextParam('token')
    const [status] = useDictParam<TransfersRequestStatus>('status', ['confirmed', 'pending', 'rejected'])
    const [transferType] = useDictParam<TransferType>('type', ['Credit', 'Default', 'Transit'])

    const [fromId] = useTextParam('from')
    const [toId] = useTextParam('to')

    const tokens = React.useMemo(() => (
        networks
            .filter(item => item.type === 'evm')
            .flatMap(network => bridgeAssets.filterTokensByChain(network.chainId))
            .reduce<BridgeAsset[]>((acc, token) => {
                if (acc.findIndex(({ root }) => root === token.root) > -1) {
                    return acc
                }
                acc.push(token)
                return acc
            }, [])
    ), [bridgeAssets.tokens])

    let titleId = 'TRANSFERS_ALL_TITLE'

    if (tonWallet.address && tonWallet.address === userAddress) {
        titleId = 'TRANSFERS_MY_TITLE'
    }
    else if (userAddress) {
        titleId = 'TRANSFERS_USER_TITLE'
    }

    const validTypes = (() => {
        const from = networks.find(item => item.id === fromId)
        const to = networks.find(item => item.id === toId)

        if (from && to && from.type === 'evm' && to.type === 'evm') {
            return ['Transit']
        }
        if (from && to && from.type === 'evm' && to.type === 'everscale') {
            return ['Default', 'Credit']
        }
        if (from && to && from.type === 'everscale' && to.type === 'evm') {
            return ['Default']
        }
        if (from && from.type === 'evm') {
            return ['Default', 'Credit', 'Transit']
        }
        if (to && to.type === 'evm') {
            return ['Default', 'Transit']
        }
        if (from && from.type === 'everscale') {
            return ['Default']
        }
        if (to && to.type === 'everscale') {
            return ['Credit', 'Default']
        }
        return ['Default', 'Credit', 'Transit'] as TransferType[]
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
        else if (from && to && from.type === 'evm' && to.type === 'everscale') {
            const validKinds = ['ethtoton', 'creditethtoton'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            ethTonChainId = parseInt(from.chainId, 10)
            transferKinds = selected.length ? selected : validKinds
        }
        else if (from && to && from.type === 'everscale' && to.type === 'evm') {
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
        else if (from && from.type === 'everscale') {
            transferKinds = ['tontoeth']
        }
        else if (to && to.type === 'everscale') {
            const validKinds = ['creditethtoton', 'ethtoton'] as TransferKindFilter[]
            const selected = selectedKinds.filter(item => validKinds.includes(item))

            transferKinds = selected.length ? selected : validKinds
        }
        else {
            transferKinds = selectedKinds
        }

        return { ethTonChainId, tonEthChainId, transferKinds }
    }

    const fetchAll = React.useCallback(async () => {
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
    }, [
        status,
        createdAtGe,
        createdAtLe,
        userAddress,
        tonTokenAddress,
        pagination,
    ])

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

    const toggleUserTransfers = () => {
        changeFilters({
            fromId,
            toId,
            status,
            transferType,
            createdAtGe,
            createdAtLe,
            tonTokenAddress,
            userAddress: userAddress === tonWallet.address ? undefined : tonWallet.address,
        })
    }

    React.useEffect(() => {
        (async () => {
            await fetchAll()
        })()
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
    ])

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: titleId,
                    })}
                </Title>

                <Actions>
                    {tonWallet.isReady && (
                        <Checkbox
                            checked={userAddress === tonWallet.address}
                            label={intl.formatMessage({
                                id: 'TRANSFERS_ONLY_MY_TRANSFERS_LABEL',
                            })}
                            onChange={toggleUserTransfers}
                        />
                    )}
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
                                    <Select
                                        allowClear
                                        value={filters.fromId}
                                        onChange={changeFilter('fromId')}
                                        options={networks.map(item => ({
                                            value: item.id,
                                            label: item.label,
                                        }))}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_BC',
                                        })}
                                    />
                                </FilterField>

                                <FilterField
                                    title={intl.formatMessage({
                                        id: 'TRANSFERS_BC_TO',
                                    })}
                                >
                                    <Select
                                        allowClear
                                        value={filters.toId}
                                        onChange={changeFilter('toId')}
                                        options={networks.map(item => ({
                                            value: item.id,
                                            label: item.label,
                                        }))}
                                        placeholder={intl.formatMessage({
                                            id: 'FILTERS_BC',
                                        })}
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
                </Actions>
            </Header>

            <div className="card card--flat card--small">
                <TransfersTable
                    loading={transfers.loading}
                    items={transfers.items}
                    order={tableOrder.order}
                    onSort={tableOrder.onSort}
                />

                <Pagination
                    count={pagination.limit}
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.totalCount}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const TransfersList = observer(TransfersListInner)
