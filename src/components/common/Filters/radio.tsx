import * as React from 'react'

import { Checkbox } from '@/components/common/Checkbox'

import './index.scss'

export type RadioFilter = {
    type: 'radio';
    value: string | undefined;
    labels: {
        name: string;
        id: string;
    }[]
}

type Props<T> = {
    value: T | undefined;
    labels: {
        name: string;
        id: T;
    }[]
    onChange: (value: T | undefined) => void;
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
                    onChange={changeFn(label.id)}
                />
            ))}
        </div>
    )
}
