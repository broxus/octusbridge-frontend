import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Align, Table } from '@/components/common/Table'
import { Item } from '@/modules/Transfers/components/TransfersTable/Item'
import { type Transfer, type TransfersOrdering } from '@/modules/Transfers/types'

import './index.scss'

type Props = {
    items: Transfer[];
    order?: TransfersOrdering;
    loading?: boolean;
    onSort?: (order: TransfersOrdering) => void;
}

export function TransfersTableInner({
    items,
    order,
    loading,
    onSort,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Table<TransfersOrdering>
            loading={loading}
            className="transfers-table"
            order={order}
            onSort={onSort}
            cols={[{
                name: intl.formatMessage({
                    id: 'TRANSFERS_AMOUNT',
                }),
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_FROM',
                }),
            }, {
                name: intl.formatMessage({
                    id: 'TRANSFERS_TO',
                }),
            }, {
                align: Align.right,
                ascending: 'createdatascending',
                descending: 'createdatdescending',
                name: intl.formatMessage({
                    id: 'TRANSFERS_DATE',
                }),
            }]}
            rawRows={items.map((item, index) => (
                /* eslint-disable react/no-array-index-key */
                <Item transfer={item} key={`${index}.${item.createdAt}`} />
            ))}
        />
    )
}

export const TransfersTable = observer(TransfersTableInner)
