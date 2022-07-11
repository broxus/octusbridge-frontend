import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { DataCard, DataCardStatus } from '@/components/common/DataCard'
// import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { dateRelative, formattedTokenAmount } from '@/utils'
import { useRelayInfoContext } from '@/modules/Relayers/providers'
import { getEventsShare, getRelayStatus, RelayStatus } from '@/modules/Relayers/utils'

import './index.scss'

const mapRelayStatusToDataCard = (val: RelayStatus): DataCardStatus => {
    switch (val) {
        case RelayStatus.Success:
            return DataCardStatus.Success
        case RelayStatus.Warning:
            return DataCardStatus.Warning
        default:
            return DataCardStatus.Fail
    }
}

function RelayerPerformanceInner(): JSX.Element | null {
    const intl = useIntl()
    const { relayInfo } = useRelayInfoContext()
    // const [chartTypeId, setChartTypeId] = React.useState('stake')
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const eventsShare = relayInfo
        ? getEventsShare(
            relayInfo?.relayTotalConfirmed,
            relayInfo?.potentialTotalConfirmed,
        )
        : undefined

    const relayerStatus = eventsShare
        ? getRelayStatus(eventsShare)
        : undefined

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
                        ? formattedTokenAmount(relayInfo?.frozenStake)
                        : noValue}
                >
                    {relayInfo?.untilFrozen ? (
                        intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_DEFROST',
                        }, {
                            value: dateRelative(relayInfo.untilFrozen),
                        })
                    ) : (
                        '\u200B'
                    )}
                </DataCard>

                {/* <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_LATEST_REWARD',
                    })}
                    value={relayInfo?.latestReward
                        ? formattedTokenAmount(relayInfo.latestReward)
                        : noValue}
                /> */}

                {/* <DataCard
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_TOTAL_REWARD',
                    })}
                    value={relayInfo?.totalReward
                        ? formattedTokenAmount(relayInfo.totalReward)
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
                    status={relayerStatus
                        ? mapRelayStatusToDataCard(relayerStatus)
                        : undefined}
                    value={eventsShare ? `${eventsShare}%` : noValue}
                    title={intl.formatMessage({
                        id: 'RELAYER_PERFORMANCE_EVENTS_SHARE',
                    })}
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

export const RelayerPerformance = observer(RelayerPerformanceInner)
