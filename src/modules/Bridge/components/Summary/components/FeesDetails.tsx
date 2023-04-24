import * as React from 'react'
import { Observer } from 'mobx-react-lite'
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
                    {(summary.isFromEverscale || summary.isFromEvm)
                        && (summary.withdrawFee !== undefined || summary.depositFee !== undefined)
                        && (
                            <>
                                <li key="transfer-fees-divider" className="divider" />

                                <li key="transfer-fees-header" className="header">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                    }, {
                                        symbol: summary.token?.symbol || '',
                                    })}
                                </li>
                            </>
                        )}

                    {(summary.isFromEverscale && summary.withdrawFee !== undefined) && (
                        <li key="max-transfer-fee">
                            <div className="text-muted">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_WITHDRAW_FEE',
                                }, { symbol: summary.token?.symbol || '' })}
                            </div>
                            <div className="text-truncate">
                                {formattedTokenAmount(summary.withdrawFee)}
                            </div>
                        </li>
                    )}

                    {(summary.isFromEvm && summary.depositFee !== undefined) && (
                        <li key="max-transfer-fee">
                            <div className="text-muted">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_DEPOSIT_FEE',
                                }, { symbol: summary.token?.symbol || '' })}
                            </div>
                            <div className="text-truncate">
                                {formattedTokenAmount(summary.depositFee)}
                            </div>
                        </li>
                    )}
                </>
            )}
        </Observer>
    )
}
