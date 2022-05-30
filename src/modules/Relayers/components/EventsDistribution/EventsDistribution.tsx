import * as React from 'react'
import { useIntl } from 'react-intl'

import { Chart } from '@/modules/Relayers/components/EventsDistribution/chart'
import { Table } from '@/modules/Relayers/components/EventsDistribution/table'

import './index.scss'

type Props = {
    isLoading?: boolean;
    tonToEthUsdt?: string;
    ethToTonUsdt?: string;
    tonToEthUsdtTotal?: string;
    ethToTonUsdtTotal?: string;
}

export function EventsDistribution({
    isLoading,
    tonToEthUsdt,
    ethToTonUsdt,
    tonToEthUsdtTotal,
    ethToTonUsdtTotal,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--flat card--small events-distribution">
            <h3 className="events-distribution__title">
                {intl.formatMessage({
                    id: 'EVENTS_DISTRIBUTION_TITLE',
                })}
            </h3>

            <Chart
                isLoading={isLoading}
                ethToTonUsdt={ethToTonUsdt}
                tonToEthUsdt={tonToEthUsdt}
            />
            <Table
                ethToTonUsdt={ethToTonUsdt}
                tonToEthUsdt={tonToEthUsdt}
                tonToEthUsdtTotal={tonToEthUsdtTotal}
                ethToTonUsdtTotal={ethToTonUsdtTotal}
            />
        </div>
    )
}
