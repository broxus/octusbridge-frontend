import * as React from 'react'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'

import { Align, Table as TableBase } from '@/components/common/Table'
import { Checkbox } from '@/components/common/Checkbox'
import { formattedAmount } from '@/utils'

import './index.scss'

type Props = {
    tonToEthUsdt?: string;
    ethToTonUsdt?: string;
    tonToEthUsdtTotal?: string;
    ethToTonUsdtTotal?: string;
}

export function Table({
    tonToEthUsdt,
    ethToTonUsdt,
    tonToEthUsdtTotal,
    ethToTonUsdtTotal,
}: Props): JSX.Element | null {
    const intl = useIntl()

    if (!tonToEthUsdt || !ethToTonUsdt) {
        return null
    }

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const total = new BigNumber(tonToEthUsdt).plus(ethToTonUsdt)

    const tonPercent = new BigNumber(tonToEthUsdt)
        .times(100)
        .div(total)
        .toFixed()

    const ethPercent = new BigNumber(ethToTonUsdt)
        .times(100)
        .div(total)
        .toFixed()

    const tonShare = tonToEthUsdtTotal
        ? new BigNumber(tonToEthUsdt)
            .times(100)
            .div(tonToEthUsdtTotal)
            .toFixed()
        : undefined

    const ethShare = ethToTonUsdtTotal
        ? new BigNumber(ethToTonUsdt)
            .times(100)
            .div(ethToTonUsdtTotal)
            .toFixed()
        : undefined

    return (
        <TableBase
            className={classNames('events-distribution__table', {
                extra: tonShare || ethShare,
            })}
            cols={[{
                align: Align.center,
            }, {
                align: Align.left,
                name: intl.formatMessage({
                    id: 'EVENTS_DISTRIBUTION_TABLE_TYPE',
                }),
            }, {
                align: Align.right,
                name: intl.formatMessage({
                    id: 'EVENTS_DISTRIBUTION_TABLE_AMOUNT',
                }),
            }, {
                align: Align.right,
                name: intl.formatMessage({
                    id: 'EVENTS_DISTRIBUTION_TABLE_PERCENT',
                }),
            },
            ...tonShare || ethShare
                ? [{
                    align: Align.right,
                    name: intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_TABLE_SHARE',
                    }),
                }]
                : [],
            ]}
            rows={[{
                cells: [
                    <span className="events-distribution__color">
                        <Checkbox color="#AD90E9" />
                    </span>,
                    intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_EVER',
                    }),
                    `$${formattedAmount(tonToEthUsdt)}`,
                    `${formattedAmount(tonPercent)}%`,
                    ...tonShare || ethShare
                        ? [tonShare ? `${formattedAmount(tonShare)}%` : noValue]
                        : [],
                ],
            }, {
                cells: [
                    <span className="events-distribution__color">
                        <Checkbox color="#3A458C" />
                    </span>,
                    intl.formatMessage({
                        id: 'EVENTS_DISTRIBUTION_ETH',
                    }),
                    `$${formattedAmount(ethToTonUsdt)}`,
                    `${formattedAmount(ethPercent)}%`,
                    ...tonShare || ethShare
                        ? [ethShare ? `${formattedAmount(ethShare)}%` : noValue]
                        : [],
                ],
            }]}
        />
    )
}
