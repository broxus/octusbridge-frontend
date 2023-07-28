import { Observer, observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { TokenAmountField } from '@/components/common/TokenAmountField'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount } from '@/utils'

export const EversAmountFieldset = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()

    const onChange = (value: string): void => {
        bridge.setData('expectedEversAmount', value)
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
                    <TokenAmountField
                        decimals={bridge.tvmWallet.coin.decimals}
                        disabled={bridge.isFetching}
                        displayMaxButton={false}
                        isValid={bridge.isExpectedEversAmountValid}
                        placeholder="0"
                        suffix={(
                            <div className="amount-field-suffix">
                                <Icon icon="everCoinIcon" ratio={1.2} />
                                <span>{bridge.tvmWallet.coin.symbol}</span>
                            </div>
                        )}
                        token={bridge.token}
                        size="md"
                        value={bridge.expectedEversAmount || ''}
                        onChange={bridge.isFetching ? undefined : onChange}
                    />

                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                const isInputEmpty = (
                                    !bridge.expectedEversAmount
                                    || bridge.expectedEversAmount?.length === 0
                                )

                                switch (true) {
                                    case !bridge.isExpectedEversAmountValid && !isInputEmpty:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage(
                                                    {
                                                        id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_TONS_AMOUNT_HINT',
                                                    },
                                                    {
                                                        symbol: bridge.tvmWallet.coin.symbol,
                                                        value: formattedAmount(
                                                            bridge.maxExpectedEversAmount,
                                                            bridge.tvmWallet.coin.decimals,
                                                            { preserve: true },
                                                        ),
                                                    },
                                                )}
                                            </span>
                                        )

                                    default:
                                        return <>&nbsp;</>
                                }
                            }}
                        </Observer>
                    </div>

                    {process.env.NODE_ENV !== 'production' && (
                        <div className="crosschain-transfer__control-hint">
                            {`> Max value: ${formattedAmount(
                                bridge.maxExpectedEversAmount,
                                bridge.tvmWallet.coin.decimals,
                                { preserve: true, roundOn: false },
                            )}`}
                        </div>
                    )}
                </div>
            </div>
        </fieldset>
    )
})
