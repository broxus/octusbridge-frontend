import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { EmptyWalletMinEversAmount } from '@/config'
import { DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'


export function SwapSwitcherFieldset(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()
    const everWallet = bridge.useEverWallet

    const onSwitch = async () => {
        if (bridge.isInsufficientEverBalance) {
            return
        }
        bridge.setData('depositType', bridge.isSwapEnabled ? 'default' : 'credit')
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
                                disabled={bridge.isFetching || bridge.isInsufficientEverBalance
                                    || bridge.evmPendingWithdrawal !== undefined}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SWAP_OPTION_LABEL',
                                }, {
                                    symbol: bridge.token?.symbol,
                                })}
                                onChange={bridge.isFetching ? undefined : onSwitch}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => {
                            switch (true) {
                                case !everWallet.isConnected: {
                                    return (
                                        <Button
                                            className="margin-top"
                                            disabled={(
                                                everWallet.isInitializing
                                                || everWallet.isConnecting
                                                || everWallet.isConnected
                                            )}
                                            size="md"
                                            type="primary"
                                            onClick={everWallet.connect}
                                        >
                                            {intl.formatMessage({
                                                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
                                            })}
                                        </Button>
                                    )
                                }

                                case (
                                    everWallet.isConnected
                                    && !everWallet.isContractUpdating
                                    && (
                                        everWallet.contract === undefined
                                        || !everWallet.contract?.isDeployed
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
                                    everWallet.isConnected
                                    && !everWallet.isContractUpdating
                                    && bridge.isInsufficientEverBalance
                                ): {
                                    return (
                                        <Alert
                                            className="margin-top"
                                            text={intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_SWAP_INSUFFICIENT_BALANCE_ALERT_TEXT',
                                            }, {
                                                minTons: (
                                                    new BigNumber(EmptyWalletMinEversAmount)
                                                        .shiftedBy(-DexConstants.CoinDecimals)
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
