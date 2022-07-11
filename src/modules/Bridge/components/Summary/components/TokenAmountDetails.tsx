import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'


export function TokenAmountDetails(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

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
                                    ? formattedTokenAmount(
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
