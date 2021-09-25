import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { UserAvatar } from '@/components/common/UserAvatar'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { amount, sliceAddress } from '@/utils'

import './index.scss'


export function EvmWallet(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useEvmWallet()

    return (
        <Observer>
            {() => (
                <div key="crystal-wallet" className="wallet">
                    {!wallet.isConnected ? (
                        <button
                            key="guest"
                            type="button"
                            className="btn btn--secondary"
                            disabled={wallet.isConnecting}
                            aria-disabled={wallet.isConnecting}
                            onClick={wallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </button>
                    ) : (
                        <div key="wrapper" className="wallet__wrapper">
                            <div className="wallet__user-avatar">
                                {wallet.account?.address !== undefined && (
                                    <UserAvatar
                                        address={wallet.account?.address}
                                        size="small"
                                    />
                                )}
                                <div className="wallet-icon">
                                    <Icon icon="ethWalletIcon" />
                                </div>
                            </div>
                            <div className="wallet__info">
                                <div className="wallet__address" data-address={wallet.account?.address}>
                                    {sliceAddress(wallet.account?.address)}
                                </div>
                                {wallet.account?.balance !== undefined && (
                                    <div key="balance" className="wallet__balance">
                                        {intl.formatMessage({
                                            id: 'WALLET_BALANCE_HINT',
                                        }, {
                                            value: amount(
                                                wallet.account?.balance,
                                                18,
                                            ) || 0,
                                            currency: 'ETH',
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                key="logout"
                                type="button"
                                className="btn btn-logout"
                                onClick={wallet.disconnect}
                            >
                                <Icon icon="logout" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Observer>
    )
}
