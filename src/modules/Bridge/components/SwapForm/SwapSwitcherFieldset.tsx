import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { BridgeConstants, DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'


export function SwapSwitcherFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const tonWallet = bridge.useTonWallet

    const onSwitch = async () => {
        if (bridge.isInsufficientTonBalance) {
            return
        }
        bridge.changeState('isSwapEnabled', !bridge.isSwapEnabled)
        await bridge.onSwapToggle()
    }

    return (
        <fieldset className="form-fieldset">
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <OptionSwitcher
                                checked={bridge.isSwapEnabled}
                                id="gas-fees"
                                disabled={bridge.isInsufficientTonBalance}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SWAP_OPTION_LABEL',
                                }, {
                                    symbol: bridge.token?.symbol,
                                })}
                                onChange={onSwitch}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => {
                            switch (true) {
                                case !tonWallet.isConnected: {
                                    return (
                                        <Button
                                            className="margin-top"
                                            disabled={(
                                                tonWallet.isInitializing
                                                || tonWallet.isConnecting
                                                || tonWallet.isConnected
                                            )}
                                            size="md"
                                            type="primary"
                                            onClick={tonWallet.connect}
                                        >
                                            {intl.formatMessage({
                                                id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT',
                                            })}
                                        </Button>
                                    )
                                }

                                case (
                                    tonWallet.isConnected
                                    && !tonWallet.isUpdatingContract
                                    && (
                                        tonWallet.contract === undefined
                                        || !tonWallet.contract?.isDeployed
                                    )
                                ): {
                                    return (
                                        <Alert
                                            className="margin-top"
                                            text={intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_SWAP_WALLET_NOT_DEPLOYED_ALERT_TEXT',
                                            })}
                                            title={intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_SWAP_WALLET_NOT_DEPLOYED_ALERT_TITLE',
                                            })}
                                            type="warning"
                                        />
                                    )
                                }

                                case (
                                    tonWallet.isConnected
                                    && !tonWallet.isUpdatingContract
                                    && bridge.isInsufficientTonBalance
                                ): {
                                    return (
                                        <Alert
                                            className="margin-top"
                                            text={intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_SWAP_INSUFFICIENT_BALANCE_ALERT_TEXT',
                                            }, {
                                                minTons: (
                                                    new BigNumber(BridgeConstants.EmptyWalletMinTonsAmount)
                                                        .shiftedBy(-DexConstants.TONDecimals)
                                                        .toFixed()
                                                ),
                                            }, {
                                                ignoreTag: true,
                                            })}
                                            title={intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_SWAP_INSUFFICIENT_BALANCE_ALERT_TITLE',
                                            })}
                                            type="warning"
                                        />
                                    )
                                }

                                default:
                                    return (
                                        <div className="text-sm text-muted margin-top">
                                            {intl.formatMessage({
                                                id: bridge.isSwapEnabled
                                                    ? 'CROSSCHAIN_TRANSFER_SWAP_OPTION_ENABLED_NOTE'
                                                    : 'CROSSCHAIN_TRANSFER_SWAP_OPTION_NOTE',
                                            })}
                                        </div>
                                    )
                            }
                        }}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
