import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
// import { Pagination } from '@/components/common/Pagination'
import { Align, Table } from '@/components/common/Table'

import './index.scss'

export function StakingRounds(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Title size="lg">
                {intl.formatMessage({
                    id: 'STAKING_REWARD_ROUNDS_TITLE',
                })}
            </Title>

            <div className="card card--flat card--small">
                <Table
                    className="staking-rounds"
                    cols={[{
                        name: intl.formatMessage({
                            id: 'STAKING_REWARD_ROUNDS_ID',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_REWARD_ROUNDS_START',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_REWARD_ROUNDS_END',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_REWARD_ROUNDS_SHARE',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_REWARD_ROUNDS_REWARD',
                        }),
                        align: Align.right,
                    }]}
                    rows={[{
                        cells: [
                            1,
                            'Jan 17, 2022, 16:33',
                            'Jan 20, 2022, 16:33',
                            '12%',
                            '0.12 BRIDGE',
                        ],
                    }]}
                    body={(
                        <div className="staking-rounds__soon">
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                        </div>
                    )}
                />

                {/* <Pagination
                    page={1}
                    totalCount={100}
                    totalPages={10}
                /> */}
            </div>
        </Section>
    )
}
