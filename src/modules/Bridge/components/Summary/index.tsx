import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { useSummary } from '@/modules/Bridge/stores/TransferSummary'
import { formattedAmount } from '@/utils'


export function Summary(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <div className="card card--ghost card--flat card--small">
            <h3 className="card-title">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TITLE',
                })}
            </h3>
            <ul className="summary">
                <li>
                    <span className="text-muted">
                        <Observer>
                            {() => (
                                <>
                                    {summary.leftNetwork?.name !== undefined ? intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_NETWORK',
                                    }, {
                                        network: summary.leftNetwork.name,
                                    }) : intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                    })}
                                </>
                            )}
                        </Observer>
                    </span>
                    <Observer>
                        {() => (
                            <>
                                {(summary.leftNetwork?.name !== undefined && summary.leftAddress !== undefined) ? (
                                    <>
                                        {summary.leftNetwork?.type === 'ton' && (
                                            <TonscanAccountLink
                                                key="ton-address"
                                                address={summary.leftAddress}
                                                copy
                                            />
                                        )}
                                        {summary.leftNetwork?.type === 'evm' && (
                                            <BlockScanAddressLink
                                                key="evm-address"
                                                address={summary.leftAddress}
                                                baseUrl={summary.leftNetwork.explorerBaseUrl}
                                                copy
                                            />
                                        )}
                                    </>
                                ) : (
                                    <span>–</span>
                                )}
                            </>
                        )}
                    </Observer>
                </li>
                <li>
                    <span className="text-muted">
                        <Observer>
                            {() => (
                                <>
                                    {summary.rightNetwork?.name !== undefined ? intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO_NETWORK',
                                    }, {
                                        network: summary.rightNetwork.name,
                                    }) : intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                    })}
                                </>
                            )}
                        </Observer>
                    </span>
                    <Observer>
                        {() => (
                            <>
                                {(summary.rightNetwork?.name !== undefined && summary.rightAddress !== undefined) ? (
                                    <>
                                        {summary.rightNetwork?.type === 'ton' && (
                                            <TonscanAccountLink
                                                key="ton-address"
                                                address={summary.rightAddress}
                                                copy
                                            />
                                        )}
                                        {summary.rightNetwork?.type === 'evm' && (
                                            <BlockScanAddressLink
                                                key="evm-address"
                                                address={summary.rightAddress}
                                                baseUrl={summary.rightNetwork.explorerBaseUrl}
                                                copy
                                            />
                                        )}
                                    </>
                                ) : (
                                    <span>–</span>
                                )}
                            </>
                        )}
                    </Observer>
                </li>
                <Observer>
                    {() => (
                        <>
                            {summary.vaultBalance !== undefined && (
                                <li key="vault-balance">
                                    <span className="text-muted text-nowrap">

                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_VAULT_BALANCE',
                                        }, {
                                            symbol: summary.token?.symbol,
                                        })}
                                    </span>
                                    <span className="text-truncate">
                                        {formattedAmount(
                                            summary.vaultBalance,
                                            summary.vaultDecimals,
                                            true,
                                            true,
                                        )}
                                    </span>
                                </li>
                            )}
                        </>
                    )}
                </Observer>
                <Observer>
                    {() => (
                        <>
                            {summary.token?.symbol !== undefined && (
                                <li key="bridge-fee">
                                    <span className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_BRIDGE_FEE',
                                        }, {
                                            symbol: summary.token.symbol || '',
                                        })}
                                    </span>
                                    <span>-</span>
                                </li>
                            )}
                        </>
                    )}
                </Observer>
                <li className="divider" />
                <li>
                    <span className="text-muted text-nowrap">
                        <Observer>
                            {() => (
                                <>
                                    {intl.formatMessage({
                                        id: summary.token?.symbol !== undefined
                                            ? 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT_TOKEN'
                                            : 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT',
                                    }, {
                                        symbol: summary.token?.symbol,
                                    })}
                                </>
                            )}
                        </Observer>
                    </span>
                    <span className="text-lg text-truncate">
                        <Observer>
                            {() => (
                                <b>
                                    {summary.amount
                                        ? formattedAmount(summary.amount, undefined, false)
                                        : '–'}
                                </b>
                            )}
                        </Observer>
                    </span>
                </li>
            </ul>
        </div>
    )
}
