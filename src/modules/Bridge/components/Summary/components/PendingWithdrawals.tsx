import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'
import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'


export function PendingWithdrawals(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

    return (
        <Observer>
            {() => {
                if (
                    !summary.pendingWithdrawals
                    || summary.pendingWithdrawals.length === 0
                    || summary.evmTokenDecimals === undefined
                    || !summary.token
                ) {
                    return null
                }

                return (
                    <>
                        <li className="divider" />

                        <li className="header">
                            <div>
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_PENDING_WITHDRAWALS_BOUNTY',
                                }, {
                                    symbol: summary.token.symbol,
                                })}
                            </div>
                        </li>

                        {summary.pendingWithdrawals.map(item => (
                            <li key={`bounty.${item.recipient}.${item.id}`}>
                                <div className="text-muted">
                                    {summary.leftAddress !== undefined && summary.leftNetwork !== undefined && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={item.recipient}
                                            baseUrl={summary.leftNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </div>
                                <div>
                                    {formattedTokenAmount(
                                        item.bounty,
                                        summary.evmTokenDecimals,
                                        { preserve: true },
                                    )}
                                </div>
                            </li>
                        ))}

                        {summary.pendingWithdrawals.length > 1 && (
                            <li>
                                <div className="text-muted">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOTAL',
                                    })}
                                </div>
                                <div>
                                    {formattedTokenAmount(
                                        summary.pendingWithdrawals
                                            .reduce((acc, item) => acc.plus(item.bounty), new BigNumber(0))
                                            .toFixed(),
                                        summary.evmTokenDecimals,
                                        { preserve: true },
                                    )}
                                </div>
                            </li>
                        )}

                        <li className="divider" />

                        <li className="header">
                            <div>
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_PENDING_WITHDRAWALS_AMOUNT',
                                }, {
                                    symbol: summary.token.symbol,
                                })}
                            </div>
                        </li>

                        {summary.pendingWithdrawals.map(item => (
                            <li key={`amount.${item.recipient}.${item.id}`}>
                                <div className="text-muted">
                                    {summary.leftAddress !== undefined && summary.leftNetwork !== undefined && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={item.recipient}
                                            baseUrl={summary.leftNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </div>
                                <div>
                                    {formattedTokenAmount(
                                        item.amount,
                                        summary.evmTokenDecimals,
                                        { preserve: true },
                                    )}
                                </div>
                            </li>
                        ))}

                        {summary.pendingWithdrawals.length > 1 && (
                            <li>
                                <div className="text-muted">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOTAL',
                                    })}
                                </div>
                                <div>
                                    {formattedTokenAmount(
                                        summary.pendingWithdrawals
                                            .reduce((acc, item) => acc.plus(item.amount), new BigNumber(0))
                                            .toFixed(),
                                        summary.evmTokenDecimals,
                                        { preserve: true },
                                    )}
                                </div>
                            </li>
                        )}
                    </>
                )
            }}
        </Observer>
    )
}
