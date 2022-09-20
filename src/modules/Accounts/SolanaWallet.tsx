import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useSolanaWallet } from '@/stores/SolanaWalletService'
import { formattedTokenAmount, sliceAddress } from '@/utils'

import './index.scss'

export function SolanaWallet(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useSolanaWallet()

    return (
        <Observer>
            {() => (
                <div className="wallet">
                    {!wallet.isConnected ? (
                        <div key="wrapper" className="wallet__wrapper">
                            <div className="wallet__inner">
                                <div className="wallet__user-avatar">
                                    <Icon icon="solana1BlockchainIcon" ratio={1.6} />
                                </div>
                                <div className="wallet__info">
                                    <div className="wallet__address">
                                        {intl.formatMessage({
                                            id: 'SOLANA_WALLET_CONNECTOR_BLOCKCHAIN_NAME',
                                        })}
                                    </div>
                                    <div key="balance" className="wallet__balance">
                                        {intl.formatMessage({
                                            id: 'WALLET_NOT_CONNECTED_HINT',
                                        })}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="secondary"
                                disabled={wallet.isConnecting}
                                aria-disabled={wallet.isConnecting}
                                onClick={wallet.connect}
                            >
                                {intl.formatMessage({
                                    id: 'WALLET_CONNECT_BTN_TEXT',
                                })}
                            </Button>
                        </div>
                    ) : (
                        <div key="wrapper" className="wallet__wrapper">
                            <div className="wallet__inner">
                                <div className="wallet__user-avatar">
                                    <Icon icon="solana1BlockchainIcon" ratio={1.6} />
                                    <div className="wallet-icon">
                                        <img
                                            alt={wallet.adapterName ?? undefined}
                                            height={16}
                                            src={wallet.coin.icon}
                                            width={16}
                                        />
                                    </div>
                                </div>
                                <div className="wallet__info">
                                    <div className="wallet__address" data-address={wallet.address}>
                                        {sliceAddress(wallet.address)}
                                    </div>
                                    {wallet.balance !== undefined && (
                                        <div key="balance" className="wallet__balance">
                                            {intl.formatMessage({
                                                id: 'WALLET_BALANCE_HINT',
                                            }, {
                                                value: formattedTokenAmount(
                                                    wallet.balance,
                                                    wallet.coin.decimals,
                                                    {
                                                        truncate: 9,
                                                        roundOn: false,
                                                    },
                                                ),
                                                currency: wallet.coin.symbol || 'SOL',
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="link"
                                className="btn-logout"
                                onClick={wallet.disconnect}
                            >
                                {intl.formatMessage({
                                    id: 'WALLET_DISCONNECT_BTN_TEXT',
                                })}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Observer>
    )
}
