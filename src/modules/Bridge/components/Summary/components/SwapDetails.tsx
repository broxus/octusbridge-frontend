import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount, formattedTokenAmount } from '@/utils'


export function SwapDetails(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

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
                                        {formattedTokenAmount(
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
