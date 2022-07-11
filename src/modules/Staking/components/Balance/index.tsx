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
import { formattedAmount, formattedTokenAmount } from '@/utils'
import { DexConstants } from '@/misc'

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
                                disabled={!stakingForm.amountValid || !stakingForm.gasValid || stakingForm.isLoading}
                                onSubmit={stakingForm.submit}
                                hint={intl.formatMessage({
                                    id: 'STAKING_BALANCE_WALLET_BALANCE',
                                }, {
                                    /* eslint-disable no-nested-ternary */
                                    amount: stakingForm.balance
                                        ? formattedTokenAmount(
                                            stakingForm.balance,
                                            accountData.tokenDecimals,
                                        )
                                        : '0',
                                    symbol: accountData.tokenSymbol,
                                })}
                                action={intl.formatMessage({
                                    id: 'STAKING_BALANCE_STAKE',
                                })}
                                error={stakingForm.amountValid && !stakingForm.gasValid
                                    ? intl.formatMessage({
                                        id: 'STAKING_BALANCE_GAS_ERROR',
                                    }, {
                                        gasAmount: formattedAmount(
                                            stakingForm.tonDepositAmount,
                                            DexConstants.CoinDecimals,
                                        ),
                                    })
                                    : undefined}
                            >
                                <AmountField
                                    isValid={!stakingForm.isLoading && new BigNumber(stakingForm.amount).gt(0)
                                        ? stakingForm.amountValid && stakingForm.gasValid
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
                                    disabled={!redeemForm.amountValid
                                        || !redeemForm.gasValid
                                        || redeemForm.hasCastedVotes !== false
                                        || redeemForm.isLoading}
                                    onSubmit={redeemForm.submit}
                                    hint={redeemForm.hasCastedVotes === true
                                        ? intl.formatMessage({
                                            id: 'USER_VOTE_UNLOCK_HINT',
                                        })
                                        : accountData.hasAccount === undefined
                                            ? ''
                                            : intl.formatMessage({
                                                id: 'STAKING_BALANCE_STAKE_BALANCE',
                                            }, {
                                                amount: accountData.hasAccount
                                                    ? formattedTokenAmount(
                                                        redeemForm.balance,
                                                        accountData.tokenDecimals,
                                                    )
                                                    : '0',
                                                symbol: accountData.tokenSymbol,
                                            })}
                                    action={intl.formatMessage({
                                        id: 'STAKING_BALANCE_REDEEM',
                                    })}
                                    error={redeemForm.amountValid && !redeemForm.gasValid
                                        ? intl.formatMessage({
                                            id: 'STAKING_BALANCE_GAS_ERROR',
                                        }, {
                                            gasAmount: formattedAmount(
                                                redeemForm.tonDepositAmount,
                                                DexConstants.CoinDecimals,
                                            ),
                                        })
                                        : undefined}
                                >
                                    <AmountField
                                        isValid={!redeemForm.isLoading && new BigNumber(redeemForm.amount).gt(0)
                                            ? redeemForm.amountValid && redeemForm.gasValid
                                            : true}
                                        value={redeemForm.amount}
                                        decimals={accountData.tokenDecimals}
                                        maxValue={redeemForm.balance}
                                        disabled={redeemForm.isLoading || redeemForm.hasCastedVotes !== false}
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
                                    disabled={claimForm.isLoading || !claimForm.isEnabled}
                                    onSubmit={claimForm.submit}
                                    hint={intl.formatMessage({
                                        id: 'STAKING_BALANCE_CLAIM_DISABLED',
                                    })}
                                    // hint={accountData.lockedReward && accountData.tokenDecimals
                                    //     && new BigNumber(accountData.lockedReward).gt(0)
                                    //     ? intl.formatMessage({
                                    //         id: 'STAKING_BALANCE_LOCKED_REWARD',
                                    //     }, {
                                    //         amount: formattedTokenAmount(
                                    //             accountData.lockedReward,
                                    //             accountData.tokenDecimals,
                                    //         ),
                                    //         symbol: accountData.tokenSymbol,
                                    //     })
                                    //     : undefined}
                                    action={intl.formatMessage({
                                        id: 'STAKING_BALANCE_CLAIM',
                                    })}
                                    error={claimForm.amountValid && !claimForm.gasValid
                                        ? intl.formatMessage({
                                            id: 'STAKING_BALANCE_GAS_ERROR',
                                        }, {
                                            gasAmount: formattedAmount(
                                                claimForm.tonDepositAmount,
                                                DexConstants.CoinDecimals,
                                            ),
                                        })
                                        : undefined}
                                >
                                    <AmountField
                                        readOnly
                                        value={claimForm.balance && accountData.tokenDecimals
                                            ? formattedAmount(
                                                claimForm.balance,
                                                accountData.tokenDecimals,
                                                { preserve: true },
                                            )
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
