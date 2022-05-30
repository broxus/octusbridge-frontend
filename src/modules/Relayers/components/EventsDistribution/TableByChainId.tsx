import * as React from 'react'
import { useIntl } from 'react-intl'

import { Align, Table as TableBase } from '@/components/common/Table'
import { Checkbox } from '@/components/common/Checkbox'
import { EvmStats } from '@/modules/Relayers/types'
import { getEventsShare, getEvmNetworkColor, getEvmNetworkName } from '@/modules/Relayers/utils'
import { formatDigits } from '@/utils'

import './index.scss'

type Props = {
    evmStats?: EvmStats[];
}

export function TableByChainId({
    evmStats,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (!evmStats) {
        return null
    }

    return (
        <TableBase
            className="events-distribution__chain-id-table"
            cols={[
                {
                    align: Align.center,
                }, {
                    align: Align.left,
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TABLE_NET',
                    }),
                }, {
                    align: Align.right,
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_EVENTS_CONFIRMED',
                    }),
                }, {
                    align: Align.right,
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TOTAL_EVENTS',
                    }),
                }, {
                    align: Align.right,
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_EVENTS_SHARE',
                    }),
                },
            ]}
            rows={evmStats?.map(item => ({
                cells: [
                    <span className="events-distribution__color">
                        <Checkbox
                            color={getEvmNetworkColor(item.chainId)}
                        />
                    </span>,
                    getEvmNetworkName(item.chainId) ?? intl.formatMessage({
                        id: 'NA',
                    }),
                    formatDigits(item.relayConfirmed) || '0',
                    formatDigits(item.potentialConfirmed) || '0',
                    `${getEventsShare(item.relayConfirmed, item.potentialConfirmed)}%`,
                ],
            }))}
        />
    )
}
