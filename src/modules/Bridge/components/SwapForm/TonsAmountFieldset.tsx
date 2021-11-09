import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { TokenAmountField } from '@/components/common/TokenAmountField'
import { Icon } from '@/components/common/Icon'
import { DexConstants } from '@/misc'
import { useBridge } from '@/modules/Bridge/providers'
import { debounce } from '@/utils'


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
                        )}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
