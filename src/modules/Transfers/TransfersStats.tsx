import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { Section, Title } from '@/components/common/Section'
import { TransfersChart } from '@/modules/Transfers/TransfersChart'
import { useTransfersStats } from '@/modules/Transfers/hooks/useTransfersStats'
import { formattedAmount } from '@/utils'

import './index.scss'

export function TransfersStats(): JSX.Element {
    const intl = useIntl()
    const transfersStats = useTransfersStats()

    React.useEffect(() => {
        transfersStats.fetch()
    }, [])

    return (
        <Section>
            <Title size="lg">
                {intl.formatMessage({
                    id: 'TRANSFERS_STATS_TITLE',
                })}
            </Title>

            <div className="board">
                <div className="board__side">
                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'TRANSFERS_STATS_COUNT',
                                })}
                                value={transfersStats.totalCount
                                    ? formattedAmount(transfersStats.totalCount)
                                    : intl.formatMessage({
                                        id: 'NO_VALUE',
                                    })}
                            />
                        )}
                    </Observer>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'TRANSFERS_STATS_VOLUME_24H',
                        })}
                    >
                        {intl.formatMessage({
                            id: 'SOON',
                        })}
                    </DataCard>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'TRANSFERS_STATS_VOLUME_7D',
                        })}
                    >
                        {intl.formatMessage({
                            id: 'SOON',
                        })}
                    </DataCard>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'TRANSFERS_STATS_FROM',
                        })}
                    >
                        {intl.formatMessage({
                            id: 'SOON',
                        })}
                    </DataCard>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'TRANSFERS_STATS_TO',
                        })}
                    >
                        {intl.formatMessage({
                            id: 'SOON',
                        })}
                    </DataCard>
                </div>

                <div className="board__main">
                    <TransfersChart />
                </div>
            </div>
        </Section>
    )
}
