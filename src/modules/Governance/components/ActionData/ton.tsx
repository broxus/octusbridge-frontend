import * as React from 'react'
import { useIntl } from 'react-intl'

import { DexConstants } from '@/misc'
import { Summary } from '@/components/common/Summary'
import { Icon } from '@/components/common/Icon'
import { Copy } from '@/components/common/Copy'
import { TonAction } from '@/modules/Governance/types'
import { formattedAmount, sliceAddress } from '@/utils'

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
                value: formattedAmount(value, DexConstants.TONDecimals),
            }]}
        />
    )
}
