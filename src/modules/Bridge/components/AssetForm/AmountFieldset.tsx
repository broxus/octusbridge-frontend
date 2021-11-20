import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { AmountField } from '@/components/common/AmountField'
import { useBridge } from '@/modules/Bridge/providers'
import {
    debounce,
    formattedAmount,
    isGoodBignumber,
    validateMaxValue,
    validateMinValue,
} from '@/utils'


export function AmountFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const onChangeAmount = debounce(() => {
        (async () => {
            await bridge.onChangeAmount()
        })()
    }, 50)

    const onChange = (value: string) => {
        bridge.changeData('amount', value)
        if (bridge.isSwapEnabled) {
            onChangeAmount()
        }
    }

    const onClickMax = () => {
        const decimals = bridge.isFromEvm ? bridge.amountDecimals : bridge.decimals
        let formattedBalance = new BigNumber(bridge.balance || 0)
        if (!isGoodBignumber(formattedBalance)) {
            return
        }
        if (bridge.decimals !== undefined && decimals !== undefined) {
            formattedBalance = formattedBalance
                .shiftedBy(-bridge.decimals)
                .dp(decimals, BigNumber.ROUND_DOWN)
        }
        onChange(formattedBalance.toFixed())
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <AmountField
                                decimals={bridge.isFromEvm ? bridge.amountDecimals : bridge.decimals}
                                disabled={bridge.token === undefined}
                                displayMaxButton={bridge.balance !== undefined && bridge.balance !== '0'}
                                isValid={bridge.isAmountValid}
                                maxValue={bridge.balance}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_PLACEHOLDER',
                                })}
                                value={bridge.amount}
                                onClickMax={onClickMax}
                                onChange={onChange}
                            />
                        )}
                    </Observer>
                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                const decimals = bridge.isFromEvm ? bridge.amountDecimals : bridge.decimals
                                let isMinValueValid = true
                                if (bridge.isSwapEnabled && isGoodBignumber(bridge.amountNumber)) {
                                    isMinValueValid = validateMinValue(
                                        bridge.minAmount,
                                        bridge.amount,
                                        decimals,
                                    )
                                }
                                const isMaxValueValid = bridge.amount.length > 0
                                    ? validateMaxValue(
                                        bridge.balanceNumber.toFixed(),
                                        bridge.amount,
                                    )
                                    : true

                                switch (true) {
                                    case !isMinValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.minAmount || 0,
                                                        decimals,
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case !isMaxValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.balanceNumber.toFixed(),
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case bridge.token !== undefined:
                                        return (
                                            <>
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_BALANCE_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.balance || 0,
                                                        bridge.decimals,
                                                    ),
                                                })}
                                            </>
                                        )

                                    default:
                                        return <>&nbsp;</>
                                }
                            }}
                        </Observer>
                    </div>

                    {process.env.NODE_ENV !== 'production' && (
                        <div className="crosschain-transfer__control-hint">
                            <Observer>
                                {() => (
                                    <>
                                        Min value:
                                        {' '}
                                        {formattedAmount(
                                            bridge.minAmount || 0,
                                            bridge.isFromEvm ? bridge.amountDecimals : bridge.decimals,
                                        )}
                                    </>
                                )}
                            </Observer>
                        </div>
                    )}
                </div>
            </div>
        </fieldset>
    )
}
