import * as React from 'react'
import { useIntl } from 'react-intl'

import { Description, Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { TvlChange } from '@/components/common/TvlChange'

export function UserVotes(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'USER_VOTES_TITLE',
                })}
            </Title>
            <Description>
                {intl.formatMessage({
                    id: 'USER_VOTES_DESC',
                })}
            </Description>

            <div className="tiles tiles_fourth">
                <DataCard
                    title={intl.formatMessage({
                        id: 'USER_VOTES_POWER',
                    })}
                    value="17 142.14"
                />
                <DataCard
                    title={intl.formatMessage({
                        id: 'USER_VOTES_WEIGHT',
                    })}
                    value="4.12%"
                />
                <DataCard
                    title={intl.formatMessage({
                        id: 'USER_VOTES_RANK',
                    })}
                    value="24"
                >
                    <TvlChange
                        changesDirection={1}
                        priceChange="10"
                        size="small"
                        showPercent={false}
                    />
                </DataCard>
                <DataCard
                    title={intl.formatMessage({
                        id: 'USER_VOTES_VOTED',
                    })}
                    value="10"
                />
            </div>
        </Section>
    )
}
