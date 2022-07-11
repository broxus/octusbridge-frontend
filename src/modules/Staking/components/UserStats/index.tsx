import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { Button } from '@/components/common/Button'
// import { TvlChange } from '@/components/common/TvlChange'
import { DataCard } from '@/components/common/DataCard'
import { useUserContext } from '@/modules/Staking/providers/UserProvider'
import { error, formattedTokenAmount } from '@/utils'

type Props = {
    userAddress: string;
    showActions?: boolean;
}

export function UserStats({
    userAddress,
    showActions = true,
}: Props): JSX.Element | null {
    const { userInfo } = useUserContext()
    const intl = useIntl()
    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await userInfo.fetch({ userAddress })
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
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_USER_STATS_USER',
                    })}
                </Title>

                {showActions && (
                    <Actions>
                        <Button size="md" type="secondary" link="/relayers/create">
                            {intl.formatMessage({
                                id: 'STAKING_STATS_CREATE',
                            })}
                        </Button>
                    </Actions>
                )}
            </Header>

            <div className="tiles tiles_fourth">
                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'STAKING_STATS_TVL',
                            })}
                            value={userInfo.userTvl
                                ? formattedTokenAmount(userInfo.userTvl)
                                : noValue}
                        >
                            {/* {userInfo.userTvlChange && (
                                <TvlChange
                                    changesDirection={parseInt(userInfo.userTvlChange, 10)}
                                    priceChange={formattedAmount(userInfo.userTvlChange)}
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
                                id: 'STAKING_STATS_FROZEN',
                            })}
                            value={userInfo.userFrozenStake
                                ? formattedTokenAmount(userInfo.userFrozenStake)
                                : noValue}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'STAKING_STATS_REWARD',
                            })}
                            // value={userInfo.user30dReward
                            //     ? formattedAmount(userInfo.user30dReward, 0, true, true)
                            //     : noValue}
                        >
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                            {/* {userInfo.user30dRewardChange && (
                                <TvlChange
                                    changesDirection={parseInt(userInfo.user30dRewardChange, 10)}
                                    priceChange={formattedAmount(userInfo.user30dRewardChange)}
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
                            // value={userInfo.averageApr
                            //     ? `${formattedAmount(userInfo.averageApr)}%`
                            //     : noValue}
                        >
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                        </DataCard>
                    )}
                </Observer>
            </div>
        </Section>
    )
}
