import * as React from 'react'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Icon } from '@/components/common/Icon'
import { Button } from '@/components/common/Button'
import { CreateRelayerPopupLayout } from '@/modules/Relayers/components/CreateRelayerPopupLayout'
import { formattedAmount, formattedTokenAmount } from '@/utils'

type Props = {
    isValid?: boolean;
    isSubmitted?: boolean;
    isLoading?: boolean;
    requiredStake?: string;
    stakingBalance?: string;
    stakingBalanceIsValid?: boolean;
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
    isValid,
    isSubmitted,
    isLoading,
    requiredStake,
    stakingBalance,
    stakingBalanceIsValid,
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

    const noValue = intl.formatMessage({
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
                                value: formattedTokenAmount(
                                    stakingBalance,
                                    stakingTokenDecimals,
                                ),
                                symbol: stakingTokenSymbol,
                            })
                            : noValue
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
                                value: formattedTokenAmount(tonWalletBalance, tonTokenDecimals),
                                symbol: tonTokenSymbol,
                            })
                            : noValue
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
                                value: formattedTokenAmount(contractFee, tonTokenDecimals),
                                symbol: tonTokenSymbol,
                            })
                            : noValue
                    }
                </li>
            </ul>

            {
                !stakingBalanceIsValid
                && stakingTokenSymbol
                && stakingBalance
                && requiredStake
                && stakingTokenDecimals !== undefined
                && (
                    <div className="create-relayer-popup-warning">
                        <Alert
                            text={intl.formatMessage({
                                id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_TEXT',
                            }, {
                                symbol: stakingTokenSymbol,
                                amount: formattedTokenAmount(requiredStake, stakingTokenDecimals),
                            })}
                            type="danger"
                        />
                    </div>
                )
            }

            {
                !isSubmitted
                && !tonWalletBalanceIsValid
                && contractFee
                && tonTokenSymbol
                && tonTokenDecimals !== undefined
                && (
                    <div className="create-relayer-popup-warning">
                        <Alert
                            text={intl.formatMessage({
                                id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING',
                            }, {
                                amount: formattedAmount(
                                    contractFee,
                                    tonTokenDecimals,
                                    { preserve: true, roundOn: false },
                                ),
                                symbol: tonTokenSymbol,
                            }, { ignoreTag: true })}
                            type="danger"
                        />
                    </div>
                )
            }

            <div className="create-relayer-popup-actions">
                <Button
                    block
                    disabled={isLoading}
                    type="tertiary"
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'RELAYERS_CREATE_CONFIRMATION_CANCEL',
                    })}
                </Button>

                <Button
                    block
                    disabled={!isValid || isLoading}
                    type="primary"
                    onClick={onSubmit}
                >
                    {isLoading ? (
                        <Icon icon="loader" ratio={0.9} className="spin" />
                    ) : intl.formatMessage({
                        id: 'RELAYERS_CREATE_CONFIRMATION_SUBMIT',
                    })}
                </Button>
            </div>
        </CreateRelayerPopupLayout>
    )
}
