import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { TokenAmountField } from '@/components/common/TokenAmountField'
import { DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount, isGoodBignumber } from '@/utils'


export function EversAmountFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const everWallet = bridge.useEverWallet

    const onChange = (value: string): void => {
        bridge.setData('eversAmount', value)
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_TONS_AMOUNT_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <TokenAmountField
                                decimals={DexConstants.CoinDecimals}
                                disabled={bridge.isFetching}
                                displayMaxButton={false}
                                isValid={bridge.isEversAmountValid}
                                placeholder="0"
                                suffix={(
                                    <div className="amount-field-suffix">
                                        <Icon icon="everCoinIcon" ratio={1.2} />
                                        <span>{DexConstants.CoinSymbol}</span>
                                    </div>
                                )}
                                token={bridge.token}
                                size="md"
                                value={bridge.eversAmount || ''}
                                onChange={bridge.isFetching ? undefined : onChange}
                            />
                        )}
                    </Observer>

                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                const isInputEmpty = !bridge.eversAmount || bridge.eversAmount?.length === 0
                                let isMaxValueValid = true

                                if (bridge.eversAmountNumber.isZero()) {
                                    isMaxValueValid = true
                                }
                                else if (!isGoodBignumber(bridge.maxEversAmount || 0)) {
                                    isMaxValueValid = false
                                }
                                else if (isGoodBignumber(bridge.maxEversAmount || 0)) {
                                    isMaxValueValid = new BigNumber(bridge.maxEversAmount || 0)
                                    .gte(bridge.eversAmountNumber.shiftedBy(everWallet.coin.decimals))
                                }

                                switch (true) {
                                    case !isMaxValueValid && !isInputEmpty:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_TONS_AMOUNT_HINT',
                                                }, {
                                                    symbol: DexConstants.CoinSymbol,
                                                    value: formattedAmount(
                                                        bridge.maxEversAmount,
                                                        DexConstants.CoinDecimals,
                                                        { preserve: true },
                                                    ),
                                                })}
                                            </span>
                                        )

                                    default:
                                        return <>&nbsp;</>
                                }
                            }}
                        </Observer>
                    </div>

                    {process.env.NODE_ENV !== 'production' && (
                        <React.Fragment key="amounts">
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Min value: '}
                                            {formattedAmount(
                                                bridge.minEversAmount,
                                                DexConstants.CoinDecimals,
                                                { roundOn: false, preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Max value: '}
                                            {formattedAmount(
                                                bridge.maxEversAmount,
                                                DexConstants.CoinDecimals,
                                                { roundOn: false, preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </fieldset>
    )
}
