import BigNumber from 'bignumber.js'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Warning } from '@/components/common/Warning'
import { amount } from '@/utils'

type Props = {
    stakingBalance?: string;
    requiredStake?: string;
    stakingTokenSymbol?: string;
    stakingTokenDecimals?: number;
}

export function CreateRelayerBalance({
    stakingBalance,
    requiredStake,
    stakingTokenSymbol,
    stakingTokenDecimals,
}: Props): JSX.Element {
    const intl = useIntl()

    const nullMessage = intl.formatMessage({
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
                        amount(stakingBalance, stakingTokenDecimals)
                    ) : nullMessage}
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
                        amount(requiredStake, stakingTokenDecimals)
                    ) : nullMessage}
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
                            {amount(
                                new BigNumber(requiredStake).minus(stakingBalance).toFixed(),
                                stakingTokenDecimals,
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
                    <Warning
                        title={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_TITLE',
                        })}
                        text={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_TEXT',
                        }, {
                            symbol: stakingTokenSymbol,
                            amount: amount(requiredStake, stakingTokenDecimals),
                        })}
                        actionLabel={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_INSUFFICIENT_WARNING_ACTION',
                        })}
                        actionLink="/staking"
                    />
                )
            }
        </>
    )
}
