import * as React from 'react'

import './index.scss'

type Props = {
    value: string | undefined;
    placeholder?: string;
    onChange: (value: string | undefined) => void;
}

export function TextFilter({
    value,
    placeholder,
    onChange,
}: Props): JSX.Element {
    const change = (e: React.FormEvent<HTMLInputElement>) => {
        onChange(e.currentTarget.value || undefined)
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
