import * as React from 'react'
import { useIntl } from 'react-intl'

import { DexConstants } from '@/misc'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { Summary } from '@/components/common/Summary'
import { TonAction } from '@/modules/Governance/types'
import { formattedAmount } from '@/utils'

type Props = TonAction

export function TonActionData({
    payload,
    target,
    value,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Summary
            compact
            space="sm"
            items={[{
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_PAYLOAD',
                }),
                value: payload,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_TARGET',
                }),
                value: <TonscanAccountLink copy address={target} />,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_VALUE',
                }),
                value: formattedAmount(value, DexConstants.TONDecimals),
            }]}
        />
    )
}
