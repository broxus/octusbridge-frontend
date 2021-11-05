import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
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
                    <Button
                        disabled={evmWallet.isInitializing || evmWallet.isConnecting || evmWallet.isConnected}
                        type="primary"
                        onClick={evmWallet.connect}
                    >
                        {intl.formatMessage({
                            id: 'EVM_WALLET_CONNECT_BTN_TEXT',
                        })}
                    </Button>
                    <Button
                        disabled={tonWallet.isInitializing || tonWallet.isConnecting || tonWallet.isConnected}
                        type="primary"
                        onClick={tonWallet.connect}
                    >
                        {intl.formatMessage({
                            id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                        })}
                    </Button>
                </div>
            )}
        </Observer>
    )
}
