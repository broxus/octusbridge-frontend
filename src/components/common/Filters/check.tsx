import * as React from 'react'

import { Checkbox } from '@/components/common/Checkbox'

import './index.scss'

export type CheckFilter = {
    type: 'check';
    value: string[];
    labels: {
        name: string;
        id: string;
    }[]
}

type Props<T> = {
    value: T[];
    labels: {
        name: string;
        id: T;
    }[]
    onChange: (value?: T[]) => void;
}

export function CheckFilter<T>({
    value,
    labels,
    onChange,
}: Props<T>): JSX.Element {
    const changeFn = (id: T) => (checked: boolean) => {
        let result = [...value]

        if (checked) {
            result.push(id)
        }
        else {
            result = result.filter(i => i !== id)
        }

        onChange(result)
    }

    return (
        <div className="filters-radio-input">
            {(labels || []).map((label, index) => (
                /* eslint-disable react/no-array-index-key */
                <Checkbox
                    key={index}
                    label={label.name}
                    checked={value.includes(label.id)}
                    onChange={changeFn(label.id)}
                />
            ))}
        </div>
    )
}
