import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { useSummary } from '@/modules/Bridge/stores'
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
                    <Observer>
                        {() => (
                            <span
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: summary.leftNetwork?.name !== undefined ? intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_NETWORK',
                                    }, {
                                        abbr: parts => `<abbr title="${summary.leftNetwork?.label}">${parts.join('')}</abbr>`,
                                        name: summary.leftNetwork.name,
                                    }) : intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                    }),
                                }}
                            />
                        )}
                    </Observer>
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
                    <Observer>
                        {() => (
                            <span
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: summary.rightNetwork?.name !== undefined ? intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO_NETWORK',
                                    }, {
                                        abbr: parts => `<abbr title="${summary.rightNetwork?.label}">${parts.join('')}</abbr>`,
                                        name: summary.rightNetwork.name,
                                    }) : intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                    }),
                                }}
                            />
                        )}
                    </Observer>
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
                            {(summary.isEvmToEvm && summary.everscaleAddress !== undefined) && (
                                <li key="everscale-address">
                                    <span className="text-muted text-nowrap">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_EVERSCALE_ADDRESS',
                                        })}
                                    </span>
                                    <span className="text-truncate">
                                        <TonscanAccountLink
                                            key="everscale-address"
                                            address={summary.everscaleAddress}
                                            copy
                                        />
                                    </span>
                                </li>
                            )}
                        </>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <>
                            {(summary.isTonToEvm && summary.tokenVault?.balance !== undefined) && (
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
                                            summary.tokenVault?.balance,
                                            summary.tokenVault?.decimals,
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
                            {(
                                summary.isEvmToEvm
                                && summary.minTransferFee !== undefined
                                && summary.maxTransferFee !== undefined
                            ) && (
                                <>
                                    <li className="divider" />

                                    <li className="header">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                        }, {
                                            symbol: summary.token?.symbol,
                                        })}
                                    </li>

                                    <li>
                                        <span className="text-muted text-nowrap">
                                            Min
                                        </span>
                                        <span className="text-truncate">
                                            {formattedAmount(summary.minTransferFee, summary.token?.decimals)}
                                        </span>
                                    </li>

                                    <li>
                                        <span className="text-muted text-nowrap">
                                            Max
                                        </span>
                                        <span className="text-truncate">
                                            {formattedAmount(summary.maxTransferFee, summary.token?.decimals)}
                                        </span>
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <>
                            {summary.bridgeFee !== undefined && (
                                <>
                                    <li className="divider" />

                                    <li className="header">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_FEES',
                                        })}
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <>
                            {(summary.token?.symbol !== undefined && summary.bridgeFee) && (
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

                <li className="header">
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
                </li>
                <li>
                    <span className="text-lg text-truncate">
                        <Observer>
                            {() => (
                                <b>{summary.amount ? formattedAmount(summary.amount) : '–'}</b>
                            )}
                        </Observer>
                    </span>
                </li>
            </ul>
        </div>
    )
}
