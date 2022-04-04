import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount } from '@/utils'


export function FeesDetails(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

    return (
        <Observer>
            {() => (
                <>
                    {(
                        summary.pipeline?.isMultiVault
                        && summary.pipeline?.isNative
                        && summary.withdrawFee !== undefined
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

                            <li key="max-transfer-fee">
                                <div className="text-muted">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_WITHDRAW_FEE',
                                    }, { symbol: summary.token?.symbol || '' })}
                                </div>
                                <div className="text-truncate">
                                    {formattedAmount(
                                        summary.withdrawFee,
                                        summary.token?.decimals,
                                        { preserve: true },
                                    )}
                                </div>
                            </li>
                        </>
                    )}
                </>
            )}
        </Observer>
    )
}
