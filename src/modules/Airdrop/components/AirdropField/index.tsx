import * as React from 'react'
import classNames from 'classnames'

import { TokenBadge } from '@/components/common/TokenBadge'
import { TokenCache } from '@/types'


type Props = {
    disabled?: boolean;
    label: string;
    id?: string;
    isValid?: boolean;
    readOnly?: boolean;
    token?: TokenCache;
    value?: string;
    onChange?: (value: string) => void;
    onToggleTokensList?: () => void;
}

export function AirdropField({
    isValid = true,
    token,
    ...props
}: Props): JSX.Element {
    return (
        <label className="form-label" htmlFor={props.id}>
            <fieldset
                className={classNames('form-fieldset-composable', {
                    invalid: !isValid,
                })}
            >
                <div className="form-fieldset-composable__header">
                    <div>{props.label}</div>
                </div>
                <div className="form-fieldset-composable__main">
                    <input
                        className="form-input"
                        id={props.id}
                        inputMode="decimal"
                        pattern="^[0-9]*[.]?[0-9]*$"
                        placeholder="0.0"
                        readOnly
                        type="text"
                        disabled
                        value={props.value}
                    />
                    <div className="form-airdrop__token">
                        {token && (
                            <TokenBadge
                                uri={token.icon}
                                address={token.root}
                                symbol={token.symbol}
                                size="small"
                            />
                        )}
                    </div>
                </div>
            </fieldset>
        </label>
    )
}
