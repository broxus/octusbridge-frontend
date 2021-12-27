import * as React from 'react'

import { Checkbox } from '@/components/common/Checkbox'

import './index.scss'

export type RadioFilter = {
    type: 'radio';
    value?: string;
    labels: {
        name: string;
        id: string;
    }[]
}

type Props<T> = {
    value?: T;
    labels: {
        name: string;
        disabled?: boolean;
        id: T;
    }[]
    onChange: (value?: T) => void;
}

export function RadioFilter<T>({
    value,
    labels,
    onChange,
}: Props<T>): JSX.Element {
    const changeFn = (id: T) => (checked: boolean) => {
        onChange(checked ? id : undefined)
    }

    return (
        <div className="filters-radio-input">
            {(labels || []).map((label, index) => (
                /* eslint-disable react/no-array-index-key */
                <Checkbox
                    key={index}
                    label={label.name}
                    checked={value === label.id}
                    disabled={label.disabled}
                    onChange={changeFn(label.id)}
                />
            ))}
        </div>
    )
}
