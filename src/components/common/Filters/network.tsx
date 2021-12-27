import * as React from 'react'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { NetworkShape } from '@/types'

import './index.scss'

type Props = {
    id?: string;
    networks: NetworkShape[];
    onChange: (value: string | undefined) => void;
}

export function NetworkFilter({
    id,
    networks,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()

    const change = (value: string | undefined) => {
        onChange(value)
    }

    return (
        <Select
            allowClear
            options={networks.map(item => ({
                value: item.id,
                label: item.label,
            }))}
            value={id}
            onChange={change}
            placeholder={intl.formatMessage({
                id: 'FILTERS_BC',
            })}
        />
    )
}
