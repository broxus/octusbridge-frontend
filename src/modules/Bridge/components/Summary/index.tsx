import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { TokenCache } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/bridge'
import { formatAmount, formatBalance } from '@/utils'


type Props = {
    amount?: string;
    leftAddress?: string;
    leftNetwork?: NetworkShape;
    rightAddress?: string;
    rightNetwork?: NetworkShape;
    token?: TokenCache;
}


export function Summary({
    amount,
    leftAddress,
    leftNetwork,
    rightAddress,
    rightNetwork,
    token,
}: Props): JSX.Element {
    const intl = useIntl()

    const decimals = () => {
        if (token?.root === undefined) {
            return undefined
        }

        if (leftNetwork?.type === 'evm' && leftNetwork?.chainId !== undefined) {
            return token.vaults?.find(vault => vault.chainId === leftNetwork?.chainId)?.decimals
        }

        if (rightNetwork?.type === 'evm' && rightNetwork.chainId !== undefined) {
            return token.vaults?.find(vault => vault.chainId === rightNetwork?.chainId)?.decimals
        }

        return token.decimals
    }

    const vaultBalance = () => {
        if (token?.root === undefined || rightNetwork?.chainId === undefined) {
            return undefined
        }

        if (rightNetwork.type === 'evm') {
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
                                {leftNetwork?.name !== undefined ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_NETWORK',
                                }, {
                                    network: leftNetwork.name,
                                }) : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                })}
                            </span>
                            {leftAddress ? (
                                <>
                                    {leftNetwork?.type === 'ton' && (
                                        <TonscanAccountLink key="ton-address" address={leftAddress} />
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
                                {rightNetwork?.name !== undefined ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO_NETWORK',
                                }, {
                                    network: rightNetwork.name,
                                }) : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                })}
                            </span>
                            {rightAddress ? (
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
                                <span className="truncate">{formatBalance(vaultBalance(), decimals())}</span>
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
                                <b>{amount ? formatAmount(amount, decimals()) : '–'}</b>
                            </span>
                        </li>
                    </ul>
                )}
            </Observer>
        </div>
    )
}
