import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Section, Title } from '@/components/common/Section'
// import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
// import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { useRoundInfoContext } from '@/modules/Relayers/providers'
import { formattedTokenAmount } from '@/utils'

export function RelayersOverview(): JSX.Element {
    const intl = useIntl()
    // const [chartTypeId, setChartTypeId] = React.useState('stake')
    const roundInfo = useRoundInfoContext()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    React.useEffect(() => {
        roundInfo.fetch({})
    }, [])

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'RELAYERS_OVERVIEW_TITLE',
                })}
            </Title>

            <div className="tiles tiles_third">
                <Observer>
                    {() => (
                        <DataCard
                            value={roundInfo.info?.totalStake !== undefined
                                ? formattedTokenAmount(roundInfo.info.totalStake)
                                : noValue}
                            title={intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_FROZEN',
                            })}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            value={roundInfo.info?.relaysCount !== undefined
                                ? roundInfo.info?.relaysCount
                                : noValue}
                            title={intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_RELAYERS',
                            })}
                        />
                    )}
                </Observer>

                {/* <DataCard
                    hint={intl.formatMessage({
                        id: 'SOON',
                    })}
                    title={intl.formatMessage({
                        id: 'RELAYERS_OVERVIEW_EVENTS',
                    })}
                /> */}

                <Observer>
                    {() => (
                        <DataCard
                            value={roundInfo.info?.averageRelayStake !== undefined
                                ? formattedTokenAmount(roundInfo.info.averageRelayStake)
                                : noValue}
                            title={intl.formatMessage({
                                id: 'RELAYERS_OVERVIEW_AVERAGE',
                            })}
                        >
                            {/* {roundInfo.info?.averageRelayStakeChange && (
                                <TvlChange
                                    size="small"
                                    changesDirection={parseFloat(roundInfo.info?.averageRelayStakeChange)}
                                    priceChange={Math.abs(parseFloat(roundInfo.info?.averageRelayStakeChange))}
                                />
                            )} */}
                        </DataCard>
                    )}
                </Observer>
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
