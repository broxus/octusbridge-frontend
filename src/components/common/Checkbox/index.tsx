import * as React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    color?: string;
    onChange?: (checked: boolean) => void;
}

export function Checkbox({
    checked,
    label,
    disabled,
    color,
    onChange,
}: Props): JSX.Element {
    return (
        <label
            className={classNames('checkbox', {
                checkbox_disabled: disabled,
            })}
        >
            <input
                type="checkbox"
                checked={Boolean(checked)}
                onChange={() => onChange && onChange(!checked)}
                disabled={disabled}
            />
            <div
                className="checkbox__icon"
                style={{
                    background: color,
                    borderColor: color,
                }}
            >
                <Icon icon="check" />
            </div>
            {label && (
                <div>{label}</div>
            )}
        </label>
    )
}
