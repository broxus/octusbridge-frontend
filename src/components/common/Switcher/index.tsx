import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


type Props = {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    onChange?: () => void;
}


export function Switcher({
    checked,
    disabled,
    id,
    onChange,
}: Props): JSX.Element {
    return (
        <label
            className={classNames('switcher', {
                disabled,
            })}
            htmlFor={id}
        >
            <input
                checked={checked}
                disabled={disabled}
                id={id}
                type="checkbox"
                onChange={onChange}
            />
            <span className="switcher__handle" />
        </label>
    )
}
