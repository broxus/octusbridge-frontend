import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

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
                            <>
                                <div
                                    className="text-muted"
                                    dangerouslySetInnerHTML={{
                                        __html: intl.formatMessage({
                                            id: summary.leftNetwork?.name !== undefined
                                                ? 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_NETWORK'
                                                : 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                        }, {
                                            abbr: parts => `<abbr title="${summary.leftNetwork?.label}">${parts.join('')}</abbr>`,
                                            name: summary.leftNetwork?.name || '',
                                        }),
                                    }}
                                />
                                {(summary.leftNetwork?.name !== undefined && summary.leftAddress !== undefined) ? (
                                    <div>
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
                                    </div>
                                ) : (
                                    <div>–</div>
                                )}
                            </>
                        )}
                    </Observer>
                </li>
                <li>
                    <Observer>
                        {() => (
                            <>
                                <div
                                    className="text-muted"
                                    dangerouslySetInnerHTML={{
                                        __html: intl.formatMessage({
                                            id: summary.rightNetwork?.name !== undefined
                                                ? 'CROSSCHAIN_TRANSFER_SUMMARY_TO_NETWORK'
                                                : 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                        }, {
                                            abbr: parts => `<abbr title="${summary.rightNetwork?.label}">${parts.join('')}</abbr>`,
                                            name: summary.rightNetwork?.name || '',
                                        }),
                                    }}
                                />
                                {(summary.rightNetwork?.name !== undefined && summary.rightAddress !== undefined) ? (
                                    <div>
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
                                    </div>
                                ) : (
                                    <div>–</div>
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
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_EVERSCALE_ADDRESS',
                                        })}
                                    </div>
                                    <div className="text-truncate">
                                        <TonscanAccountLink
                                            key="everscale-address"
                                            address={summary.everscaleAddress}
                                            copy
                                        />
                                    </div>
                                </li>
                            )}
                        </>
                    )}
                </Observer>
                <Observer>
                    {() => (
                        <>
                            {((summary.isEvmToTon || summary.isTonToEvm) && summary.vaultBalance !== undefined) && (
                                <li key="vault-balance">
                                    <div className="text-muted">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_SUMMARY_VAULT_BALANCE',
                                        }, {
                                            symbol: summary.token?.symbol || '',
                                        })}
                                    </div>
                                    <div className="text-truncate">
                                        {formattedAmount(
                                            summary.vaultBalance,
                                            summary.vaultDecimals,
                                            true,
                                            true,
                                        )}
                                    </div>
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
                                    symbol: summary.token?.symbol || '',
                                })}
                            </>
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
                                        summary.isFromTon
                                            ? summary.token?.decimals
                                            : summary.tokenVault?.decimals,
                                    )
                                    : '–'}
                            </b>
                        )}
                    </Observer>
                </li>

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
                                                    new BigNumber(summary.minTransferFee || 0)
                                                        .shiftedBy(summary.token?.decimals || 0)
                                                        .gte(0),
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
                                                    new BigNumber(summary.maxTransferFee || 0)
                                                        .shiftedBy(summary.token?.decimals || 0)
                                                        .gte(0),
                                                )}
                                            </div>
                                        </li>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Observer>
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
                                        <li key="transfer-fee">
                                            <div className="text-muted">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TRANSFER_FEE',
                                                }, {
                                                    symbol: summary.token.symbol || '',
                                                })}
                                            </div>
                                            <div className="text-truncate">
                                                {formattedAmount(
                                                    summary.swapAmount,
                                                    summary.token?.decimals,
                                                    new BigNumber(summary.swapAmount || 0)
                                                        .shiftedBy(summary.token?.decimals || 0)
                                                        .gte(0),
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
                        </>
                    )}
                </Observer>

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
                                    <b className="text-lg text-truncate">
                                        {(summary.tokenAmount !== undefined && summary.tokenAmount !== '0')
                                            ? formattedAmount(summary.tokenAmount, summary.token?.decimals)
                                            : '–'}
                                    </b>
                                </li>
                            </>
                        )
                    }}
                </Observer>
            </ul>
        </div>
    )
}
