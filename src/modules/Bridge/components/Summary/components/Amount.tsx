import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useSummary } from '@/modules/Bridge/stores'
import { formattedAmount } from '@/utils'


export function Amount(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <>
            <li className="divider" />

            <li className="header">
                <Observer>
                    {() => (
                        <div>
                            {intl.formatMessage({
                                id: summary.token?.symbol !== undefined
                                    ? 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT_TOKEN'
                                    : 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT',
                            }, {
                                symbol: summary.token?.symbol || '',
                            })}
                        </div>
                    )}
                </Observer>
            </li>

            <li>
                <Observer>
                    {() => (
                        <b className="text-lg text-truncate">
                            {(summary.amount && summary.amount !== '0')
                                ? formattedAmount(
                                    summary.amount,
                                    summary.isFromEverscale
                                        ? summary.token?.decimals
                                        : summary.evmTokenDecimals,
                                    { preserve: true },
                                )
                                : '–'}
                        </b>
                    )}
                </Observer>
            </li>
        </>
    )
}
