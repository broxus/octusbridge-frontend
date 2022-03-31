import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useSummary } from '@/modules/Bridge/stores'
import { formattedAmount } from '@/utils'


export function FeesDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => (
                <>
                    {(
                        summary.isEvmToEvm && (
                            summary.minTransferFee !== undefined
                            || summary.maxTransferFee !== undefined
                        ) && summary.swapAmount === undefined
                    ) && (
                        <>
                            <li key="min-max-transfer-fees-divider" className="divider" />

                            <li key="min-max-transfer-fees-header" className="header">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                }, {
                                    symbol: summary.token?.symbol || '',
                                })}
                            </li>

                            {summary.minTransferFee !== undefined && (
                                <li key="min-transfer-fee">
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_MIN_TRANSFER_FEE',
                                        })}
                                    </div>
                                    <div className="text-truncate">
                                        {formattedAmount(
                                            summary.minTransferFee,
                                            summary.token?.decimals,
                                            { preserve: true },
                                        )}
                                    </div>
                                </li>
                            )}

                            {summary.minTransferFee !== undefined && (
                                <li key="max-transfer-fee">
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_MAX_TRANSFER_FEE',
                                        })}
                                    </div>
                                    <div className="text-truncate">
                                        {formattedAmount(
                                            summary.maxTransferFee,
                                            summary.token?.decimals,
                                            { preserve: true },
                                        )}
                                    </div>
                                </li>
                            )}
                        </>
                    )}
                </>
            )}
        </Observer>
    )
}
