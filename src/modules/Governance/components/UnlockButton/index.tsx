import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components/common/Icon'
import { Button } from '@/components/common/Button'
import { ContentLoader } from '@/components/common/ContentLoader'
import { useVotingContext } from '@/modules/Governance/providers'
import { ProposalState } from '@/modules/Governance/types'
import { error } from '@/utils'

import './index.scss'

type Props = {
    proposalId: number;
    state: ProposalState;
    showSuccessIcon?: boolean;
}

export function UnlockButtonInner({
    proposalId,
    state,
    showSuccessIcon,
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
            {/* eslint-disable no-nested-ternary */}
            {voting.loading ? (
                <ContentLoader slim transparent iconRatio={0.8} />
            ) : (
                locked ? (
                    <Button
                        onClick={unlock}
                        type="secondary"
                        disabled={loading || voting.loading || voting.unlockLoading || state === 'Active'}
                        className="unlock-button__button"
                    >
                        {intl.formatMessage({
                            id: 'PROPOSALS_UNLOCK',
                        })}
                        {loading && (
                            <ContentLoader slim transparent iconRatio={0.8} />
                        )}
                    </Button>
                ) : (
                    showSuccessIcon ? (
                        <Icon
                            icon="success"
                            className="unlock-button__icon"
                        />
                    ) : null
                )
            )}
        </div>
    )
}

export const UnlockButton = observer(UnlockButtonInner)
