import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useSummary } from '@/modules/Bridge/stores'
import { formattedAmount } from '@/utils'


export function SwapDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => (
                <>
                    {(summary.token?.symbol !== undefined && (
                        summary.bridgeFee !== undefined
                        || summary.swapAmount !== undefined
                    )) && (
                        <>
                            <li key="fees-divider" className="divider" />

                            <li key="fees-header" className="header">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_FEES',
                                })}
                            </li>

                            {summary.swapAmount !== undefined && (
                                <li key="swap-amount">
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                        }, {
                                            symbol: summary.token.symbol || '',
                                        })}
                                    </div>
                                    <div className="text-truncate">
                                        {formattedAmount(
                                            summary.swapAmount,
                                            summary.token?.decimals,
                                            { preserve: true },
                                        )}
                                    </div>
                                </li>
                            )}

                            {summary.bridgeFee !== undefined && (
                                <li key="bridge-fee">
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_BRIDGE_FEE',
                                        }, {
                                            symbol: summary.token.symbol || '',
                                        })}
                                    </div>
                                    <div>-</div>
                                </li>
                            )}
                        </>
                    )}
                </>
            )}
        </Observer>
    )
}
