import * as React from 'react'
import { Observer, observer } from 'mobx-react-lite'
import { useRouteMatch } from 'react-router-dom'

import { DexConstants } from '@/misc'
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

    const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await currentForm.submit()
    }

    const onSubmit = async () => {
        await currentForm.submit()
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
            <form onSubmit={onSubmitForm}>
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
                    tokenSymbol={DexConstants.TONSymbol}
                    tokenDecimals={DexConstants.TONDecimals}
                />

                <Observer>
                    {() => (
                        <AccountSubmit
                            isConnected={accountData.isConnected}
                            isLoading={accountData.isLoading || currentForm.isLoading}
                            amountIsValid={currentForm.isValid}
                            onClickConnect={accountData.connectToTonWallet}
                            onSubmit={onSubmit}
                        />
                    )}
                </Observer>
            </form>
        </AccountLayout>
    )
}

export const StakingAccount = observer(StakingAccountInner)
