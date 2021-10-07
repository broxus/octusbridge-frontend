import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'

import './index.scss'


type Props = {
    className?: string;
}

export function WalletsConnectors({ className }: Props): JSX.Element {
    const intl = useIntl()
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

    return (
        <Observer>
            {() => (
                <div className={classNames('wallets-connectors', className)}>
                    <button
                        type="button"
                        className="btn btn-s btn--primary"
                        disabled={evmWallet.isInitializing || evmWallet.isConnecting || evmWallet.isConnected}
                        onClick={evmWallet.connect}
                    >
                        {intl.formatMessage({
                            id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                        })}
                    </button>
                    <button
                        type="button"
                        className="btn btn-s btn--primary"
                        disabled={tonWallet.isInitializing || tonWallet.isConnecting || tonWallet.isConnected}
                        onClick={tonWallet.connect}
                    >
                        {intl.formatMessage({
                            id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                        })}
                    </button>
                </div>
            )}
        </Observer>
    )
}