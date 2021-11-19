import * as React from 'react'
import { useIntl } from 'react-intl'

import { Table } from '@/components/common/Table'
import { Header, Section, Title } from '@/components/common/Section'
import { UserCard } from '@/components/common/UserCard'
import { AmountCard } from '@/components/common/AmountCard'
import { Amount } from '@/components/common/Amount'
import { Pagination } from '@/components/common/Pagination'
import { dateFormat } from '@/utils'

import './index.scss'

export function Stakeholders(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_STAKEHOLDERS_TITLE',
                    })}
                </Title>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    className="stakeholders-table"
                    cols={[{
                        name: 'Address',
                    }, {
                        name: 'Type',
                    }, {
                        name: 'Stake, BRIDGE',
                        align: 'right',
                    }, {
                        name: 'Frozen stake, BRIDGE',
                        align: 'right',
                    }, {
                        name: '30d reward, BRIDGE',
                        align: 'right',
                    }, {
                        name: 'Total reward, BRIDGE',
                        align: 'right',
                    }, {
                        name: 'Staking since, UTC',
                        align: 'right',
                    }]}
                    rows={[{
                        link: '/',
                        cells: [
                            <UserCard address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1" />,
                            'Ordinary',
                            <Amount value="123123" />,
                            <Amount value="0" />,
                            <AmountCard
                                value="172150000000"
                                decimals={9}
                                changesDirection={0}
                                priceChange="0"
                            />,
                            <Amount value="724151" decimals={2} />,
                            dateFormat(new Date().getTime()),
                        ],
                    }]}
                />

                <Pagination
                    current={1}
                    limit={20}
                    onSubmit={() => {}}
                />
            </div>
        </Section>
    )
}
