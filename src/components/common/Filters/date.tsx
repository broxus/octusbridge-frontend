import * as React from 'react'

import { DateInput as BaseDateInput } from '@/components/common/DateInput'

import './index.scss'

type Props = {
    value?: number | undefined;
    onChange: (value: number | undefined) => void;
}

export function DateFilter({
    value,
    onChange,
}: Props): JSX.Element {
    const date = value ? new Date(value) : undefined

    const change = (val: Date | null) => {
        onChange(val ? val.getTime() : undefined)
    }

    return (
        <BaseDateInput
            showClear
            value={date}
            onChange={change}
        />
    )
}
