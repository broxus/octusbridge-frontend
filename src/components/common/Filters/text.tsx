import * as React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'
import './index.scss'

export const NUM_REGEXP = /^\d*\.?\d*$/

type Props = {
    value?: string;
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

    const clear = () => {
        onChange(undefined)
    }

    return (
        <div
            className={classNames('filters-text-field', {
                'filters-text-field_dirty': value && value.length > 0,
            })}
        >
            <input
                type="text"
                className="form-input filters-text-field__input"
                placeholder={placeholder}
                onChange={change}
                value={value || ''}
            />

            {value && value.length > 0 && (
                <button
                    className="clear-input"
                    type="button"
                    onClick={clear}
                    tabIndex={-1}
                >
                    <Icon icon="remove" ratio={0.6} />
                </button>
            )}
        </div>
    )
}
