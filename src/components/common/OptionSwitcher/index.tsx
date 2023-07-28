import classNames from 'classnames'
import * as React from 'react'

import { Switcher } from '@/components/common/Switcher'

import './index.scss'

type Props = {
    annotation?: React.ReactNode
    checked?: boolean
    className?: string
    disabled?: boolean
    label?: React.ReactNode
    id?: string
    showTrigger?: boolean
    onChange?: () => void
}

export function OptionSwitcher({
    annotation,
    className,
    checked,
    disabled,
    label,
    id,
    showTrigger = true,
    onChange,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('option-switcher', className, {
                disabled,
            })}
        >
            {showTrigger && (
                <Switcher
                    checked={checked}
                    disabled={disabled}
                    id={id}
                    onChange={onChange}
                />
            )}
            <div className="option-switcher__main">
                <label className="option-switcher__label" htmlFor={id}>
                    {label}
                </label>
                <div className="option-switcher__annotation">{annotation}</div>
            </div>
        </div>
    )
}
