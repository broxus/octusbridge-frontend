import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Icon } from '@/components/common/Icon'
import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { BridgeConstants, DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'
import { TokenAmountField } from '@/components/common/TokenAmountField'
import { debounce, formattedAmount } from '@/utils'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'


export function SwapForm(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const tonWallet = bridge.useTonWallet

    const changeTokensAmountRecalculate = debounce(() => {
        (async () => {
            await bridge.onChangeTokensAmount()
        })()
    }, 400)

    const changeTonsAmountRecalculate = debounce(() => {
        (async () => {
            await bridge.onChangeTonsAmount()
        })()
    }, 400)

    const onSwitch = () => {
        if (bridge.isInsufficientTonBalance) {
            return
        }
        bridge.changeState('isSwapEnabled', !bridge.isSwapEnabled)
    }

    const onChangeTokensAmount = (value: string) => {
        bridge.changeData('tokensAmount', value)
        changeTokensAmountRecalculate()
    }

    const onChangeTonsAmount = (value: string) => {
        bridge.changeData('tonsAmount', value)
        changeTonsAmountRecalculate()
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SWAP_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
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
                                            && tonWallet.balance !== undefined
                                            && bridge.isInsufficientTonBalance
                                        ): {
                                            return (
                                                <Alert
                                                    className="margin-top"
                                                    text={intl.formatMessage({
                                                        id: 'CROSSCHAIN_TRANSFER_SWAP_INSUFFICIENT_BALANCE_ALERT_TEXT',
                                                    }, {
                                                        minTons: (
                                                            new BigNumber(BridgeConstants.CreditBody)
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
                <Observer>
                    {() => (
                        <>
                            {bridge.isSwapEnabled ? (
                                <fieldset className="form-fieldset">
                                    <legend className="form-legend">
                                        Tokens receive
                                    </legend>
                                    <div className="crosschain-transfer__controls">
                                        <div className="crosschain-transfer__control">
                                            <TokenAmountField
                                                decimals={bridge.decimals}
                                                isValid={bridge.isTokensAmountValid}
                                                placeholder="50"
                                                token={bridge.token}
                                                value={bridge.tokensAmount}
                                                onChange={onChangeTokensAmount}
                                            />
                                            <div className="crosschain-transfer__control-hint">
                                                <Observer>
                                                    {() => (
                                                        <>
                                                            {bridge.minReceiveTokens !== undefined
                                                                ? intl.formatMessage({
                                                                    id: 'CROSSCHAIN_TRANSFER_SWAP_MINIMUM_RECEIVED_HINT',
                                                                }, {
                                                                    symbol: bridge.token?.symbol || '',
                                                                    value: formattedAmount(
                                                                        bridge.minReceiveTokens || 0,
                                                                        bridge.token?.decimals,
                                                                    ),
                                                                })
                                                                : <>&nbsp;</>}
                                                        </>
                                                    )}
                                                </Observer>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            ) : null}
                        </>
                    )}
                </Observer>
                <Observer>
                    {() => (
                        <>
                            {bridge.isSwapEnabled ? (
                                <fieldset className="form-fieldset">
                                    <legend className="form-legend">
                                        TON Crystals minimum receive
                                    </legend>
                                    <div className="crosschain-transfer__controls">
                                        <div className="crosschain-transfer__control">
                                            <TokenAmountField
                                                decimals={bridge.decimals}
                                                isValid={bridge.isTonsAmountValid}
                                                placeholder="0"
                                                suffix={(
                                                    <div className="amount-field-suffix">
                                                        <Icon icon="tonWalletIcon" ratio={1.715} />
                                                        <span>{DexConstants.TONSymbol}</span>
                                                    </div>
                                                )}
                                                token={bridge.token}
                                                value={bridge.tonsAmount}
                                                onChange={onChangeTonsAmount}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            ) : null}
                        </>
                    )}
                </Observer>
            </form>
        </div>
    )
}
