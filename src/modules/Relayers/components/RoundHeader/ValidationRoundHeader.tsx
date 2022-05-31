import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import { useHistory, useParams } from 'react-router-dom'

import { RoundHeader } from '@/modules/Relayers/components/RoundHeader/RoundHeader'
import { useValidationRoundContext } from '@/modules/Relayers/providers'

import './index.scss'

export function ValidationRoundHeaderInner(): JSX.Element {
    const intl = useIntl()
    const validationRound = useValidationRoundContext()
    const history = useHistory()
    const params = useParams<any>()

    const onSubmitRound = (roundNum: number) => {
        history.push(`/relayers/round/${roundNum}`)
    }

    return (
        <RoundHeader
            onSubmitRound={onSubmitRound}
            totalPages={validationRound.lastRoundNum}
            roundNum={validationRound.roundCalendar?.roundNum}
            startTime={validationRound.roundCalendar?.startTime}
            endTime={validationRound.roundCalendar?.endTime}
            title={intl.formatMessage({
                id: 'VALIDATION_ROUND_PAGE_TITLE',
            }, {
                num: params.num,
            })}
            paginationLabel={intl.formatMessage({
                id: 'VALIDATION_ROUND_HEADER_PAGINATION',
            })}
        />
    )
}

export const ValidationRoundHeader = observer(ValidationRoundHeaderInner)
