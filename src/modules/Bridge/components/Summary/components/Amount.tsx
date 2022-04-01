import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount } from '@/utils'


export function Amount(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

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
