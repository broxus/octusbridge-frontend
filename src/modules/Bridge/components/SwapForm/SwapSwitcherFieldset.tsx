import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { Skeleton } from '@/components/common/Skeleton'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'

export function SwapSwitcherFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

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
                                            ) : `~${formattedTokenAmount(
                                                bridge.isFromTvm
                                                    ? bridge.tvmEvmCost
                                                    : bridge.evmTvmCost,
                                                bridge.isFromTvm
                                                    ? bridge.tvmWallet.coin.decimals
                                                    : bridge.evmWallet.coin.decimals,
                                            )} ${bridge.isFromTvm
                                                ? bridge.tvmWallet.coin.symbol
                                                : bridge.evmWallet.coin.symbol}`}
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
                                            ) : `~${
                                                bridge.isFromTvm
                                                    ? `${formattedTokenAmount(
                                                        bridge.tvmWallet.balance ?? 0,
                                                        bridge.tvmWallet.coin.decimals,
                                                    )} ${bridge.tvmWallet.coin.symbol}`
                                                    : `${formattedTokenAmount(
                                                        bridge.evmWallet.balance ?? 0,
                                                        bridge.evmWallet.coin.decimals,
                                                    )} ${bridge.evmWallet.coin.symbol}`
                                            }`}
                                        </span>
                                    </div>
                                )}
                                checked={bridge.isSwapEnabled}
                                id="gas-fees"
                                disabled={bridge.isFetching}
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
                        {() => (
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
                        )}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
