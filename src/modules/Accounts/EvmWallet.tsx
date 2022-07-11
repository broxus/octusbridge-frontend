import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { findNetwork, formattedTokenAmount, sliceAddress } from '@/utils'

import './index.scss'

export function EvmWallet(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useEvmWallet()

    return (
        <Observer>
            {() => {
                const network = findNetwork(wallet.chainId, 'evm')
                return (
                    <div className="wallet">
                        {!wallet.isConnected ? (
                            <div key="wrapper" className="wallet__wrapper">
                                <div className="wallet__inner">
                                    <div className="wallet__user-avatar">
                                        <Icon icon="evm1BlockchainIcon" ratio={1.6} />
                                    </div>
                                    <div className="wallet__info">
                                        <div className="wallet__address">
                                            {intl.formatMessage({
                                                id: 'EVM_WALLET_CONNECTOR_BLOCKCHAIN_NAME',
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
                                        <Icon
                                            icon={`${network?.type.toLowerCase()}${network?.chainId}BlockchainIcon`}
                                            ratio={1.6}
                                        />
                                        {wallet.isMetaMask && (
                                            <div className="wallet-icon">
                                                <Icon icon="metamaskWalletIcon" ratio={0.45} />
                                            </div>
                                        )}
                                        {wallet.isWalletConnect && (
                                            <div className="wallet-icon">
                                                <Icon icon="walletConnectIcon" ratio={0.8} />
                                            </div>
                                        )}
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
                                                        18,
                                                        {
                                                            truncate: 9,
                                                            roundOn: false,
                                                        },
                                                    ),
                                                    currency: network?.currencySymbol || 'ETH',
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
                )
            }}
        </Observer>
    )
}
