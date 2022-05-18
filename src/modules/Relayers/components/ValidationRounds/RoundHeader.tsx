import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { RoundCard } from '@/modules/Relayers/components/RoundCard'
import { Filters } from '@/modules/Relayers/components/ValidationRounds/Filters'
import { useRoundInfoContext } from '@/modules/Relayers/providers'

import './index.scss'

export function RoundHeader(): JSX.Element | null {
    const intl = useIntl()
    const roundInfo = useRoundInfoContext()

    return (
        <div className="validation-rounds-header">
            <Observer>
                {() => (
                    <RoundCard
                        address={roundInfo.info?.address}
                        startTime={roundInfo.info?.startTime}
                        endTime={roundInfo.info?.endTime}
                        titleLink={roundInfo.info?.roundNum
                            ? `/relayers/round/${roundInfo.info.roundNum}`
                            : undefined}
                        title={intl.formatMessage({
                            id: 'ROUND_STATISTIC_TITLE',
                        }, {
                            roundNum: roundInfo.info?.roundNum,
                        })}
                    />
                )}
            </Observer>

            <Filters />
        </div>
    )
}
