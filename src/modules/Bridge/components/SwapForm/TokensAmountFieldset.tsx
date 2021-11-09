import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { TokenAmountField } from '@/components/common/TokenAmountField'
import { useBridge } from '@/modules/Bridge/providers'
import { debounce, formattedAmount } from '@/utils'


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
    )
}
