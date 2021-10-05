import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'
import classNames from 'classnames'

import { Select } from '@/components/common/Select'
import { TokenCache } from '@/stores/TokensCacheService'
import { useAmountField } from '@/hooks/useAmountField'


type Props = {
    amount: string;
    balance?: string;
    changeAmount: (value: string) => void;
    changeToken: (value?: string) => void;
    isAmountValid?: boolean;
    token?: TokenCache;
    tokens: TokenCache[];
}


export function AssetForm({
    amount,
    balance,
    changeAmount,
    changeToken,
    isAmountValid,
    token,
    tokens,
}: Props): JSX.Element {
    const intl = useIntl()
    const field = useAmountField({ value: amount, token, onChange: changeAmount })

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_ASSET_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <fieldset className="form-fieldset">
                    <legend className="form-legend">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_LABEL',
                        })}
                    </legend>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <Select
                                        className="rc-select--lg"
                                        options={tokens.map(({ symbol, root }) => ({
                                            label: symbol,
                                            value: root,
                                        }))}
                                        placeholder={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                                        })}
                                        value={token?.root}
                                        onChange={changeToken}
                                    />
                                )}
                            </Observer>
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                </fieldset>

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
                                    <input
                                        className={classNames([
                                            'form-input',
                                            'form-input--lg',
                                        ], {
                                            invalid: !isAmountValid,
                                        })}
                                        placeholder={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_PLACEHOLDER',
                                        })}
                                        type="text"
                                        value={amount}
                                        onChange={field.onChange}
                                    />
                                )}
                            </Observer>
                            <Observer>
                                {() => (token !== undefined ? (
                                    <div className="crosschain-transfer__control-hint">
                                        {intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_BALANCE_HINT',
                                        }, {
                                            symbol: token?.symbol,
                                            value: balance || 0,
                                        })}
                                    </div>
                                ) : null)}
                            </Observer>
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
