import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { UserAvatar } from '@/components/common/UserAvatar'
import { DexConstants } from '@/misc'
import { useEverWallet } from '@/stores/EverWalletService'
import { formattedAmount, sliceAddress } from '@/utils'

import './index.scss'


export function EverWallet(): JSX.Element | null {
    const intl = useIntl()
    const wallet = useEverWallet()

    return (
        <Observer>
            {() => (wallet.isInitialized ? (
                <div key="ton-wallet" className="wallet">
                    {!wallet.isConnected ? (
                        <Button
                            size="md"
                            type="secondary"
                            disabled={wallet.isConnecting}
                            aria-disabled={wallet.isConnecting}
                            onClick={wallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    ) : (
                        <div key="wrapper" className="wallet__wrapper">
                            <div className="wallet__user-avatar">
                                <UserAvatar
                                    address={wallet.address!}
                                    size="small"
                                />
                                <div className="wallet-icon">
                                    <Icon icon="everCoinIcon" ratio={0.8} />
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
                                            value: formattedAmount(
                                                wallet.balance,
                                                DexConstants.CoinDecimals,
                                                {
                                                    preserve: true,
                                                    roundIfThousand: false,
                                                },
                                            ),
                                            currency: DexConstants.CoinSymbol,
                                        })}
                                    </div>
                                )}
                            </div>

                            <Button
                                className="btn-logout"
                                onClick={wallet.disconnect}
                            >
                                <Icon icon="logout" />
                            </Button>
                        </div>
                    )}
                </div>
            ) : null)}
        </Observer>
    )
}
