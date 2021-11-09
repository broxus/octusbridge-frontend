import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'

import './index.scss'


type Props = {
    className?: string;
    evmWallet: EvmWalletService;
    tonWallet: TonWalletService;
}


export function WalletsConnectors({ className, evmWallet, tonWallet }: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Observer>
            {() => (
                <div className={classNames('wallets-connectors', className)}>
                    {!evmWallet.isConnected && (
                        <Button
                            key="evm"
                            disabled={evmWallet.isInitializing || evmWallet.isConnecting}
                            type="secondary"
                            onClick={evmWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )}
                    {!tonWallet.isConnected && (
                        <Button
                            key="ton"
                            disabled={tonWallet.isInitializing || tonWallet.isConnecting}
                            type="secondary"
                            onClick={tonWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )}
                </div>
            )}
        </Observer>
    )
}
