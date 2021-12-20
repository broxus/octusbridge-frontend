import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Summary } from '@/components/common/Summary'
import { Icon } from '@/components/common/Icon'
import { Badge } from '@/components/common/Badge'
import { Cell, Row } from '@/components/common/Table'
import { Amount } from '@/modules/Transfers/components/Amount'
import {
    getFromNetwork, getToNetwork, getTransferLink,
    mapStatusToBadge, mapStatusToIntl,
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
    const [ethToEthInfoVisible, setEthToEthInfoVisible] = React.useState(false)

    const toggleEthToEthInfo = () => setEthToEthInfoVisible(!ethToEthInfoVisible)

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const na = intl.formatMessage({
        id: 'NA',
    })

    const link = getTransferLink(transfer)
    const from = getFromNetwork(transfer)
    const to = getToNetwork(transfer)

    return (
        <>
            <Row>
                <Cell>
                    <div className="transfers-table__amount">
                        {link ? (
                            <Link to={link} className="transfers-table__link">
                                <Amount transfer={transfer} />
                                <Icon icon="link" />
                            </Link>
                        ) : (
                            <Amount transfer={transfer} />
                        )}

                        {transfer.transferKind === 'EthToEth' && (
                            <Icon
                                icon="info"
                                className="transfers-table__toggler"
                                onClick={toggleEthToEthInfo}
                            />
                        )}
                    </div>
                </Cell>
                <Cell>
                    {from || noValue}
                </Cell>
                <Cell>
                    {to || noValue}
                </Cell>
                <Cell>
                    {transfer.transferStatus ? (
                        <Badge status={mapStatusToBadge(transfer.transferStatus)}>
                            {intl.formatMessage({
                                id: mapStatusToIntl(transfer.transferStatus),
                            })}
                        </Badge>
                    ) : noValue}
                </Cell>
                <Cell align="right">
                    {transfer.createdAt ? dateFormat(transfer.createdAt) : noValue}
                </Cell>
            </Row>

            {ethToEthInfoVisible && (
                <div className="transfers-table__info">
                    <Summary
                        compact
                        className="transfers-table__summary"
                        items={[{
                            key: intl.formatMessage({
                                id: 'TRANSFERS_ETH_TO_TON',
                            }, {
                                network: from || na,
                            }),
                            value: (
                                <Badge status={mapStatusToBadge(transfer.ethTonStatus)}>
                                    {intl.formatMessage({
                                        id: mapStatusToIntl(transfer.ethTonStatus),
                                    })}
                                </Badge>
                            ),
                        }, {
                            key: intl.formatMessage({
                                id: 'TRANSFERS_TON_TO_ETH',
                            }, {
                                network: to || na,
                            }),
                            value: (
                                <Badge status={mapStatusToBadge(transfer.tonEthStatus)}>
                                    {intl.formatMessage({
                                        id: mapStatusToIntl(transfer.tonEthStatus),
                                    })}
                                </Badge>
                            ),
                        }]}
                    />
                </div>
            )}
        </>
    )
}

export const Item = observer(ItemInner)
