import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { TvlChange } from '@/components/common/TvlChange'
import { Section, Title } from '@/components/common/Section'
import { TransfersChart } from '@/modules/Transfers/components/Chart'
import { useTransfersStatsContext } from '@/modules/Transfers/providers'
import {
    error,
    formatDigits,
    formattedAmount,
    parseCurrencyBillions,
} from '@/utils'

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
                                    ? formatDigits(stats.totalCount.toString())
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
                                    ? parseCurrencyBillions(stats.mainInfo.volume24hUsdt)
                                    : noValue}
                            >
                                {stats.mainInfo?.volume24hUsdtChange && (
                                    <TvlChange
                                        size="small"
                                        changesDirection={stats.mainInfo?.volume24hUsdtChange
                                            ? parseInt(stats.mainInfo?.volume24hUsdtChange, 10)
                                            : undefined}
                                        priceChange={stats.mainInfo?.volume24hUsdtChange
                                            ? formattedAmount(
                                                Math.abs(parseFloat(stats.mainInfo.volume24hUsdtChange)),
                                            )
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
                                    ? parseCurrencyBillions(stats.mainInfo.volume7dUsdt)
                                    : noValue}
                            >
                                {stats.mainInfo?.volume7dUsdtChange && (
                                    <TvlChange
                                        size="small"
                                        changesDirection={stats.mainInfo?.volume7dUsdtChange
                                            ? parseInt(stats.mainInfo?.volume7dUsdtChange, 10)
                                            : undefined}
                                        priceChange={stats.mainInfo?.volume7dUsdtChange
                                            ? formattedAmount(
                                                Math.abs(parseFloat(stats.mainInfo.volume7dUsdtChange)),
                                            )
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
                                    ? parseCurrencyBillions(stats.mainInfo.fromEverscaleUsdt)
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
                                    ? parseCurrencyBillions(stats.mainInfo.toEverscaleUsdt)
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
