import * as React from 'react'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { NetworkShape } from '@/types'

import './index.scss'

type Props = {
    networks: NetworkShape[];
    chainId?: number;
    onChange: (value: number | undefined) => void;
}

export function NetworkFilter({
    networks,
    chainId,
    onChange,
}: Props): JSX.Element {
    const chainIdStr = chainId?.toString()
    const intl = useIntl()

    const change = (value: string) => {
        const num = parseInt(value, 10)
        onChange(Number.isNaN(num) ? undefined : num)
    }

    return (
        <Select
            allowClear
            options={networks.map(item => ({
                value: item.chainId,
                label: item.label,
            }))}
            value={chainIdStr}
            onChange={change}
            placeholder={intl.formatMessage({
                id: 'FILTERS_BC',
            })}
        />
    )
}
