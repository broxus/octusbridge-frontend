import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { ContentLoader } from '@/components/common/ContentLoader'
import { useVotingContext } from '@/modules/Governance/providers'
import { ProposalState } from '@/modules/Governance/types'
import { error } from '@/utils'

import './index.scss'

type Props = {
    proposalId: number;
    state: ProposalState;
}

export function UnlockButtonInner({
    proposalId,
    state,
}: Props): JSX.Element | null {
    const intl = useIntl()
    const voting = useVotingContext()
    const locked = voting.castedVotes?.find(([id]) => id === `${proposalId}`)
    const [loading, setLoading] = React.useState(false)

    const unlock = async () => {
        setLoading(true)
        try {
            await voting.unlockCastedVote([proposalId])
        }
        catch (e) {
            error(e)
        }
        setLoading(false)
    }

    return (
        <div className="unlock-button">
            {voting.loading ? (
                <ContentLoader slim transparent iconRation={0.8} />
            ) : (
                locked && (
                    <Button
                        onClick={unlock}
                        type="secondary"
                        disabled={loading || voting.loading || voting.unlockVoteLoading || state === 'Active'}
                        className="unlock-button__button"
                    >
                        {intl.formatMessage({
                            id: 'PROPOSALS_UNLOCK',
                        })}
                        {loading && (
                            <ContentLoader slim transparent iconRation={0.8} />
                        )}
                    </Button>
                )
            )}
        </div>
    )
}

export const UnlockButton = observer(UnlockButtonInner)
