import * as React from 'react'
import { useIntl } from 'react-intl'

import { Summary } from '@/components/common/Summary'
import { TonAction } from '@/modules/Governance/types'

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
            items={[{
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_PAYLOAD',
                }),
                value: payload,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_TARGET',
                }),
                value: target,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_VALUE',
                }),
                value,
            }]}
        />
    )
}
