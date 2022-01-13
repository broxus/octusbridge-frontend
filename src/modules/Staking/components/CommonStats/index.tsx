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
import { ExplorerStoreContext } from '@/modules/Staking/providers/ExplorerStoreProvider'
import { error, formattedAmount } from '@/utils'

export function CommonStats(): JSX.Element | null {
    const explorer = React.useContext(ExplorerStoreContext)

    if (!explorer) {
        return null
    }

    const intl = useIntl()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await explorer.fetchMainInfo()
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
                    <Button size="md" type="secondary" link="/airdrop">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_CLAIM',
                        })}
                    </Button>
                    <Button size="md" type="secondary" link="/staking/redeem">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_REDEEM',
                        })}
                    </Button>
                    <Button size="md" type="primary" link="/staking">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_STAKE',
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
                                value={explorer.tvl
                                    ? formattedAmount(explorer.tvl, 0, true, true)
                                    : noValue}
                            >
                                {explorer.tvlChange && (
                                    <TvlChange
                                        changesDirection={parseInt(explorer.tvlChange, 10)}
                                        priceChange={formattedAmount(explorer.tvlChange)}
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
                                // value={explorer.reward30d ? formattedAmount(explorer.reward30d) : noValue}
                            >
                                {intl.formatMessage({
                                    id: 'SOON',
                                })}
                                {/* {explorer.reward30dChange && (
                                    <TvlChange
                                        changesDirection={parseInt(explorer.reward30dChange, 10)}
                                        priceChange={formattedAmount(explorer.reward30dChange)}
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
                                // value={explorer.averageApr ? `${explorer.averageApr}%` : noValue}
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
                                value={explorer.stakeholders !== undefined ? explorer.stakeholders : noValue}
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
