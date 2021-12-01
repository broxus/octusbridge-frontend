import * as React from 'react'
import classNames from 'classnames'

type Props = {
    label: string;
    placeholder: string;
    disabled?: boolean;
    value?: string;
    isValid?: boolean;
    onChange: (value: string) => void;
}

export function CreateRelayerTextField({
    label,
    placeholder,
    disabled,
    value = '',
    isValid,
    onChange,
}: Props): JSX.Element {
    const change = (e: React.FormEvent<HTMLInputElement>) => {
        onChange(e.currentTarget.value)
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {label}
            </legend>

            <input
                type="text"
                className={classNames('form-input form-input--md', {
                    invalid: !isValid && value,
                })}
                placeholder={placeholder}
                value={value}
                onChange={change}
                disabled={disabled}
            />
        </fieldset>
    )
}
