import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { UserAvatar } from '@/components/common/UserAvatar'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { findNetwork, formattedAmount, sliceAddress } from '@/utils'

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
                            <Button
                                size="md"
                                type="secondary"
                                disabled={wallet.isConnecting}
                                aria-disabled={wallet.isConnecting}
                                onClick={wallet.connect}
                            >
                                {intl.formatMessage({
                                    id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                                })}
                            </Button>
                        ) : (
                            <div key="wrapper" className="wallet__wrapper">
                                <div className="wallet__user-avatar">
                                    {wallet.address !== undefined && (
                                        <UserAvatar
                                            address={wallet.address}
                                            size="small"
                                        />
                                    )}
                                    <div className="wallet-icon">
                                        <Icon
                                            icon={`${(network?.currencySymbol ?? 'eth').toLowerCase()}WalletIcon`}
                                            ratio={0.8}
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
                                                value: formattedAmount(
                                                    wallet.balance,
                                                    18,
                                                    false,
                                                ),
                                                currency: network?.currencySymbol || 'ETH',
                                            })}
                                        </div>
                                    )}
                                </div>

                                {!wallet.isMetaMask && (
                                    <Button
                                        className="btn-logout"
                                        onClick={wallet.disconnect}
                                    >
                                        <Icon icon="logout" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )
            }}
        </Observer>
    )
}
