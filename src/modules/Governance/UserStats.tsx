import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Description, Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { useUserStats } from '@/modules/Governance/hooks'
import { formattedAmount } from '@/utils'

export function UserStats(): JSX.Element {
    const intl = useIntl()
    const userStats = useUserStats()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    React.useEffect(() => {
        if (userStats.isConnected) {
            userStats.init()
        }
        else {
            userStats.dispose()
        }
    }, [userStats.isConnected])

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
                            value={userStats.votingPower && userStats.tokenDecimals
                                ? formattedAmount(userStats.votingPower, userStats.tokenDecimals, true, true)
                                : noValue}
                        />
                        <DataCard
                            title={intl.formatMessage({
                                id: 'USER_VOTES_WEIGHT',
                            })}
                            value={userStats.votingWeight
                                ? `${userStats.votingWeight}%`
                                : noValue}
                        />
                        <DataCard
                            title={intl.formatMessage({
                                id: 'USER_VOTES_VOTED',
                            })}
                            value={userStats.proposalsVotedCount || noValue}
                        />
                    </div>
                )}
            </Observer>
        </Section>
    )
}
