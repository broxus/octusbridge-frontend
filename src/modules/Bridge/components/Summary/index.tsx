import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EtherscanAddressLink } from '@/components/common/EtherscanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { TokenCache } from '@/stores/TokensCacheService'
import { NetworkShape } from '@/bridge'


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
                                        <EtherscanAddressLink key="evm-address" address={leftAddress} />
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
                                        <TonscanAccountLink key="ton-address" address={rightAddress} />
                                    )}
                                    {rightNetwork?.type === 'evm' && (
                                        <EtherscanAddressLink key="evm-address" address={rightAddress} />
                                    )}
                                </>
                            ) : (
                                <span>–</span>
                            )}
                        </li>
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
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: token?.symbol !== undefined
                                        ? 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT_TOKEN'
                                        : 'CROSSCHAIN_TRANSFER_SUMMARY_AMOUNT',
                                }, {
                                    symbol: token?.symbol,
                                })}
                            </span>
                            <span className="text-lg">
                                <b>{amount || '–'}</b>
                            </span>
                        </li>
                    </ul>
                )}
            </Observer>
        </div>
    )
}
