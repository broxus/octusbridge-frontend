import * as React from 'react'
import { useIntl } from 'react-intl'

import { Summary } from '@/components/common/Summary'
import { EthAction } from '@/modules/Governance/types'

type Props = EthAction

export function EthActionData({
    callData,
    chainId,
    signature,
    target,
    value,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Summary
            compact
            items={[{
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_CALL_DATA',
                }),
                value: callData,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_CHAIN_ID',
                }),
                value: chainId,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_SIGNATURE',
                }),
                value: signature,
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
