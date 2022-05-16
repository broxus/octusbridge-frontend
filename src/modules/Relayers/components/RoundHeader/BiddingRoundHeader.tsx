import * as React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { RoundHeader } from '@/modules/Relayers/components/RoundHeader/RoundHeader'
import { useBiddingRoundContext } from '@/modules/Relayers/providers'

import './index.scss'

export function BiddingRoundHeaderInner(): JSX.Element {
    const intl = useIntl()
    const biddingRound = useBiddingRoundContext()
    const history = useHistory()

    const onSubmitRound = (roundNum: number) => {
        history.push(`/relayers/bidding/${roundNum}`)
    }

    return (
        <RoundHeader
            onSubmitRound={onSubmitRound}
            totalPages={biddingRound.lastRoundNum}
            roundNum={biddingRound.roundNum}
            startTime={biddingRound.electionStartTime}
            endTime={biddingRound.electionEndTime}
            title={intl.formatMessage({
                id: 'BIDDING_ROUND_PAGE_TITLE',
            }, {
                num: biddingRound.roundNum,
            })}
            paginationLabel={intl.formatMessage({
                id: 'BIDDING_ROUND_HEADER_PAGINATION',
            })}
        />
    )
}

export const BiddingRoundHeader = observer(BiddingRoundHeaderInner)
