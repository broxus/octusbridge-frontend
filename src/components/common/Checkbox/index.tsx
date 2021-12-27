import * as React from 'react'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}

export function Checkbox({
    checked,
    label,
    disabled,
    onChange,
}: Props): JSX.Element {
    return (
        <label className="checkbox">
            <input
                type="checkbox"
                checked={Boolean(checked)}
                onChange={() => onChange && onChange(!checked)}
                disabled={disabled}
            />
            <div className="checkbox__icon">
                <Icon icon="check" />
            </div>
            {label && (
                <div>{label}</div>
            )}
        </label>
    )
}
