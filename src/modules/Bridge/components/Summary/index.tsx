import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { NetworkShape } from '@/bridge'
import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { TokenCache } from '@/stores/TokensCacheService'
import { amount, formattedAmount } from '@/utils'


type Props = {
    amount?: string;
    decimals?: number;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    token?: TokenCache;
}


export function Summary({
    amount: _amount,
    decimals,
    leftAddress,
    leftNetwork,
    rightAddress,
    rightNetwork,
    token,
}: Props): JSX.Element {
    const intl = useIntl()

    const vaultBalance = () => {
        if (token?.root !== undefined && rightNetwork?.chainId !== undefined && rightNetwork.type === 'evm') {
            return token.vaults?.find(vault => vault.chainId === rightNetwork.chainId)?.vaultBalance
        }

        return undefined
    }

    return (
        <div className="card card--ghost card--flat card--small">
            <h3 className="card-title">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TITLE',
                })}
            </h3>
            <Observer>
                {() => (
                    <ul className="list crosschain-transfer__list">
                        <li>
                            <span className="text-muted">
                                {leftNetwork?.label !== undefined ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_NETWORK',
                                }, {
                                    network: leftNetwork.label,
                                }) : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                })}
                            </span>
                            {(leftNetwork?.label !== undefined && leftAddress !== undefined) ? (
                                <>
                                    {leftNetwork?.type === 'ton' && (
                                        <TonscanAccountLink
                                            key="ton-address"
                                            address={leftAddress}
                                            copy
                                        />
                                    )}
                                    {leftNetwork?.type === 'evm' && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={leftAddress}
                                            baseUrl={leftNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </>
                            ) : (
                                <span>–</span>
                            )}
                        </li>
                        <li>
                            <span className="text-muted">
                                {rightNetwork?.label !== undefined ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO_NETWORK',
                                }, {
                                    network: rightNetwork.label,
                                }) : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                })}
                            </span>
                            {(rightNetwork?.label !== undefined && rightAddress !== undefined) ? (
                                <>
                                    {rightNetwork?.type === 'ton' && (
                                        <TonscanAccountLink
                                            key="ton-address"
                                            address={rightAddress}
                                            copy
                                        />
                                    )}
                                    {rightNetwork?.type === 'evm' && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={rightAddress}
                                            baseUrl={rightNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </>
                            ) : (
                                <span>–</span>
                            )}
                        </li>
                        {vaultBalance() !== undefined && (
                            <li key="vault-balance">
                                <span className="text-muted text-nowrap">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_VAULT_BALANCE',
                                    }, {
                                        symbol: token?.symbol,
                                    })}
                                </span>
                                <span className="truncate">{amount(vaultBalance(), decimals)}</span>
                            </li>
                        )}
                        {token?.symbol !== undefined && (
                            <li key="bridge-fee">
                                <span className="text-muted">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_BRIDGE_FEE',
                                    }, {
                                        symbol: token.symbol || '',
                                    })}
                                </span>
                                <span>–</span>
                            </li>
                        )}
                        <li className="divider" />
                        <li>
                            <span className="text-muted text-nowrap">
                                {intl.formatMessage({
                                    id: token?.symbol !== undefined
                                        ? 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT_TOKEN'
                                        : 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT',
                                }, {
                                    symbol: token?.symbol,
                                })}
                            </span>
                            <span className="text-lg truncate">
                                <b>{_amount ? formattedAmount(_amount, decimals) : '–'}</b>
                            </span>
                        </li>
                    </ul>
                )}
            </Observer>
        </div>
    )
}
