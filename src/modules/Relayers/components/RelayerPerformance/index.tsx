import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { ChartLayout } from '@/modules/Chart/components/ChartLayout'
import { RelayerStoreContext } from '@/modules/Relayers/providers/RelayerStoreProvider'
import { dateRelative, formattedAmount } from '@/utils'

import './index.scss'

export function RelayerPerformance(): JSX.Element | null {
    const intl = useIntl()
    const relayer = React.useContext(RelayerStoreContext)

    if (!relayer) {
        return null
    }

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'RELAYER_PERFORMANCE_TITLE',
                })}
            </Title>

            <div className="board">
                <div className="board__side">
                    <DataCard
                        title={intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_STAKE',
                        })}
                        value={relayer.frozenStake && relayer.stakeTokenDecimals !== undefined
                            ? formattedAmount(relayer.frozenStake, relayer.stakeTokenDecimals)
                            : null}
                    >
                        {relayer.defrostTime !== undefined && (
                            intl.formatMessage({
                                id: 'RELAYER_PERFORMANCE_DEFROST',
                            }, {
                                value: dateRelative(relayer.defrostTime),
                            })
                        )}
                    </DataCard>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_LATEST_REWARD',
                        })}
                        value={relayer.latestReward && relayer.stakeTokenDecimals !== undefined
                            ? formattedAmount(relayer.latestReward, relayer.stakeTokenDecimals)
                            : null}
                    />

                    <DataCard
                        title={intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_TOTAL_REWARD',
                        })}
                        value={relayer.totalReward && relayer.stakeTokenDecimals !== undefined
                            ? formattedAmount(relayer.totalReward, relayer.stakeTokenDecimals)
                            : null}
                    />

                    <DataCard
                        title={intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_SUCCESS_ROUNDS',
                        })}
                        value={relayer.successRounds && relayer.totalRounds
                            ? intl.formatMessage({
                                id: 'RELAYER_PERFORMANCE_ROUNDS',
                            }, {
                                success: relayer.successRounds,
                                total: relayer.totalRounds,
                            })
                            : null}
                    >
                        {relayer.successRoundsRate && `${relayer.successRoundsRate}%`}
                    </DataCard>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'RELAYER_PERFORMANCE_EVENTS',
                        })}
                        value={relayer.dayEvents !== undefined
                            ? formattedAmount(relayer.dayEvents)
                            : null}
                    />
                </div>

                <div className="board__main">
                    <ChartLayout />
                </div>
            </div>
        </Section>
    )
}
