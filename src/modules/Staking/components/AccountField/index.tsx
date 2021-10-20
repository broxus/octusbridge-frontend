import * as React from 'react'
import { useIntl } from 'react-intl'

import { TokenIcon } from '@/components/common/TokenIcon'
import { ActionType } from '@/modules/Staking/types'
import { amount as formatAmount } from '@/utils'

import './index.scss'

type Props = {
    isLoading: boolean;
    actionType: ActionType;
    balance: string;
    tokenAddress?: string;
    tokenSymbol?: string;
    tokenIcon?: string;
    tokenDecimals?: number;
    amount: string;
    onChangeAmount: (value: string) => void;
}

export function AccountField({
    isLoading,
    actionType,
    balance,
    tokenAddress,
    tokenSymbol,
    tokenIcon,
    tokenDecimals,
    amount,
    onChangeAmount,
}: Props): JSX.Element {
    const intl = useIntl()

    const changeAmount = (e: React.FormEvent<HTMLInputElement>) => {
        onChangeAmount(e.currentTarget.value)
    }

    return (
        <div className="staking-account-field">
            <div className="staking-account-field__head">
                <div className="staking-account-field__label staking-account-field__label_full">
                    {intl.formatMessage({
                        id: actionType === ActionType.Stake
                            ? 'STAKING_ACCOUNT_FORM_LABEL_STAKE'
                            : 'STAKING_ACCOUNT_FORM_LABEL_REDEEM',
                    })}
                </div>

                <div className="staking-account-field__label staking-account-field__label_short">
                    {intl.formatMessage({
                        id: 'STAKING_ACCOUNT_FORM_LABEL_FROM',
                    })}
                </div>

                <div className="staking-account-field__balance">
                    <span className="staking-account-field__balance-label staking-account-field__balance-label_full">
                        {intl.formatMessage({
                            id: actionType === ActionType.Stake
                                ? 'STAKING_ACCOUNT_FORM_WALLET_BALANCE'
                                : 'STAKING_ACCOUNT_FORM_AVAILABLE_BALANCE',
                        })}
                    </span>
                    <span className="staking-account-field__balance-label staking-account-field__balance-label_short">
                        {intl.formatMessage({
                            id: 'STAKING_ACCOUNT_FORM_WALLET_BALANCE_SHORT',
                        })}
                    </span>
                    &nbsp;
                    <strong>{formatAmount(balance, tokenDecimals)}</strong>
                </div>
            </div>

            <div className="staking-account-field__main">
                <input
                    type="text"
                    className="staking-account-field__input"
                    value={amount}
                    onChange={changeAmount}
                    disabled={isLoading}
                    placeholder="0.0"
                />

                <div className="staking-account-field__token">
                    <TokenIcon
                        size="small"
                        address={tokenAddress}
                        uri={tokenIcon}
                    />
                    {tokenSymbol}
                </div>
            </div>
        </div>
    )
}
