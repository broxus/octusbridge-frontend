import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Checkbox } from '@/components/common/Checkbox'
import { TokenBadge } from '@/components/common/TokenBadge'
import { Table, Value } from '@/components/common/Table'
import { useTokensAssets } from '@/stores/TokensAssetsService'
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
    const tokensAssets = useTokensAssets()
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
                    align: 'center',
                }, {
                    align: 'left',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_TOKEN',
                    }),
                }, {
                    align: 'left',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_SPEND',
                    }),
                }, {
                    align: 'left',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_GET',
                    }),
                }, {
                    align: 'left',
                    ascending: 'bountyascending',
                    descending: 'bountydescending',
                    name: intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_TABLE_YOU_REWARD',
                    }),
                }, {
                    align: 'right',
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
                            uri={tokensAssets.get('everscale', '1', item.tonTokenAddress)?.icon}
                            symbol={tokensAssets.get('everscale', '1', item.tonTokenAddress)?.symbol ?? sliceAddress(item.tonTokenAddress)}
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
                            label={dateFormat(item.timestamp, 'DD')}
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
