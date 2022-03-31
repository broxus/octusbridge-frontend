import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useSummary } from '@/modules/Bridge/stores'
import { formattedAmount } from '@/utils'


export function TokenAmountDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => {
                if (!summary.isEvmToEvm) {
                    return null
                }

                return (
                    <>
                        <li key="receive-token-amount-divider" className="divider" />
                        <li key="receive-token-amount-header" className="header">
                            {(!summary.isTransferPage || !summary.isTransferReleased)
                                ? intl.formatMessage({
                                    id: summary.token?.symbol !== undefined
                                        ? 'CROSSCHAIN_TRANSFER_SUMMARY_TO_RECEIVE_AMOUNT_TOKEN'
                                        : 'CROSSCHAIN_TRANSFER_SUMMARY_TO_RECEIVE_AMOUNT',
                                }, {
                                    symbol: summary.token?.symbol || '',
                                })
                                : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_RECEIVE_AMOUNT_TOKEN',
                                }, {
                                    symbol: summary.token?.symbol || '',
                                })}
                        </li>
                        <li>
                            <b className="text-lg text-truncate" data-amount={summary.tokenAmount}>
                                {(summary.tokenAmount !== undefined && summary.tokenAmount !== '0')
                                    ? formattedAmount(
                                        summary.tokenAmount,
                                        summary.token?.decimals,
                                        { preserve: true },
                                    )
                                    : '–'}
                            </b>
                        </li>
                    </>
                )
            }}
        </Observer>
    )
}
