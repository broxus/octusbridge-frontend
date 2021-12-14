import * as React from 'react'

import { Section, Title } from '@/components/common/Section'
import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'

export function RoundInformation(): JSX.Element {
    return (
        <Section>
            <Title>Information</Title>

            <div className="tiles">
                <DataCard
                    title="Your rank"
                    value="72/100"
                >
                    <TvlChange
                        size="small"
                        changesDirection={-1}
                        priceChange="0.5"
                    />
                </DataCard>

                <DataCard
                    title="Your stake, BRIDGE"
                    value="240 000.00"
                />

                <DataCard
                    title="Your unfrozen stake, BRIDGE"
                    value="80 000.00"
                    hint="Will be available in next round"
                />

                <DataCard
                    title="Total relayers"
                    value="147"
                />

                <DataCard
                    title="Minimum stake in round, Bridge"
                    value="80 000.00"
                />

                <DataCard
                    title="Average stake in round, Bridge"
                    value="160 000.00"
                />
            </div>
        </Section>
    )
}
