import * as React from 'react'
import { useIntl } from 'react-intl'

import { Header, Section, Title } from '@/components/common/Section'
import { Tab, Tabs } from '@/components/common/Tabs'
import { Table } from '@/components/common/Table'
import { Address } from '@/components/common/Address'
import { Amount } from '@/components/common/Amount'
import { Pagination } from '@/components/common/Pagination'
import { dateFormat } from '@/utils'

import './index.scss'

export function Transactions(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_TRANSACTIONS_TITLE',
                    })}
                </Title>
                <Tabs>
                    <Tab active>
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_ALL',
                        })}
                    </Tab>
                    <Tab>
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_DEPOSITS',
                        })}
                    </Tab>
                    <Tab>
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_WITHDRAWALS',
                        })}
                    </Tab>
                    <Tab>
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_REWARDS',
                        })}
                    </Tab>
                    <Tab>
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_FREEZES',
                        })}
                    </Tab>
                </Tabs>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    className="staking-transactions"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_TYPE',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_TRS',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_AMOUNT',
                        }),
                        align: 'right',
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_DATE',
                        }),
                        align: 'right',
                        sortable: true,
                        order: 'desc',
                    }]}
                    rows={[{
                        cells: [
                            'Deposit',
                            <Address
                                address="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37"
                                externalLink="/"
                            />,
                            <Amount
                                value="12114"
                            />,
                            dateFormat(new Date().getTime()),
                        ],
                    }]}
                />

                <Pagination
                    limit={10}
                    current={2}
                    onSubmit={() => {}}
                />
            </div>
        </Section>
    )
}
