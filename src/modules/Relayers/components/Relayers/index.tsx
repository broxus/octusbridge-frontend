// @ts-nocheck

import * as React from 'react'
import { useIntl } from 'react-intl'

import { Header, Section, Title } from '@/components/common/Section'
import { Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { UserCard } from '@/components/common/UserCard'
import { Status } from '@/modules/Relayers/components/Relayers/status'
import { Rounds } from '@/modules/Relayers/components/Relayers/rounds'
import { dateFormat, formattedAmount } from '@/utils'

import './index.scss'

export function Relayers(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'RELAYERS_TITLE',
                    })}
                </Title>
            </Header>

            <div className="card card--flat card--small">
                <Table
                    className="relayers-table"
                    cols={[{
                        name: '#',
                        align: 'left',
                    }, {
                        name: 'Relayer',
                        align: 'left',
                    }, {
                        name: 'Stake, BRIDGE',
                        align: 'right',
                    }, {
                        name: 'Slashed',
                        align: 'right',
                    }, {
                        name: 'Current round',
                        align: 'right',
                    }, {
                        name: 'Successful rounds',
                        align: 'right',
                    }, {
                        name: 'Relayer since, UTC',
                        align: 'right',
                    }]}
                    rows={[{
                        link: '/relayers/123',
                        cells: [
                            1,
                            <UserCard address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1" />,
                            formattedAmount(12040000000, 9, true, true),
                            <Status
                                state="success"
                                status="active"
                            />,
                            <Status
                                state="fail"
                                status="no"
                            />,
                            <Rounds
                                amount={10}
                                total={100}
                            />,
                            dateFormat(new Date().getTime()),
                        ],
                    }]}
                />

                <Pagination
                    limit={100}
                    current={1}
                    onSubmit={() => {}}
                />
            </div>
        </Section>
    )
}
