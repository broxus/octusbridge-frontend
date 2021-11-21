import * as React from 'react'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { findNetwork } from '@/modules/Bridge/utils'
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
            className="rc-select--sm"
            options={networks.map(item => ({
                value: item.chainId,
                label: item.label,
            }))}
            value={chainIdStr
                ? findNetwork(chainIdStr, 'evm')?.label
                : undefined}
            inputValue={chainIdStr}
            onChange={change}
            placeholder={intl.formatMessage({
                id: 'FILTERS_BC',
            })}
        />
    )
}
