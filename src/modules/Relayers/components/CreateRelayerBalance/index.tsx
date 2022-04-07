import * as React from 'react'
import BigNumber from 'bignumber.js'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Alert } from '@/components/common/Alert'
import { formattedAmount } from '@/utils'

type Props = {
    isSubmitted?: boolean;
    tonWalletBalanceIsValid?: boolean;
    contractFee?: string;
    tonTokenSymbol?: string;
    tonTokenDecimals?: number;
    stakingBalance?: string;
    requiredStake?: string;
    stakingTokenSymbol?: string;
    stakingTokenDecimals?: number;
}

export function CreateRelayerBalance({
    isSubmitted,
    tonWalletBalanceIsValid,
    contractFee,
    tonTokenSymbol,
    tonTokenDecimals,
    stakingBalance,
    requiredStake,
    stakingTokenSymbol,
    stakingTokenDecimals,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <>
            <ul className="summary">
                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: stakingTokenSymbol
                                ? 'RELAYERS_CREATE_FORM_STATS_CURRENT_STAKE'
                                : 'RELAYERS_CREATE_FORM_STATS_CURRENT_STAKE_SHORT',
                        }, {
                            symbol: stakingTokenSymbol,
                        })}
                    </span>
                    {stakingBalance && stakingTokenDecimals !== undefined ? (
                        formattedAmount(
                            stakingBalance,
                            stakingTokenDecimals,
                            { target: 'token' },
                        )
                    ) : noValue}
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: stakingTokenSymbol
                                ? 'RELAYERS_CREATE_FORM_STATS_MIN_REQUIRED'
                                : 'RELAYERS_CREATE_FORM_STATS_MIN_REQUIRED_SHORT',
                        }, {
                            symbol: stakingTokenSymbol,
                        })}
                    </span>
                    {requiredStake && stakingTokenDecimals !== undefined ? (
                        formattedAmount(
                            requiredStake,
                            stakingTokenDecimals,
                            { target: 'token' },
                        )
                    ) : noValue}
                </li>

                {
                    requiredStake
                    && stakingBalance
                    && new BigNumber(stakingBalance).lt(requiredStake)
                    && (
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: stakingTokenSymbol
                                        ? 'RELAYERS_CREATE_FORM_STATS_MISSING_AMOUNT'
                                        : 'RELAYERS_CREATE_FORM_STATS_MISSING_AMOUNT_SHORT',
                                }, {
                                    symbol: stakingTokenSymbol,
                                })}
                            </span>
                            {formattedAmount(
                                new BigNumber(requiredStake).minus(stakingBalance).toFixed(),
                                stakingTokenDecimals,
                                { target: 'token' },
                            )}
                        </li>
                    )
                }
            </ul>

            {
                stakingTokenSymbol
                && stakingBalance
                && requiredStake
                && stakingTokenDecimals !== undefined
                && new BigNumber(stakingBalance).lt(requiredStake)
                && (
                    <Alert
                        key="insufficient"
                        actions={(
                            <Link to="/staking/my" className="btn btn--md btn--tertiary">
                                {intl.formatMessage({
                                    id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_ACTION',
                                })}
                            </Link>
                        )}
                        title={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_TITLE',
                        })}
                        text={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_TEXT',
                        }, {
                            symbol: stakingTokenSymbol,
                            amount: formattedAmount(
                                requiredStake,
                                stakingTokenDecimals,
                                { target: 'token' },
                            ),
                        })}
                        type="danger"
                    />
                )
            }

            {
                !isSubmitted
                && !tonWalletBalanceIsValid
                && contractFee
                && tonTokenSymbol
                && tonTokenDecimals !== undefined
                && (
                    <Alert
                        key="balance"
                        title={intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING_TITLE',
                        })}
                        text={intl.formatMessage({
                            id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING',
                        }, {
                            amount: formattedAmount(
                                contractFee,
                                tonTokenDecimals,
                                { preserve: true, roundIfThousand: false },
                            ),
                            symbol: tonTokenSymbol,
                        }, { ignoreTag: true })}
                        type="danger"
                    />
                )
            }
        </>
    )
}
