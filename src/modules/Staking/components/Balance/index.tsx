import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'
import BigNumber from 'bignumber.js'

import { Tab, Tabs } from '@/components/common/Tabs'
import { Section, Title } from '@/components/common/Section'
import { AmountField } from '@/components/common/AmountField'
import { CardLayout } from '@/modules/Staking/components/Balance/CardLayout'
import { FormLayout } from '@/modules/Staking/components/Balance/FormLayout'
import { useCurrentUserContext } from '@/modules/Staking/providers/CurrentUserProvider'
import { formattedAmount } from '@/utils'

type Tabs = 'redeem' | 'claim'

export function StakingBalance(): JSX.Element {
    const intl = useIntl()
    const {
        accountData, redeemForm, stakingForm, claimForm,
    } = useCurrentUserContext()

    const [activeTab, setActiveTab] = React.useState<Tabs>('claim')

    const changeTabFn = (tab: Tabs) => () => setActiveTab(tab)

    return (
        <Section>
            <Title size="lg">
                {intl.formatMessage({
                    id: 'STAKING_BALANCE_TITLE',
                })}
            </Title>

            <div className="tiles tiles_twice">
                <CardLayout
                    theme="green"
                    title={intl.formatMessage({
                        id: 'STAKING_BALANCE_STAKE',
                    })}
                    desc={intl.formatMessage({
                        id: 'STAKING_BALANCE_STAKE_DESC',
                    })}
                >
                    <Observer>
                        {() => (
                            <FormLayout
                                loading={stakingForm.isLoading}
                                disabled={!stakingForm.isValid || stakingForm.isLoading}
                                onSubmit={stakingForm.submit}
                                hint={intl.formatMessage({
                                    id: 'STAKING_BALANCE_WALLET_BALANCE',
                                }, {
                                    /* eslint-disable no-nested-ternary */
                                    amount: accountData.hasAccount === undefined
                                        ? ''
                                        : accountData.hasAccount === false
                                            ? '0'
                                            : formattedAmount(stakingForm.balance, accountData.tokenDecimals),
                                    symbol: accountData.hasAccount === undefined
                                        ? ''
                                        : accountData.tokenSymbol,
                                })}
                                action={intl.formatMessage({
                                    id: 'STAKING_BALANCE_STAKE',
                                })}
                            >
                                <AmountField
                                    isValid={!stakingForm.isLoading && new BigNumber(stakingForm.amount).gt(0)
                                        ? stakingForm.isValid
                                        : true}
                                    value={stakingForm.amount}
                                    decimals={accountData.tokenDecimals}
                                    maxValue={stakingForm.balance}
                                    disabled={stakingForm.isLoading}
                                    onChange={stakingForm.setAmount}
                                    onClickMax={stakingForm.setAmountShifted}
                                    placeholder={intl.formatMessage({
                                        id: 'STAKING_BALANCE_AMOUNT',
                                    })}
                                />
                            </FormLayout>
                        )}
                    </Observer>
                </CardLayout>

                <CardLayout
                    theme="red"
                    title={intl.formatMessage({
                        id: 'STAKING_BALANCE_REDEEM',
                    })}
                    desc={(
                        <Tabs>
                            <Tab
                                active={activeTab === 'claim'}
                                onClick={changeTabFn('claim')}
                            >
                                {intl.formatMessage({
                                    id: 'STAKING_BALANCE_CLAIM',
                                })}
                            </Tab>
                            <Tab
                                active={activeTab === 'redeem'}
                                onClick={changeTabFn('redeem')}
                            >
                                {intl.formatMessage({
                                    id: 'STAKING_BALANCE_REDEEM',
                                })}
                            </Tab>
                        </Tabs>
                    )}
                >
                    {activeTab === 'redeem' && (
                        <Observer>
                            {() => (
                                <FormLayout
                                    loading={redeemForm.isLoading}
                                    disabled={!redeemForm.isValid || redeemForm.isLoading}
                                    onSubmit={redeemForm.submit}
                                    hint={intl.formatMessage({
                                        id: 'STAKING_BALANCE_STAKE_BALANCE',
                                    }, {
                                        /* eslint-disable no-nested-ternary */
                                        amount: accountData.hasAccount === undefined
                                            ? ''
                                            : accountData.hasAccount === false
                                                ? '0'
                                                : formattedAmount(redeemForm.balance, accountData.tokenDecimals),
                                        symbol: accountData.hasAccount === undefined
                                            ? ''
                                            : accountData.tokenSymbol,
                                    })}
                                    action={intl.formatMessage({
                                        id: 'STAKING_BALANCE_REDEEM',
                                    })}
                                >
                                    <AmountField
                                        isValid={!redeemForm.isLoading && new BigNumber(redeemForm.amount).gt(0)
                                            ? redeemForm.isValid
                                            : true}
                                        value={redeemForm.amount}
                                        decimals={accountData.tokenDecimals}
                                        maxValue={redeemForm.balance}
                                        disabled={redeemForm.isLoading}
                                        onChange={redeemForm.setAmount}
                                        onClickMax={redeemForm.setAmountShifted}
                                        placeholder={intl.formatMessage({
                                            id: 'STAKING_BALANCE_AMOUNT',
                                        })}
                                    />
                                </FormLayout>
                            )}
                        </Observer>
                    )}

                    {activeTab === 'claim' && (
                        <Observer>
                            {() => (
                                <FormLayout
                                    loading={claimForm.isLoading}
                                    disabled={!claimForm.isValid || claimForm.isLoading}
                                    onSubmit={claimForm.submit}
                                    hint={accountData.lockedReward && accountData.tokenDecimals
                                        && new BigNumber(accountData.lockedReward).gt(0)
                                        ? intl.formatMessage({
                                            id: 'STAKING_BALANCE_LOCKED_REWARD',
                                        }, {
                                            amount: formattedAmount(
                                                accountData.lockedReward,
                                                accountData.tokenDecimals,
                                            ),
                                            symbol: accountData.tokenSymbol,
                                        })
                                        : undefined}
                                    action={intl.formatMessage({
                                        id: 'STAKING_BALANCE_CLAIM',
                                    })}
                                >
                                    <AmountField
                                        readOnly
                                        value={claimForm.balance && accountData.tokenDecimals
                                            ? formattedAmount(claimForm.balance, accountData.tokenDecimals)
                                            : ''}
                                        disabled={claimForm.isLoading}
                                        displayMaxButton={false}
                                    />
                                </FormLayout>
                            )}
                        </Observer>
                    )}
                </CardLayout>
            </div>
        </Section>
    )
}
