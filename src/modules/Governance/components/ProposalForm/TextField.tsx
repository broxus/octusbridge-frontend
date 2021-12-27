import * as React from 'react'
import classNames from 'classnames'

import { Counter } from '@/components/common/Counter'

import './index.scss'

type Props = {
    label: string;
    value: string;
    valid?: boolean;
    limit?: number;
    length?: number;
    disabled?: boolean;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function TextField({
    label,
    value,
    valid,
    limit,
    length,
    disabled,
    placeholder,
    onChange,
}: Props): JSX.Element {
    const [dirty, setDirty] = React.useState(false)

    const change = (e: React.FormEvent<HTMLInputElement>) => {
        setDirty(true)
        onChange(e.currentTarget.value)
    }

    return (
        <div className="proposal-form-popup__field">
            <legend className="form-legend">
                {label}
            </legend>

            <input
                type="text"
                value={value}
                onChange={change}
                placeholder={placeholder}
                disabled={disabled}
                className={classNames('form-input', {
                    invalid: valid === false && (dirty || value.length > 0),
                })}
            />

            {limit !== undefined && length !== undefined && (
                <Counter
                    maxLength={limit}
                    length={length}
                />
            )}
        </div>
    )
}
