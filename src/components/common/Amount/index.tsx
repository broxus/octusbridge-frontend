import * as React from 'react'
import { useIntl } from 'react-intl'

import { formattedAmount } from '@/utils'

type Props = {
    value?: string;
    decimals?: number;
}

export function Amount({
    value,
    decimals,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <>
            {value ? (
                formattedAmount(value, decimals)
            ) : (
                intl.formatMessage({
                    id: 'NO_VALUE',
                })
            )}
        </>
    )
}
