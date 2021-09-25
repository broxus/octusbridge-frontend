import * as React from 'react'

import './index.scss'


type Props<T> = {
    annotation?: React.ReactNode;
    checked?: boolean;
    label?: React.ReactNode;
    name?: string;
    onChange?: (value: T) => void;
}

export function SimpleRadio<T extends string>({
    annotation,
    label,
    checked,
    name,
    onChange: onChangeCallback,
}: Props<T>): JSX.Element {
    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        onChangeCallback?.(event.target.name as T)
    }

    return (
        <label className="simple-radio">
            <input
                type="radio"
                name={name}
                checked={checked}
                hidden
                onChange={onChange}
            />
            <div className="simple-radio__main">
                <span className="simple-radio__title">{label}</span>
                <div>{annotation}</div>
            </div>
        </label>
    )
}
