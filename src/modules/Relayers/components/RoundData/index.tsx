import * as React from 'react'
import { useIntl } from 'react-intl'

import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { EventsDistribution } from '@/modules/Relayers/components/EventsDistribution'

export function RoundData(): JSX.Element | null {
    const intl = useIntl()

    return (
        <div className="board">
            <div className="board__side">
                <DataCard
                    title={intl.formatMessage({
                        id: 'ROUND_STATISTIC_BIDDING_PANEL_TITLE',
                    })}
                    value={intl.formatMessage({
                        id: 'ROUND_STATISTIC_BIDDING_PANEL_VALUE',
                    }, {
                        current: '19',
                        total: '100',
                    })}
                    linkUrl="/relayers/bidding-round/123"
                    linkTitle={intl.formatMessage({
                        id: 'ROUND_STATISTIC_BIDDING_PANEL_LINK',
                    })}
                >
                    <TvlChange
                        size="small"
                        changesDirection={-1}
                        priceChange="5"
                    />
                </DataCard>

                <DataCard
                    title={intl.formatMessage({
                        id: 'ROUND_STATISTIC_REWARD_PANEL_TITLE',
                    })}
                    value={null}
                >
                    {intl.formatMessage({
                        id: 'PERCENT',
                    }, {
                        value: '0.0',
                    })}
                </DataCard>

                <DataCard
                    title={intl.formatMessage({
                        id: 'ROUND_STATISTIC_STAKE_PANEL_TITLE',
                    })}
                    value="240 000.00"
                />

                <DataCard
                    title={intl.formatMessage({
                        id: 'ROUND_STATISTIC_EVENTS_PANEL_TITLE',
                    })}
                    value="657 521"
                >
                    <TvlChange
                        size="small"
                        changesDirection={1}
                        priceChange="8.81"
                    />
                </DataCard>
            </div>

            <div className="board__main">
                <EventsDistribution />
            </div>
        </div>
    )
}
