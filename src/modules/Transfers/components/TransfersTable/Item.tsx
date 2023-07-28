import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Align, Cell, Row } from '@/components/common/Table'
import { Amount } from '@/modules/Transfers/components/Amount'
import { From } from '@/modules/Transfers/components/TransfersTable/From'
import { Status } from '@/modules/Transfers/components/TransfersTable/Status'
import { To } from '@/modules/Transfers/components/TransfersTable/To'
import { type Transfer } from '@/modules/Transfers/types'
import { getTransferLink } from '@/modules/Transfers/utils'
import { dateFormat } from '@/utils'

import './index.scss'

type Props = {
    transfer: Transfer;
}

export function ItemInner({
    transfer,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const link = getTransferLink(transfer)

    return (
        <Row>
            <Cell>
                <div className="transfers-table__amount">
                    {link ? (
                        <Link to={link} className="transfers-table-data">
                            <Status status={transfer.transferStatus} />
                            <Amount transfer={transfer} />
                        </Link>
                    ) : (
                        <div className="transfers-table-data">
                            <Status status={transfer.transferStatus} />
                            <Amount transfer={transfer} />
                        </div>
                    )}
                </div>
            </Cell>
            <Cell>
                <From transfer={transfer} />
            </Cell>
            <Cell>
                <To transfer={transfer} />
            </Cell>
            <Cell align={Align.right}>
                {transfer.createdAt ? dateFormat(transfer.createdAt) : noValue}
            </Cell>
        </Row>
    )
}

export const Item = observer(ItemInner)
