import * as React from 'react'

import './index.scss'
import classNames from 'classnames'


type Props<T> = {
    annotation?: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    label?: React.ReactNode;
    name?: string;
    onChange?: (value: T) => void;
}

export function SimpleRadio<T extends string>({
    annotation,
    checked,
    disabled,
    label,
    name,
    onChange: onChangeCallback,
}: Props<T>): JSX.Element {
    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        if (disabled) {
            return
        }
        onChangeCallback?.(event.target.name as T)
    }

    return (
        <label
            className={classNames('simple-radio', {
                disabled,
            })}
        >
            <input
                checked={checked}
                disabled={disabled}
                hidden
                name={name}
                type="radio"
                onChange={onChange}
            />
            <div className="simple-radio__main">
                <span className="simple-radio__title">{label}</span>
                <div
                    dangerouslySetInnerHTML={{
                        __html: annotation as string,
                    }}
                />
            </div>
        </label>
    )
}
