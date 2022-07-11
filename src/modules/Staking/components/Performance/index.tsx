import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import {
    Actions,
    Header,
    Section,
    Title,
} from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { useCurrentUserContext } from '@/modules/Staking/providers'
import { formattedTokenAmount, parseCurrencyBillions } from '@/utils'

import './index.scss'

export function StakingPerformance(): JSX.Element {
    const intl = useIntl()
    const { accountData } = useCurrentUserContext()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_PERFORMANCE_TITLE',
                    })}
                </Title>

                <Actions>
                    <Button size="md" type="secondary" link="/relayers/create">
                        {intl.formatMessage({
                            id: 'STAKING_STATS_CREATE',
                        })}
                    </Button>
                </Actions>
            </Header>

            <div className="tiles">
                <div className="card card--flat card--small">
                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_BALANCE',
                            })}
                        </div>
                        <Observer>
                            {() => (
                                <div className="staking-performance-card__value">
                                    {accountData.tokenStakingBalanceUsd
                                        ? parseCurrencyBillions(accountData.tokenStakingBalanceUsd)
                                        : noValue}
                                </div>
                            )}
                        </Observer>
                    </div>

                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_TOKEN_BALANCE',
                            })}
                        </div>
                        <Observer>
                            {() => (
                                <div className="staking-performance-card__value staking-performance-card__value_small">
                                    {accountData.tokenStakingBalance && accountData.tokenDecimals
                                        ? formattedTokenAmount(
                                            accountData.tokenStakingBalance,
                                            accountData.tokenDecimals,
                                        )
                                        : noValue}
                                </div>
                            )}
                        </Observer>
                    </div>

                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_SHARE',
                            })}
                        </div>
                        <div className="staking-performance-card__value staking-performance-card__value_soon">
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                        </div>
                    </div>
                </div>

                <div className="card card--flat card--small">
                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_HISTORY_BALANCE',
                            })}
                        </div>
                        <div className="staking-performance-card__value staking-performance-card__value_soon">
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                        </div>
                    </div>

                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_HISTORY_BALANCE_TOKEN',
                            })}
                        </div>
                        <div className="staking-performance-card__value staking-performance-card__value_small">
                            {noValue}
                        </div>
                    </div>

                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_LAST_UPDATE',
                            })}
                        </div>
                        <div className="staking-performance-card__value staking-performance-card__value_small">
                            {noValue}
                        </div>
                    </div>
                </div>

                <div className="card card--flat card--small">
                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_REWARD_BALANCE',
                            })}
                        </div>
                        <Observer>
                            {() => (
                                <div className="staking-performance-card__value">
                                    {accountData.pendingRewardUsd
                                        ? parseCurrencyBillions(accountData.pendingRewardUsd)
                                        : noValue}
                                </div>
                            )}
                        </Observer>
                    </div>

                    <div className="staking-performance-card">
                        <div className="staking-performance-card__title">
                            {intl.formatMessage({
                                id: 'STAKING_PERFORMANCE_REWARD_TOKEN',
                            })}
                        </div>
                        <Observer>
                            {() => (
                                <div className="staking-performance-card__value staking-performance-card__value_small">
                                    {accountData.pendingReward && accountData.tokenDecimals
                                        ? formattedTokenAmount(
                                            accountData.pendingReward,
                                            accountData.tokenDecimals,
                                        )
                                        : noValue}
                                </div>
                            )}
                        </Observer>
                    </div>
                </div>
            </div>
        </Section>
    )
}
