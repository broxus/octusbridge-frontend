import * as React from 'react'

import './index.scss'

export const NUM_REGEXP = /^\d*\.?\d*$/

type Props = {
    value: string | undefined;
    regexp?: RegExp;
    placeholder?: string;
    onChange: (value: string | undefined) => void;
}

export function TextFilter({
    value,
    regexp,
    placeholder,
    onChange,
}: Props): JSX.Element {
    const change = (e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget.value) {
            onChange(undefined)
            return
        }

        if (regexp) {
            onChange(regexp.test(e.currentTarget.value) ? e.currentTarget.value : value)
            return
        }

        onChange(e.currentTarget.value)
    }

    return (
        <input
            type="text"
            className="form-input"
            placeholder={placeholder}
            onChange={change}
            value={value || ''}
        />
    )
}
