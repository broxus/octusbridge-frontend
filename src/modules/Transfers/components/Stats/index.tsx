import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { TvlChange } from '@/components/common/TvlChange'
import { Section, Title } from '@/components/common/Section'
import { TransfersChart } from '@/modules/Transfers/components/Chart'
import { useTransfersStatsContext } from '@/modules/Transfers/providers'
import { error, formattedAmount } from '@/utils'

export function TransfersStats(): JSX.Element {
    const intl = useIntl()
    const { stats } = useTransfersStatsContext()

    const fetch = async () => {
        try {
            await stats.fetch()
        }
        catch (e) {
            error(e)
        }
    }

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    React.useEffect(() => {
        fetch()
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
                                value={stats.totalCount
                                    ? formattedAmount(stats.totalCount, 0)
                                    : noValue}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'TRANSFERS_STATS_VOLUME_24H',
                                })}
                                value={stats.mainInfo?.volume24hUsdt
                                    ? `$${formattedAmount(stats.mainInfo.volume24hUsdt, 0, true, true)}`
                                    : noValue}
                            >
                                {stats.mainInfo?.volume24hUsdtChange && (
                                    <TvlChange
                                        size="small"
                                        changesDirection={stats.mainInfo?.volume24hUsdtChange
                                            ? parseInt(stats.mainInfo?.volume24hUsdtChange, 10)
                                            : undefined}
                                        priceChange={stats.mainInfo?.volume24hUsdtChange
                                            ? formattedAmount(stats.mainInfo.volume24hUsdtChange, 0, true, true)
                                            : noValue}
                                    />
                                )}
                            </DataCard>
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'TRANSFERS_STATS_VOLUME_7D',
                                })}
                                value={stats.mainInfo?.volume7dUsdt
                                    ? `$${formattedAmount(stats.mainInfo.volume7dUsdt, 0, true, true)}`
                                    : noValue}
                            >
                                {stats.mainInfo?.volume7dUsdtChange && (
                                    <TvlChange
                                        size="small"
                                        changesDirection={stats.mainInfo?.volume7dUsdtChange
                                            ? parseInt(stats.mainInfo?.volume7dUsdtChange, 10)
                                            : undefined}
                                        priceChange={stats.mainInfo?.volume7dUsdtChange
                                            ? formattedAmount(stats.mainInfo.volume7dUsdtChange, 0, true, true)
                                            : noValue}
                                    />
                                )}
                            </DataCard>
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'TRANSFERS_STATS_FROM',
                                })}
                                value={stats.mainInfo?.fromEverscaleUsdt
                                    ? `$${formattedAmount(stats.mainInfo.fromEverscaleUsdt, 0, true, true)}`
                                    : noValue}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'TRANSFERS_STATS_TO',
                                })}
                                value={stats.mainInfo?.toEverscaleUsdt
                                    ? `$${formattedAmount(stats.mainInfo.toEverscaleUsdt, 0, true, true)}`
                                    : noValue}
                            />
                        )}
                    </Observer>
                </div>

                <div className="board__main">
                    <TransfersChart />
                </div>
            </div>
        </Section>
    )
}
