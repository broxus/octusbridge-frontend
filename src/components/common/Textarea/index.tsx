import * as React from 'react'
import classNames from 'classnames'

import { Counter } from '@/components/common/Counter'

import './index.scss'

type Props = {
    valid?: boolean;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    showCounter?: boolean;
    rows?: number;
    onChange: (value: string) => void;
}

export function Textarea({
    valid,
    value,
    placeholder,
    disabled,
    maxLength,
    showCounter = true,
    rows,
    onChange,
}: Props): JSX.Element {
    const [dirty, setDirty] = React.useState(false)

    const change = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setDirty(true)
        onChange(e.currentTarget.value)
    }

    return (
        <div className="textarea">
            <textarea
                rows={rows}
                maxLength={maxLength}
                onChange={change}
                disabled={disabled}
                className={classNames('form-input textarea__input', {
                    invalid: valid === false && (dirty || value.length > 0),
                })}
                placeholder={placeholder}
                value={value}
            />

            {showCounter && maxLength !== undefined && (
                <Counter
                    length={value.length}
                    maxLength={maxLength}
                />
            )}
        </div>
    )
}
