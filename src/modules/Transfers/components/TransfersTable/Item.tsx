import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Cell, Row } from '@/components/common/Table'
import { Amount } from '@/modules/Transfers/components/Amount'
import { Status } from '@/modules/Transfers/components/TransfersTable/Status'
import {
    getFromNetwork, getToNetwork, getTransferLink,
    getTypeIntlId,
} from '@/modules/Transfers/utils'
import { Transfer } from '@/modules/Transfers/types'
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
    const from = getFromNetwork(transfer)
    const to = getToNetwork(transfer)
    const needToShowPartStatus = transfer.transferKind === 'EthToEth'
        && (transfer.ethTonStatus !== 'Confirmed' || transfer.tonEthStatus !== 'Confirmed')

    return (
        <Row>
            <Cell>
                <div className="transfers-table__amount">
                    {link ? (
                        <Link to={link} className="transfers-table-status-wrapper">
                            <Status status={transfer.transferStatus} />
                            <Amount transfer={transfer} />
                        </Link>
                    ) : (
                        <div className="transfers-table-status-wrapper">
                            <Status status={transfer.transferStatus} />
                            <Amount transfer={transfer} />
                        </div>
                    )}
                </div>
            </Cell>
            <Cell>
                {transfer.transferKind ? intl.formatMessage({
                    id: getTypeIntlId(transfer.transferKind),
                }) : noValue}
            </Cell>
            <Cell>
                <div className="transfers-table-status-wrapper">
                    {from || noValue}

                    {needToShowPartStatus && (
                        <Status status={transfer.ethTonStatus} />
                    )}
                </div>
            </Cell>
            <Cell>
                <div className="transfers-table-status-wrapper">
                    {to || noValue}

                    {needToShowPartStatus && (
                        <Status status={transfer.tonEthStatus} />
                    )}
                </div>
            </Cell>
            <Cell align="right">
                {transfer.createdAt ? dateFormat(transfer.createdAt) : noValue}
            </Cell>
        </Row>
    )
}

export const Item = observer(ItemInner)
