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
    const { bridge } = useBridge()

    const onChangeTokensAmount = debounce(() => {
        (async () => {
            await bridge.onChangeTokensAmount()
        })()
    }, 50)

    const onChange = (value: string) => {
        bridge.setData('tokenAmount', value)
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
                                decimals={bridge.token?.decimals}
                                disabled={bridge.isFetching || !bridge.amount}
                                displayMaxButton={false}
                                isValid={bridge.isTokensAmountValid}
                                placeholder={!bridge.amount ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_FIRST_PLACEHOLDER',
                                }) : '0'}
                                token={bridge.token}
                                size="md"
                                value={bridge.tokenAmount || ''}
                                onChange={bridge.isFetching ? undefined : onChange}
                            />
                        )}
                    </Observer>

                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                const isMinValueValid = (
                                    bridge.tokenAmount
                                    && bridge.tokenAmount.length > 0
                                    && isGoodBignumber(bridge.tokenAmountNumber, false)
                                )
                                    ? validateMinValue('0', bridge.tokenAmount, bridge.token?.decimals)
                                    : isGoodBignumber(bridge.tokenAmountNumber, false)

                                const isMaxValueValid = validateMaxValue(
                                    bridge.maxTokenAmount,
                                    bridge.tokenAmount,
                                    bridge.token?.decimals,
                                )

                                switch (true) {
                                    case !isMinValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_TOKENS_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        0,
                                                        bridge.token?.decimals,
                                                        { preserve: true },
                                                    ),
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
                                                        bridge.maxTokenAmount || 0,
                                                        bridge.token?.decimals,
                                                        { preserve: true },
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
                                                        { preserve: true },
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
                        <React.Fragment key="amounts">
                            <div className="crosschain-transfer__control-hint">
                                {'> Min value: 0'}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Max value: '}
                                            {formattedAmount(
                                                bridge.maxTokenAmount,
                                                bridge.token?.decimals,
                                                { preserve: true },
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
