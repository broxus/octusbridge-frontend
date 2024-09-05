import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Checkbox } from '@/components/common/Checkbox'
import {
    DateFilter,
    FilterField,
    Filters,
    RadioFilter,
    TextFilter,
    TokenFilter,
} from '@/components/common/Filters'
import { Icon } from '@/components/common/Icon'
import { Pagination } from '@/components/common/Pagination'
import { Header, Section, Title } from '@/components/common/Section'
import { Select } from '@/components/common/Select'
import { networks } from '@/config'
import {
    useDateParam,
    useDictParam,
    usePagination,
    useTableOrder,
    useTextParam,
    useUrlParams,
} from '@/hooks'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import { useTransfersContext } from '@/modules/Transfers/providers'
import {
    type TransferKindFilter,
    type TransferType,
    type TransfersFilters,
    type TransfersOrdering,
    type TransfersRequest,
    type TransfersRequestStatus,
} from '@/modules/Transfers/types'
import { type BridgeAsset, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { useEverWallet } from '@/stores/EverWalletService'
import { error, isEverscaleAddressValid, isEvmAddressValid } from '@/utils'

import './index.scss'

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

    const [tokenAddress] = useTextParam('token')
    const [status] = useDictParam<TransfersRequestStatus>('status', ['confirmed', 'pending', 'rejected'])
    const [transferType] = useDictParam<TransferType>('type', ['Credit', 'Default', 'Transit'])

    const [fromId] = useTextParam('from')
    const [toId] = useTextParam('to')

    const tokens = React.useMemo(() => (
        bridgeAssets.tokens.reduce<BridgeAsset[]>((acc, token) => {
            if (acc.findIndex(({ root, symbol }) => symbol === token.symbol || root === token.root) > -1) {
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

    const mapExtraFilters = () => {
        const from = networks.find(item => item.id === fromId)
        const to = networks.find(item => item.id === toId)

        let ethTonChainId,
            tonEthChainId,
            transferKinds: TransferKindFilter[] | undefined

        if (from && to && from.type === 'evm' && to.type === 'evm') {
            ethTonChainId = parseInt(from.chainId, 10)
            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = ['ethtoeth']
        }
        else if (from && to && from.type === 'evm' && to.type === 'tvm') {
            const validKinds: TransferKindFilter[] = ['ethtoton', 'creditethtoton']

            ethTonChainId = parseInt(from.chainId, 10)
            transferKinds = validKinds
        }
        else if (from && to && from.type === 'tvm' && to.type === 'evm') {
            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = ['tontoeth']
        }
        else if (from && from.type === 'evm') {
            const validKinds: TransferKindFilter[] = ['ethtoton', 'creditethtoton']
            if (to && to.type === 'evm') {
                validKinds.push('ethtoeth')
            }
            ethTonChainId = parseInt(from.chainId, 10)
            transferKinds = validKinds
        }
        else if (to && to.type === 'evm') {
            const validKinds: TransferKindFilter[] = ['tontoeth']
            if (from && from.type === 'evm') {
                validKinds.push('ethtoeth')
            }
            tonEthChainId = parseInt(to.chainId, 10)
            transferKinds = validKinds
        }
        else if (from && from.type === 'tvm') {
            transferKinds = ['tontoeth']
        }
        else if (to && to.type === 'tvm') {
            transferKinds = ['ethtoton', 'creditethtoton']
        }
        else {
            transferKinds = []
        }

        return { ethTonChainId, tonEthChainId, transferKinds }
    }

    const fetchAll = React.useCallback(async () => {
        try {
            const params: TransfersRequest = {
                createdAtGe,
                createdAtLe,
                userAddress,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
                status,
                ...mapExtraFilters(),
            }
            if (isEvmAddressValid(tokenAddress)) {
                params.ethTokenAddress = tokenAddress?.toLowerCase()
            }
            else if (isEverscaleAddressValid(tokenAddress)) {
                params.tonTokenAddress = tokenAddress?.toLowerCase()
            }
            await transfers.fetch(params)
        }
        catch (e) {
            error(e)
        }
    }, [
        status,
        createdAtGe,
        createdAtLe,
        userAddress,
        tokenAddress,
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
            tonTokenAddress: tokenAddress,
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
        tokenAddress,
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

                <div className="transfers-filters">
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
                            tonTokenAddress: tokenAddress,
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
                                        options={networks.filter(item => item.type !== 'solana').map(item => ({
                                            value: item.id,
                                            label: (
                                                <div className="network-select-label">
                                                    <div className="network-select-label-inner">
                                                        <div>
                                                            <Icon icon={`${item.type.toLowerCase()}${item.chainId}BlockchainIcon`} />
                                                        </div>
                                                        <div>
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                    {item.badge !== undefined && (
                                                        <div className="network-select-label-badge">
                                                            {item.badge}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
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
                                        options={networks.filter(item => item.type !== 'solana').map(item => ({
                                            value: item.id,
                                            label: (
                                                <div className="network-select-label">
                                                    <div className="network-select-label-inner">
                                                        <div>
                                                            <Icon icon={`${item.type.toLowerCase()}${item.chainId}BlockchainIcon`} />
                                                        </div>
                                                        <div>
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                    {item.badge !== undefined && (
                                                        <div className="network-select-label-badge">
                                                            {item.badge}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
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
                            </>
                        )}
                    </Filters>
                </div>
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
