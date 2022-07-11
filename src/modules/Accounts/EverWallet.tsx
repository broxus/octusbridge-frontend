import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { DexConstants } from '@/misc'
import { useEverWallet } from '@/stores/EverWalletService'
import { formattedTokenAmount, sliceAddress } from '@/utils'

import './index.scss'


export function EverWallet(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useEverWallet()

    return (
        <Observer>
            {() => (
                <div key="ton-wallet" className="wallet">
                    {!wallet.isConnected ? (
                        <div key="wrapper" className="wallet__wrapper">
                            <div className="wallet__inner">
                                <div className="wallet__user-avatar">
                                    <Icon icon="everscale1BlockchainIcon" ratio={1.6} />
                                </div>
                                <div className="wallet__info">
                                    <div className="wallet__address">
                                        {intl.formatMessage({
                                            id: 'EVER_WALLET_CONNECTOR_BLOCKCHAIN_NAME',
                                        })}
                                    </div>
                                    <div className="wallet__balance">
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
                                    <Icon icon="everscale1BlockchainIcon" ratio={1.6} />
                                    <div className="wallet-icon">
                                        <Icon icon="everWalletIcon" ratio={0.8} />
                                    </div>
                                </div>
                                <div className="wallet__info">
                                    <div className="wallet__address">
                                        {sliceAddress(wallet.address)}
                                    </div>
                                    {wallet.balance !== undefined && (
                                        <div key="balance" className="wallet__balance">
                                            {intl.formatMessage({
                                                id: 'WALLET_BALANCE_HINT',
                                            }, {
                                                value: formattedTokenAmount(
                                                    wallet.balance,
                                                    DexConstants.CoinDecimals,
                                                    {
                                                        preserve: true,
                                                        roundOn: false,
                                                    },
                                                ),
                                                currency: DexConstants.CoinSymbol,
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
