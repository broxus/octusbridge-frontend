import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { UserStoreContext } from '@/modules/Staking/providers/UserStoreProvider'
import { error, formattedAmount } from '@/utils'

type Props = {
    title: string;
    userAddress: string;
}

export function UserStats({
    title,
    userAddress,
}: Props): JSX.Element | null {
    const user = React.useContext(UserStoreContext)

    if (!user) {
        return null
    }

    const intl = useIntl()
    const nullMessage = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await user.fetchUserInfo({ userAddress })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [userAddress])

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">{title}</Title>

                <Actions>
                    <Button size="md" type="secondary" link="/relayers/create">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_CREATE',
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

            <div className="tiles tiles_fourth">
                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'STAKING_STATS_TVL',
                            })}
                            value={user.userTvl ? formattedAmount(user.userTvl) : nullMessage}
                        >
                            {user.userTvlChange && (
                                <TvlChange
                                    changesDirection={parseInt(user.userTvlChange, 10)}
                                    priceChange={formattedAmount(user.userTvlChange)}
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
                                id: 'STAKING_STATS_FROZEN',
                            })}
                            value={user.userFrozenStake ? formattedAmount(user.userFrozenStake) : nullMessage}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'STAKING_STATS_REWARD',
                            })}
                            value={user.user30dReward ? formattedAmount(user.user30dReward) : nullMessage}
                        >
                            {user.user30dRewardChange && (
                                <TvlChange
                                    changesDirection={parseInt(user.user30dRewardChange, 10)}
                                    priceChange={formattedAmount(user.user30dRewardChange)}
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
                                id: 'STAKING_STATS_APR',
                            })}
                            value={user.averageApr ? `${user.averageApr}%` : nullMessage}
                        />
                    )}
                </Observer>
            </div>
        </Section>
    )
}
