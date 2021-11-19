import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TvlChange } from '@/components/common/TvlChange'
import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { LineChart } from '@/components/common/LineChart'

export function UserStats(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_USER_STATS_TITLE',
                    })}
                </Title>

                <Actions>
                    <Button size="md" type="secondary" link="/staking/redeem">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_REDEEM',
                        })}
                    </Button>
                    <Button size="md" type="secondary" link="/staking/create">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_CREATE',
                        })}
                    </Button>
                    <Button size="md" type="primary" link="/staking/redeem">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_STAKE',
                        })}
                    </Button>
                </Actions>
            </Header>

            <div className="board">
                <div className="board__side">
                    <DataCard
                        title="TVL, BRIDGE"
                        value="1 705 000.00"
                    >
                        <TvlChange
                            changesDirection={-1}
                            priceChange="10"
                            size="small"
                        />
                    </DataCard>
                    <DataCard
                        title="Frozen stake, BRIDGE"
                        value="100,025"
                    />
                    <DataCard
                        title="30d reward, BRIDGE"
                        value="35,768.1456"
                    >
                        <TvlChange
                            changesDirection={1}
                            priceChange="2.7"
                            size="small"
                        />
                    </DataCard>
                    <DataCard
                        title="Average APR"
                        value="5.2%"
                    />
                </div>
                <div className="board__main">
                    <LineChart
                        types={['TVL', 'APR', 'REWARD']}
                    />
                </div>
            </div>
        </Section>
    )
}
