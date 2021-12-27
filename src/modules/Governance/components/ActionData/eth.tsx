import * as React from 'react'
import { useIntl } from 'react-intl'

import { Summary } from '@/components/common/Summary'
import { Icon } from '@/components/common/Icon'
import { Copy } from '@/components/common/Copy'
import { EthAction } from '@/modules/Governance/types'
import { sliceAddress } from '@/utils'

import './index.scss'

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
            adaptive
            space="sm"
            items={[{
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_CALL_DATA',
                }),
                value: (
                    <div className="action-data">
                        {callData}
                    </div>
                ),
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_CHAIN_ID',
                }),
                value: chainId,
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_SIGNATURE',
                }),
                value: (
                    <div className="action-data">
                        {signature}
                    </div>
                ),
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_TARGET',
                }),
                value: (
                    <div className="explorer-link">
                        {sliceAddress(target)}
                        <Copy text={target} id="copy-target">
                            <Icon icon="copy" />
                        </Copy>
                    </div>
                ),
            }, {
                key: intl.formatMessage({
                    id: 'PROPOSAL_ACTION_VALUE',
                }),
                value,
            }]}
        />
    )
}
