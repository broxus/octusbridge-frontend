import * as React from 'react'

import { RoundCard } from '@/modules/Relayers/components/RoundCard'
import { Filter } from '@/modules/Relayers/components/RoundStatistic/filter'
import { RoundData } from '@/modules/Relayers/components/RoundData'

import './index.scss'

export function RoundStatistic(): JSX.Element | null {
    return (
        <div className="round-statistic">
            <div className="round-statistic__header">
                <RoundCard
                    title="Round 123"
                    address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                    startTime={new Date().getTime()}
                    endTime={new Date().getTime() + 880000000}
                />

                <Filter
                    limit={10}
                    current={3}
                    actual={3}
                    onSubmit={() => {}}
                />
            </div>

            <RoundData />
        </div>
    )
}
