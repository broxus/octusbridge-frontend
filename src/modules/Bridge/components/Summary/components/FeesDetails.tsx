import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { useSummary } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'

export function FeesDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => (
                <>
                    {(summary.isFromTvm || summary.isFromEvm)
                        && (summary.withdrawFee !== undefined || summary.depositFee !== undefined) && (
                            <>
                                <li key="transfer-fees-divider" className="divider" />

                                <li key="transfer-fees-header" className="header">
                                    {intl.formatMessage(
                                        {
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                        },
                                        {
                                            symbol: summary.token?.symbol || '',
                                        },
                                    )}
                                </li>
                            </>
                        )}

                    {summary.isTvmEvm && summary.withdrawFee !== undefined && (
                        <li key="withdraw-fee">
                            <div className="text-muted">
                                {intl.formatMessage(
                                    {
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_WITHDRAW_FEE',
                                    },
                                    { symbol: summary.token?.symbol || '' },
                                )}
                            </div>
                            <div className="text-truncate">{formattedTokenAmount(summary.withdrawFee)}</div>
                        </li>
                    )}

                    {summary.isEvmTvm && summary.depositFee !== undefined && (
                        <li key="deposit-fee">
                            <div className="text-muted">
                                {intl.formatMessage(
                                    {
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_DEPOSIT_FEE',
                                    },
                                    { symbol: summary.token?.symbol || '' },
                                )}
                            </div>
                            <div className="text-truncate">{formattedTokenAmount(summary.depositFee)}</div>
                        </li>
                    )}

                    {summary.isEvmEvm && (
                        <li key="withdraw-fee">
                            <div className="text-muted">
                                {intl.formatMessage({ id: 'CROSSCHAIN_TRANSFER_SUMMARY_BRIDGE_FEE' })}
                            </div>
                            <div className="text-truncate">
                                {formattedTokenAmount(
                                    new BigNumber(0)
                                    .plus(summary.depositFee || 0)
                                    .plus(summary.secondWithdrawFee || 0)
                                    .toFixed(),
                                )}
                            </div>
                        </li>
                    )}
                </>
            )}
        </Observer>
    )
}
