import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'
import { Skeleton } from '@/components/common/Skeleton'


export function SwapSwitcherFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const everWallet = bridge.useEverWallet
    const evmWallet = bridge.useEvmWallet

    const onSwitch = async (): Promise<void> => {
        if (bridge.isSwapEnabled) {
            await bridge.switchToDefault()
        }
        else {
            await bridge.switchToCredit()
        }
    }

    return (
        <fieldset className="form-fieldset">
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <OptionSwitcher
                                annotation={bridge.isSwapEnabled ? (
                                    <div className="text-sm">
                                        <span className="text-muted">Transaction cost</span>
                                        &nbsp;
                                        &nbsp;
                                        <span>
                                            {bridge.isCalculating ? (
                                                <Skeleton width={60} />
                                            ) : `${formattedTokenAmount(
                                                bridge.isFromEverscale
                                                    ? bridge.everscaleEvmCost
                                                    : bridge.evmEverscaleCost,
                                                bridge.isFromEverscale
                                                    ? everWallet.coin.decimals
                                                    : evmWallet.coin.decimals,
                                            )} ${bridge.isFromEverscale
                                                ? everWallet.coin.symbol
                                                : evmWallet.coin.symbol}`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-sm">
                                        <span className="text-muted">Your balance</span>
                                        &nbsp;
                                        &nbsp;
                                        <span>
                                            {bridge.isFetching ? (
                                                <Skeleton width={60} />
                                            ) : `${
                                                bridge.isFromEverscale
                                                    ? `${formattedTokenAmount(
                                                        everWallet.balance ?? 0,
                                                        everWallet.coin.decimals,
                                                    )} ${everWallet.coin.symbol}`
                                                    : `${formattedTokenAmount(
                                                        evmWallet.balance ?? 0,
                                                        evmWallet.coin.decimals,
                                                    )} ${evmWallet.coin.symbol}`
                                            }`}
                                        </span>
                                    </div>
                                )}
                                checked={bridge.isSwapEnabled}
                                id="gas-fees"
                                disabled={(
                                    bridge.isFetching
                                    || bridge.evmPendingWithdrawal !== undefined
                                )}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_MULTIVAULT_SWAP_OPTION_LABEL',
                                }, {
                                    symbol: bridge.leftNetwork?.currencySymbol,
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

                                default:
                                    return (
                                        <div
                                            className="text-sm text-muted margin-top"
                                            dangerouslySetInnerHTML={{
                                                __html: intl.formatMessage({
                                                    id: bridge.isSwapEnabled
                                                        ? 'CROSSCHAIN_TRANSFER_SWAP_OPTION_ENABLED_NOTE'
                                                        : 'CROSSCHAIN_TRANSFER_SWAP_OPTION_NOTE',
                                                }, {
                                                    symbol: bridge.rightNetwork?.currencySymbol,
                                                }, { ignoreTag: true }),
                                            }}
                                        />
                                    )
                            }
                        }}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
