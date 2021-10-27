import * as React from 'react'
import { useIntl } from 'react-intl'

import { Warning } from '@/components/common/Warning'
import { CreateRelayerPopupLayout } from '@/modules/Relayers/components/CreateRelayerPopupLayout'
import { amount } from '@/utils'

type Props = {
    isLoading?: boolean;
    stakingBalance?: string;
    stakingTokenSymbol?: string;
    stakingTokenDecimals?: number;
    tonWalletBalance?: string;
    tonWalletBalanceIsValid?: boolean;
    tonTokenSymbol?: string;
    tonTokenDecimals?: number;
    contractFee?: string;
    onDismiss: () => void;
    onSubmit: () => void;
}

export function CreateRelayerConfirmation({
    isLoading,
    stakingBalance,
    stakingTokenSymbol,
    stakingTokenDecimals,
    tonWalletBalance,
    tonWalletBalanceIsValid,
    tonTokenSymbol,
    tonTokenDecimals,
    contractFee,
    onDismiss,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()

    const nullMessage = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <CreateRelayerPopupLayout
            onDismiss={onDismiss}
            dismissEnabled={!isLoading}
            title={intl.formatMessage({
                id: 'RELAYERS_CREATE_CONFIRMATION_TITLE',
            })}
        >
            <ul className="summary">
                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_YOUR_STAKE',
                        })}
                    </span>
                    {
                        stakingBalance && stakingTokenSymbol && stakingTokenDecimals !== undefined
                            ? intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: amount(stakingBalance, stakingTokenDecimals),
                                symbol: stakingTokenSymbol,
                            })
                            : nullMessage
                    }
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE',
                        })}
                    </span>
                    {
                        tonWalletBalance && tonTokenSymbol && tonTokenDecimals !== undefined
                            ? intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: amount(tonWalletBalance, tonTokenDecimals),
                                symbol: tonTokenSymbol,
                            })
                            : nullMessage
                    }
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_FEE',
                        })}
                    </span>
                    {
                        contractFee && tonTokenSymbol && tonTokenDecimals !== undefined
                            ? intl.formatMessage({
                                id: 'AMOUNT',
                            }, {
                                value: amount(contractFee, tonTokenDecimals),
                                symbol: tonTokenSymbol,
                            })
                            : nullMessage
                    }
                </li>
            </ul>

            {
                !tonWalletBalanceIsValid
                && contractFee
                && tonTokenSymbol
                && tonTokenDecimals !== undefined
                && (
                    <Warning
                        theme="warning"
                        text={intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING',
                        }, {
                            amount: amount(contractFee, tonTokenDecimals),
                            symbol: tonTokenSymbol,
                        })}
                    />
                )
            }

            <div className="create-relayer-popup-actions">
                <button
                    type="button"
                    className="btn btn--tertiary btn-block"
                    onClick={onDismiss}
                    disabled={isLoading}
                >
                    {intl.formatMessage({
                        id: 'RELAYERS_CREATE_CONFIRMATION_CANCEL',
                    })}
                </button>

                <button
                    type="button"
                    className="btn btn--primary btn-block"
                    onClick={onSubmit}
                    disabled={!tonWalletBalanceIsValid || isLoading}
                >
                    {intl.formatMessage({
                        id: 'RELAYERS_CREATE_CONFIRMATION_SUBMIT',
                    })}
                </button>
            </div>
        </CreateRelayerPopupLayout>
    )
}
