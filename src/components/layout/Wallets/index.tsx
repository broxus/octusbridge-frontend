import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Drop } from '@/components/common/Drop'
import { Icon } from '@/components/common/Icon'
import { EverWallet, EvmWallet } from '@/modules/Accounts'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'

import './index.scss'

export function Wallets(): JSX.Element {
    const intl = useIntl()
    const everWallet = useEverWallet()
    const evmWallet = useEvmWallet()

    return (
        <div className="wallets">
            <Observer>
                {() => (
                    <Drop
                        overlay={(
                            <ul className="wallets-list">
                                <li>
                                    <EverWallet />
                                </li>
                                <li>
                                    <EvmWallet />
                                </li>
                            </ul>
                        )}
                        overlayClassName="wallets-drop"
                        placement="bottom-right"
                        trigger="click"
                    >
                        <Button className="wallets-drop-trigger" type="secondary">
                            {(everWallet.isReady || evmWallet.isReady) ? (
                                <div className="wallets-icons">
                                    <Icon
                                        icon="everscale1BlockchainIcon"
                                        className={classNames({
                                            disconnected: !everWallet.isReady,
                                        })}
                                    />
                                    <Icon
                                        icon="evm1BlockchainIcon"
                                        className={classNames({
                                            disconnected: !evmWallet.isReady,
                                        })}
                                    />
                                </div>
                            ) : intl.formatMessage({
                                id: 'WALLETS_CONNECT_BTN_TEXT',
                            })}
                            <Icon icon="arrowDown" />
                        </Button>
                    </Drop>
                )}
            </Observer>
        </div>
    )
}
