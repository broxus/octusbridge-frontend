import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { CommonCharts } from '@/modules/Staking/components/CommonCharts'
import { useExplorerContext } from '@/modules/Staking/providers/ExplorerProvider'
import { error, formattedAmount } from '@/utils'

export function CommonStats(): JSX.Element | null {
    const intl = useIntl()
    const { mainInfo } = useExplorerContext()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await mainInfo.fetch()
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_COMMON_STATS_TITLE',
                    })}
                </Title>

                <Actions>
                    <Button size="md" type="secondary" link="/relayers/create">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_CREATE',
                        })}
                    </Button>
                </Actions>
            </Header>

            <div className="board">
                <div className="board__side">
                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'STAKING_STATS_TVL',
                                })}
                                value={mainInfo.tvl
                                    ? formattedAmount(mainInfo.tvl)
                                    : noValue}
                            >
                                {mainInfo.tvlChange && (
                                    <TvlChange
                                        changesDirection={parseInt(mainInfo.tvlChange, 10)}
                                        priceChange={formattedAmount(mainInfo.tvlChange)}
                                        size="small"
                                    />
                                )}
                            </DataCard>
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'STAKING_STATS_REWARD',
                                })}
                                // value={mainInfo.reward30d ? formattedAmount(mainInfo.reward30d) : noValue}
                            >
                                {intl.formatMessage({
                                    id: 'SOON',
                                })}
                                {/* {mainInfo.reward30dChange && (
                                    <TvlChange
                                        changesDirection={parseInt(mainInfo.reward30dChange, 10)}
                                        priceChange={formattedAmount(mainInfo.reward30dChange)}
                                        size="small"
                                    />
                                )} */}
                            </DataCard>
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'STAKING_STATS_APR',
                                })}
                                // value={mainInfo.averageApr ? `${mainInfo.averageApr}%` : noValue}
                            >
                                {intl.formatMessage({
                                    id: 'SOON',
                                })}
                            </DataCard>
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'STAKING_STATS_STAKEHOLDERS',
                                })}
                                value={mainInfo.stakeholders !== undefined ? mainInfo.stakeholders : noValue}
                            />
                        )}
                    </Observer>
                </div>

                <div className="board__main">
                    <CommonCharts />
                </div>
            </div>
        </Section>
    )
}
