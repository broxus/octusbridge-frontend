import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { EverWalletService } from '@/stores/EverWalletService'

import './index.scss'


type Props = {
    className?: string;
    evmWallet: EvmWalletService;
    everWallet: EverWalletService;
}


export function WalletsConnectors({ className, evmWallet, everWallet }: Props): JSX.Element {
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
                    {!everWallet.isConnected && (
                        <Button
                            key="ton"
                            disabled={everWallet.isInitializing || everWallet.isConnecting}
                            type="secondary"
                            onClick={everWallet.connect}
                        >
                            {intl.formatMessage({
                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                            })}
                        </Button>
                    )}
                </div>
            )}
        </Observer>
    )
}
