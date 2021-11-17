import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { TokenAmountField } from '@/components/common/TokenAmountField'
import { useBridge } from '@/modules/Bridge/providers'
import {
    debounce,
    formattedAmount,
    isGoodBignumber,
    validateMaxValue,
    validateMinValue,
} from '@/utils'


export function TokensAmountFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const onChangeTokensAmount = debounce(() => {
        (async () => {
            await bridge.onChangeTokensAmount()
        })()
    }, 400)

    const onChange = (value: string) => {
        bridge.changeData('tokensAmount', value)
        onChangeTokensAmount()
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKENS_AMOUNT_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <TokenAmountField
                                decimals={bridge.decimals}
                                isValid={bridge.isTokensAmountValid}
                                placeholder="0"
                                token={bridge.token}
                                value={bridge.tokensAmount}
                                onChange={onChange}
                            />
                        )}
                    </Observer>
                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                const isMinValueValid = (
                                    bridge.tokensAmount
                                    && isGoodBignumber(bridge.tokensAmountNumber, false)
                                )
                                    ? validateMinValue('0', bridge.tokensAmount, bridge.decimals)
                                    : isGoodBignumber(bridge.tokensAmountNumber, false)

                                const isMaxValueValid = validateMaxValue(
                                    bridge.maxTokensAmount,
                                    bridge.tokensAmount,
                                    bridge.decimals,
                                )

                                switch (true) {
                                    case !isMinValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_TOKENS_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(0, bridge.decimals),
                                                })}
                                            </span>
                                        )

                                    case !isMaxValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_TOKENS_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.maxTokensAmount || 0,
                                                        bridge.decimals,
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case bridge.minReceiveTokens !== undefined:
                                        return (
                                            <>
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_SWAP_MINIMUM_RECEIVED_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol || '',
                                                    value: formattedAmount(
                                                        bridge.minReceiveTokens || 0,
                                                        bridge.token?.decimals,
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
                    {/*
                    {process.env.NODE_ENV !== 'production' && (
                        <React.Fragment key="amounts">
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => <>Min value: 0</>}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            Max value:
                                            {' '}
                                            {formattedAmount(bridge.maxTokensAmount || 0, bridge.decimals)}
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
