import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { TokenAmountField } from '@/components/common/TokenAmountField'
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
    }, 50)

    const onChange = (value: string) => {
        bridge.changeData('tonsAmount', value)
        changeTonsAmountRecalculate()
    }

    // const onClickMax = () => {
    //     let formattedBalance = new BigNumber(bridge.maxTonsAmount || 0)
    //     if (!isGoodBignumber(formattedBalance)) {
    //         return
    //     }
    //     formattedBalance = formattedBalance.shiftedBy(-DexConstants.TONDecimals)
    //     onChange(formattedBalance.toFixed())
    // }

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
                                displayMaxButton={false}
                                // displayMaxButton={bridge.maxTonsAmount !== undefined && bridge.maxTonsAmount !== '0'}
                                isValid={bridge.isTonsAmountValid}
                                placeholder="0"
                                suffix={(
                                    <div className="amount-field-suffix">
                                        <Icon icon="tonWalletIcon" ratio={1.715} />
                                        <span>{DexConstants.TONSymbol}</span>
                                    </div>
                                )}
                                token={bridge.token}
                                size="md"
                                value={bridge.tonsAmount || ''}
                                onChange={onChange}
                                // onClickMax={onClickMax}
                            />
                        )}
                    </Observer>

                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                let isMinValueValid = isGoodBignumber(bridge.tokenAmountNumber, false)

                                if (bridge.isInsufficientTonBalance) {
                                    isMinValueValid = validateMinValue(
                                        bridge.minTonsAmount,
                                        bridge.tonsAmount,
                                        DexConstants.TONDecimals,
                                    )
                                }
                                else if (
                                    bridge.tonsAmount
                                    && bridge.tonsAmount.length > 0
                                    && isGoodBignumber(bridge.tonsAmountNumber, false)
                                ) {
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
                </div>
            </div>
        </fieldset>
    )
}
