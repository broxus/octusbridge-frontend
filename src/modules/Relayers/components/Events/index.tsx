import * as React from 'react'
import { useIntl } from 'react-intl'

import { Header, Section, Title } from '@/components/common/Section'
import { Token } from '@/components/common/Token'
import { Table } from '@/components/common/Table'
import { Amount } from '@/components/common/Amount'
import { Pagination } from '@/components/common/Pagination'
import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'
import { EventType } from '@/modules/Relayers/components/Events/type'
import { dateFormat } from '@/utils'

import './index.scss'

export function Events(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'EVENTS_TITLE',
                    })}
                </Title>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    className="events-table"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TYPE',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_ORIGINAL_ADDRESS',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TARGET_ADDRESS',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_TOKEN',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_AMOUNT',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'EVENTS_TABLE_COL_DATE',
                        }),
                        align: 'right',
                    }]}
                    rows={[{
                        cells: [
                            <EventType
                                leftAddress="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                                leftSymbol="TON"
                                rightAddress="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37"
                                rightSymbol="ETH"
                                type="Token transfer"
                                link="/"
                            />,
                            <TransactionExplorerLink id="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1" />,
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />,
                            <Token
                                address="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37"
                                symbol="TON"
                                size="small"
                            />,
                            <Amount
                                value="12300000000000"
                                decimals={9}
                            />,
                            dateFormat(new Date().getTime()),
                        ],
                    }]}
                />

                <Pagination
                    page={1}
                    onSubmit={() => {}}
                />
            </div>
        </Section>
    )
}
