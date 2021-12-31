import * as React from 'react'
import classNames from 'classnames'

import { TokenIcon } from '@/components/common/TokenIcon'
import { TokenCache } from '@/stores/TokensCacheService'


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
                    <div className="staking-account-field__token">
                        <TokenIcon
                            size="small"
                            address={token?.root}
                            uri={token?.icon}
                        />
                        {token?.symbol}
                    </div>
                </div>
            </fieldset>
        </label>
    )
}
