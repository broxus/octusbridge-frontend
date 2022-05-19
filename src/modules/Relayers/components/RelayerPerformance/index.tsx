import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
// import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { dateRelative, formattedAmount } from '@/utils'
import { useRelayInfoContext } from '@/modules/Relayers/providers'

import './index.scss'

export function RelayerPerformance(): JSX.Element | null {
    const intl = useIntl()
    const { relayInfo } = useRelayInfoContext()
    // const [chartTypeId, setChartTypeId] = React.useState('stake')
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'RELAYER_PERFORMANCE_TITLE',
                })}
            </Title>

            <div className="tiles tiles_third">
                <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_STAKE',
                    })}
                    value={relayInfo?.frozenStake
                        ? formattedAmount(relayInfo?.frozenStake, undefined, { target: 'token' })
                        : noValue}
                >
                    {relayInfo?.untilFrozen && (
                        intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_DEFROST',
                        }, {
                            value: dateRelative(relayInfo.untilFrozen),
                        })
                    )}
                </DataCard>

                {/* <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_LATEST_REWARD',
                    })}
                    value={relayInfo?.latestReward
                        ? formattedAmount(relayInfo.latestReward, undefined, { target: 'token' })
                        : noValue}
                /> */}

                {/* <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_TOTAL_REWARD',
                    })}
                    value={relayInfo?.totalReward
                        ? formattedAmount(relayInfo.totalReward, undefined, { target: 'token' })
                        : noValue}
                /> */}

                <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_SUCCESS_ROUNDS',
                    })}
                    value={relayInfo?.successfulRounds && relayInfo?.totalCountRounds
                        ? `${relayInfo?.successfulRounds}/${relayInfo?.totalCountRounds}`
                        : noValue}
                />

                <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_EVENTS_SHARE',
                    })}
                    value={relayInfo?.potentialTotalConfirmed && relayInfo.relayTotalConfirmed
                        ? `${((100 * relayInfo.relayTotalConfirmed) / relayInfo.potentialTotalConfirmed).toFixed(2)}%`
                        : noValue}
                >
                    {relayInfo?.potentialTotalConfirmed && relayInfo.relayTotalConfirmed
                        ? `${relayInfo.relayTotalConfirmed}/${relayInfo.potentialTotalConfirmed}`
                        : null}
                </DataCard>
            </div>

            {/* <div className="board">
                <div className="board__side">

                </div>

                <div className="board__main">
                    <ChartLayout
                        showSoon
                        chartTypeId={chartTypeId}
                        onChangeType={setChartTypeId}
                        chartTypes={[{
                            id: 'stake',
                            label: intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_CHART_STAKE',
                            }),
                        }, {
                            id: 'reward',
                            label: intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_CHART_REWARD',
                            }),
                        }, {
                            id: 'events',
                            label: intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_CHART_EVENTS',
                            }),
                        }]}
                    />
                </div>
            </div> */}
        </Section>
    )
}
