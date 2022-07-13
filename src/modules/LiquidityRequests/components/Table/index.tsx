import * as React from 'react'
import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Checkbox } from '@/components/common/Checkbox'
import { TokenBadge } from '@/components/common/TokenBadge'
import { Align, Table, Value } from '@/components/common/Table'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import { useLiquidityRequests } from '@/modules/LiquidityRequests/providers/LiquidityRequestsProvider'
import { SearchNotInstant, SearchNotInstantOrdering } from '@/modules/LiquidityRequests/types'
import {
    dateFormat, findNetwork, formattedAmount, sliceAddress,
} from '@/utils'

import './index.scss'

type Props = {
    order: SearchNotInstantOrdering;
    onSort: (order: SearchNotInstantOrdering) => void;
}

function LiquidityRequestsTableInner({
    order,
    onSort,
}: Props): JSX.Element {
    const intl = useIntl()
    const bridgeAssets = useBridgeAssets()
    const liquidityRequests = useLiquidityRequests()

    const items = liquidityRequests.transfers.map(item => ({
        ...item,
        decimals: liquidityRequests.getEvmTokenDecimals(
            item.ethTokenAddress,
            item.chainId.toString(),
        ),
    }))

    const selectedChainId = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected[0].chainId
        : undefined

    const selectedEthToken = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected[0].ethTokenAddress
        : undefined

    const toggleTransferFn = (transfer: SearchNotInstant) => () => {
        liquidityRequests.toggleTransfer(transfer)
    }

    return (
        <div className="card card--flat card--small">
            <Table<SearchNotInstantOrdering>
                onSort={onSort}
                order={order}
                loading={!liquidityRequests.isLoaded || liquidityRequests.isLoading}
                className="liquidity-requests-table"
                cols={[{
                    align: Align.center,
                }, {
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_TOKEN',
                    }),
                }, {
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_SPEND',
                    }),
                }, {
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_GET',
                    }),
                }, {
                    ascending: 'bountyascending',
                    descending: 'bountydescending',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_REWARD',
                    }),
                }, {
                    align: Align.right,
                    ascending: 'createdatascending',
                    descending: 'createdatdescending',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_DATE',
                    }),
                }]}
                rows={items.map(item => ({
                    disabled: selectedChainId !== undefined && selectedEthToken !== undefined
                        && (selectedChainId !== item.chainId || selectedEthToken !== item.ethTokenAddress),
                    cells: [
                        <Checkbox
                            disabled={item.status === 'Close'}
                            onChange={toggleTransferFn(item)}
                            checked={liquidityRequests.selected
                                .findIndex(_item => _item.contractAddress === item.contractAddress) > -1}
                        />,
                        <TokenBadge
                            size="xsmall"
                            address={item.tonTokenAddress}
                            uri={bridgeAssets.get('everscale', '1', item.tonTokenAddress)?.icon}
                            symbol={bridgeAssets.get('everscale', '1', item.tonTokenAddress)?.symbol ?? sliceAddress(item.tonTokenAddress)}
                        />,
                        <Value
                            label={findNetwork(item.chainId.toString(), 'evm')?.name}
                        >
                            {item.decimals
                                ? formattedAmount(item.currentAmount, item.decimals)
                                : intl.formatMessage({
                                    id: 'NO_VALUE',
                                })}
                        </Value>,
                        <Value
                            label={findNetwork('1', 'everscale')?.name}
                        >
                            {item.decimals
                                ? formattedAmount(
                                    new BigNumber(item.currentAmount).plus(item.bounty).toFixed(),
                                    item.decimals,
                                )
                                : intl.formatMessage({
                                    id: 'NO_VALUE',
                                })}
                        </Value>,
                        <Value
                            label={findNetwork('1', 'everscale')?.name}
                        >
                            {item.decimals
                                ? formattedAmount(item.bounty, item.decimals)
                                : intl.formatMessage({
                                    id: 'NO_VALUE',
                                })}
                        </Value>,
                        <Value
                            label={(
                                <Link to={`/transfer/everscale-1/evm-${item.chainId}/${item.contractAddress}`}>
                                    {dateFormat(item.timestamp, 'DD')}
                                </Link>
                            )}
                        >
                            {dateFormat(item.timestamp, 'TT')}
                        </Value>,
                    ],
                }))}
            />
        </div>
    )
}

export const LiquidityRequestsTable = observer(LiquidityRequestsTableInner)
