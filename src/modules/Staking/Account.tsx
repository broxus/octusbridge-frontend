import * as React from 'react'
import { Observer, observer } from 'mobx-react-lite'
import { useRouteMatch } from 'react-router-dom'

import { AccountLayout } from '@/modules/Staking/components/AccountLayout'
import { AccountField } from '@/modules/Staking/components/AccountField'
import { AccountFee } from '@/modules/Staking/components/AccountFee'
import { AccountSubmit } from '@/modules/Staking/components/AccountSubmit'
import { useAccountData, useRedeemForm, useStakingForm } from '@/modules/Staking/hooks'
import { STAKING_LOCATION } from '@/modules/Staking/constants'
import { ActionType } from '@/modules/Staking/types'

function StakingAccountInner(): JSX.Element {
    const accountData = useAccountData()
    const stakingForm = useStakingForm(accountData)
    const redeemForm = useRedeemForm(accountData)
    const actionType = useRouteMatch(STAKING_LOCATION)?.isExact ? ActionType.Stake : ActionType.Redeem
    const currentForm = actionType === ActionType.Redeem ? redeemForm : stakingForm

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        currentForm.submit()
    }

    const init = async () => {
        if (accountData.isConnected) {
            await accountData.sync()
        }
        else {
            accountData.dispose()
        }
    }

    React.useEffect(() => {
        init()
    }, [actionType, accountData.isConnected])

    return (
        <AccountLayout>
            <form onSubmit={submit}>
                <Observer>
                    {() => (
                        <AccountField
                            isLoading={accountData.isLoading || currentForm.isLoading}
                            actionType={actionType}
                            balance={currentForm.balance}
                            tokenAddress={accountData.tokenAddress}
                            tokenSymbol={accountData.tokenSymbol}
                            tokenIcon={accountData.tokenIcon}
                            tokenDecimals={accountData.tokenDecimals}
                            amount={currentForm.amount}
                            onChangeAmount={currentForm.setAmount}
                        />
                    )}
                </Observer>

                <AccountFee
                    feeAmount={currentForm.tonDepositAmount}
                    tokenSymbol={accountData.tonTokenSymbol}
                    tokenDecimals={accountData.tonTokenDecimals}
                />

                <Observer>
                    {() => (
                        <AccountSubmit
                            isConnected={accountData.isConnected}
                            isLoading={accountData.isLoading || currentForm.isLoading}
                            amountIsValid={currentForm.isValid}
                            onClickConnect={accountData.connectToTonWallet}
                        />
                    )}
                </Observer>
            </form>
        </AccountLayout>
    )
}

export const StakingAccount = observer(StakingAccountInner)
