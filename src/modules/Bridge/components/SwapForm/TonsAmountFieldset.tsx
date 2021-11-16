import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { TokenAmountField } from '@/components/common/TokenAmountField'
import { Icon } from '@/components/common/Icon'
import { DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'
import {
    debounce,
    formattedAmount,
    isGoodBignumber,
    validateMaxValue,
    validateMinValue,
} from '@/utils'


export function TonsAmountFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const changeTonsAmountRecalculate = debounce(() => {
        (async () => {
            await bridge.onChangeTonsAmount()
        })()
    }, 400)

    const onChangeTonsAmount = (value: string) => {
        bridge.changeData('tonsAmount', value)
        changeTonsAmountRecalculate()
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
                                decimals={DexConstants.TONDecimals}
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
                        )}
                    </Observer>
                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                let isMinValueValid = isGoodBignumber(bridge.tokensAmountNumber, false)

                                if (bridge.isInsufficientTonBalance) {
                                    isMinValueValid = validateMinValue(
                                        bridge.minTonsAmount,
                                        bridge.tonsAmount,
                                        DexConstants.TONDecimals,
                                    )
                                }
                                else if (bridge.tonsAmount && isGoodBignumber(bridge.tonsAmountNumber, false)) {
                                    isMinValueValid = validateMinValue(
                                        '0',
                                        bridge.tonsAmount,
                                        DexConstants.TONDecimals,
                                    )
                                }

                                const isMaxValueValid = isGoodBignumber(new BigNumber(bridge.maxTonsAmount || 0))
                                    ? validateMaxValue(
                                        bridge.maxTonsAmount,
                                        bridge.tonsAmount,
                                        DexConstants.TONDecimals,
                                    )
                                    : true

                                switch (true) {
                                    case !isMinValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_TONS_AMOUNT_HINT',
                                                }, {
                                                    symbol: DexConstants.TONSymbol,
                                                    value: formattedAmount(
                                                        bridge.minTonsAmount || 0,
                                                        DexConstants.TONDecimals,
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case !isMaxValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_TONS_AMOUNT_HINT',
                                                }, {
                                                    symbol: DexConstants.TONSymbol,
                                                    value: formattedAmount(
                                                        bridge.maxTonsAmount || 0,
                                                        DexConstants.TONDecimals,
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
                    {/*
                    {process.env.NODE_ENV !== 'production' && (
                        <React.Fragment key="amounts">
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            Min value:
                                            {' '}
                                            {formattedAmount(bridge.minTonsAmount || 0, DexConstants.TONDecimals)}
                                        </>
                                    )}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            Max value:
                                            {' '}
                                            {formattedAmount(bridge.maxTonsAmount || 0, DexConstants.TONDecimals)}
                                        </>
                                    )}
                                </Observer>
                            </div>
                        </React.Fragment>
                    )}
                    */}
                </div>
            </div>
        </fieldset>
    )
}
