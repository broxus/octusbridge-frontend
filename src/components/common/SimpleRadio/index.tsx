import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


type Props<T> = {
    annotation?: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    label?: React.ReactNode;
    name?: string;
    children?: React.ReactNode;
    onChange?: (value: T) => void;
}

export function SimpleRadio<T extends string>({
    annotation,
    checked,
    disabled,
    label,
    name,
    onChange: onChangeCallback,
    children,
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
                {children && (
                    <div className="simple-radio__content">
                        {children}
                    </div>
                )}
            </div>
        </label>
    )
}
