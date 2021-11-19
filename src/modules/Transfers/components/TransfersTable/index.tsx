import * as React from 'react'
import { useIntl } from 'react-intl'

import { Table } from '@/components/common/Table'
import { TokenAmount } from '@/components/common/TokenAmount'
import { Badge } from '@/components/common/Badge'
import { TransfersApiOrdering, TransfersApiTransfer } from '@/modules/Transfers/types'
import {
    getFromNetwork, getToNetwork, mapStatusToBadge, mapStatusToIntl,
} from '@/modules/Transfers/utils'
import { useTokensCache } from '@/stores/TokensCacheService'
import { dateFormat } from '@/utils'

type Props = {
    items: TransfersApiTransfer[];
    order?: TransfersApiOrdering;
    onSort?: (order: TransfersApiOrdering) => void;
}

export function TransfersTable({
    items,
    order,
    onSort,
}: Props): JSX.Element {
    const intl = useIntl()
    const tokensCache = useTokensCache()

    const nullMessage = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Table<TransfersApiOrdering>
            className="transfers-table"
            order={order}
            onSort={onSort}
            cols={[{
                name: intl.formatMessage({
                    id: 'TRANSFERS_AMOUNT',
                }),
                ascending: 'volumeexecascending',
                descending: 'volumeexecdescending',
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_FROM',
                }),
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_TO',
                }),
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_STATUS',
                }),
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_DATE',
                }),
                align: 'right',
                ascending: 'createdatascending',
                descending: 'createdatdescending',
            }]}
            rows={items.map(item => ({
                cells: [
                    <TokenAmount
                        address={item.currencyAddress}
                        uri={tokensCache.get(item.currencyAddress)?.icon}
                        symbol={tokensCache.get(item.currencyAddress)?.symbol}
                        amount={item.volumeExec}
                    />,
                    getFromNetwork(item.transferKind, item.chainId) || nullMessage,
                    getToNetwork(item.transferKind, item.chainId) || nullMessage,
                    <Badge status={mapStatusToBadge(item.status)}>
                        {intl.formatMessage({
                            id: mapStatusToIntl(item.status),
                        })}
                    </Badge>,
                    dateFormat(item.createdAt),
                ],
            }))}
        />
    )
}
