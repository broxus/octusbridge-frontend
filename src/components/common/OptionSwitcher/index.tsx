import * as React from 'react'
import classNames from 'classnames'

import { Switcher } from '@/components/common/Switcher'

import './index.scss'


type Props = {
    annotation?: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    label?: React.ReactNode;
    id?: string;
    onChange?: () => void;
}


export function OptionSwitcher({
    annotation,
    checked,
    disabled,
    label,
    id,
    onChange,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('option-switcher', {
                disabled,
            })}
        >
            <Switcher
                checked={checked}
                disabled={disabled}
                id={id}
                onChange={onChange}
            />
            <div className="option-switcher__main">
                <label
                    className="option-switcher__label"
                    htmlFor={id}
                >
                    {label}
                </label>
                <div
                    className="option-switcher__annotation"
                    dangerouslySetInnerHTML={{
                        __html: annotation as string,
                    }}
                />
            </div>
        </div>
    )
}
