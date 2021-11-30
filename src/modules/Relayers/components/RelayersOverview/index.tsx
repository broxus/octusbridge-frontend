import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { ChartLayout } from '@/modules/Chart/components/ChartLayout'

export function RelayersOverview(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'RELAYERS_OVERVIEW_TITLE',
                })}
            </Title>

            <div className="board">
                <div className="board__side">
                    <DataCard
                        title="Total frozen stakes, BRIDGE"
                        value="1 705 000.00"
                    >
                        <TvlChange
                            size="small"
                            changesDirection={-1}
                            priceChange="0.5"
                        />
                    </DataCard>

                    <DataCard
                        title="Active relayers"
                        value="100"
                    />

                    <DataCard
                        title="Total events, 24h"
                        value="113 025"
                    />

                    <DataCard
                        title="Average relayer stake, BRIDGE"
                        value="150 728.17"
                    />
                </div>

                <div className="board__main">
                    <ChartLayout />
                </div>
            </div>
        </Section>
    )
}
