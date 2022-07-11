import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Description, Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { useVotingContext } from '@/modules/Governance/providers'
import { formattedAmount, formattedTokenAmount } from '@/utils'

export function UserStats(): JSX.Element {
    const intl = useIntl()
    const voting = useVotingContext()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

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

            <Observer>
                {() => (
                    <div className="tiles">
                        <DataCard
                            title={intl.formatMessage({
                                id: 'USER_VOTES_POWER',
                            })}
                            value={voting.votingPower && voting.tokenDecimals
                                ? formattedTokenAmount(voting.votingPower, voting.tokenDecimals)
                                : noValue}
                        />
                        <DataCard
                            title={intl.formatMessage({
                                id: 'USER_VOTES_WEIGHT',
                            })}
                            value={voting.votingWeight
                                ? `${formattedAmount(voting.votingWeight)}%`
                                : noValue}
                        />
                        <DataCard
                            title={intl.formatMessage({
                                id: 'USER_VOTES_VOTED',
                            })}
                            value={voting.votesCount || noValue}
                        />
                    </div>
                )}
            </Observer>
        </Section>
    )
}
