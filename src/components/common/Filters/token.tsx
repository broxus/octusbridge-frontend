import * as React from 'react'
import { useIntl } from 'react-intl'

import { TokenBadge } from '@/components/common/TokenBadge'
import { Select } from '@/components/common/Select'
import { Token } from '@/types'

import './index.scss'

type Props = {
    tokens: Token[];
    tokenAddress?: string;
    onChange: (tokenAddress: string) => void;
}

export function TokenFilter({
    tokens,
    tokenAddress,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Select
            allowClear
            options={tokens.map(({ root, icon, symbol }) => ({
                label: (
                    <TokenBadge
                        address={root}
                        symbol={symbol}
                        uri={icon}
                        size="xsmall"
                    />
                ),
                value: root,
            }))}
            value={tokenAddress}
            onChange={onChange}
            placeholder={intl.formatMessage({
                id: 'FILTERS_TOKEN',
            })}
        />
    )
}
