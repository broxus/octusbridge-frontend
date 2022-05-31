import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { useRoundInfoContext } from '@/modules/Relayers/providers'
import { formatDigits, formattedAmount } from '@/utils'
import { TotalEventsByChainId } from '@/modules/Relayers/components/EventsDistribution/TotalEventsByChainId'

export function RoundData(): JSX.Element | null {
    const intl = useIntl()
    const roundInfo = useRoundInfoContext()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <div className="board">
            <div className="board__side">
                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'ROUND_STATISTIC_TOTAL_STAKE',
                            })}
                            value={roundInfo.info?.totalStake
                                ? formattedAmount(roundInfo.info?.totalStake)
                                : noValue}
                        >
                            {roundInfo.info?.totalStakeChange && (
                                <TvlChange
                                    hideZero
                                    size="small"
                                    changesDirection={parseFloat(roundInfo.info?.totalStakeChange)}
                                    priceChange={Math.abs(parseFloat(roundInfo.info?.totalStakeChange))}
                                />
                            )}
                        </DataCard>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'ROUND_STATISTIC_AVERAGE_RELAYER_STAKE',
                            })}
                            value={roundInfo.info?.averageRelayStake
                                ? formattedAmount(roundInfo.info?.averageRelayStake)
                                : noValue}
                        >
                            {roundInfo.info?.averageRelayStakeChange && (
                                <TvlChange
                                    hideZero
                                    size="small"
                                    changesDirection={parseFloat(roundInfo.info?.averageRelayStakeChange)}
                                    priceChange={Math.abs(parseFloat(roundInfo.info?.averageRelayStakeChange))}
                                />
                            )}
                        </DataCard>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'ROUND_STATISTIC_EVENTS_PANEL_TITLE',
                            })}
                            value={roundInfo.info?.eventsConfirmed
                                ? formatDigits(roundInfo.info?.eventsConfirmed)
                                : noValue}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'ROUND_STATISTIC_RELAYERS',
                            })}
                            value={roundInfo.info?.relaysCount
                                ? formatDigits(roundInfo.info?.relaysCount)
                                : noValue}
                        >
                            {roundInfo.info?.relaysCountChange && (
                                <TvlChange
                                    hideZero
                                    size="small"
                                    changesDirection={parseFloat(roundInfo.info?.relaysCountChange)}
                                    priceChange={Math.abs(parseFloat(roundInfo.info?.relaysCountChange))}
                                />
                            )}
                        </DataCard>
                    )}
                </Observer>
            </div>

            <div className="board__main">
                <Observer>
                    {() => (
                        <TotalEventsByChainId
                            isLoading={roundInfo.isLoading}
                            evmStats={roundInfo.info?.evmStats}
                        />
                    )}
                </Observer>
            </div>
        </div>
    )
}
