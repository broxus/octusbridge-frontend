import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { UnlockForm } from '@/modules/Governance/components/UnlockForm'
import { useVotingContext } from '@/modules/Governance/providers'
import { error, formattedAmount } from '@/utils'

type Props = {
    onSuccess?: () => void;
}

export function UnlockAllButton({
    onSuccess,
}: Props): JSX.Element {
    const intl = useIntl()
    const voting = useVotingContext()
    const [formVisible, setFormVisible] = React.useState(false)

    const showForm = () => setFormVisible(true)
    const hideForm = () => setFormVisible(false)

    const proposals = (voting.proposals || [])
        .filter(({ state }) => state !== 'Active')

    const submit = async () => {
        try {
            const ids = proposals.map(item => item.proposalId)
            const success = await voting.unlockCastedVote(ids)

            if (success) {
                hideForm()
                onSuccess?.()
            }
        }
        catch (e) {
            error(e)
        }
    }

    return (
        <>
            <Button
                type="secondary"
                onClick={showForm}
            >
                {intl.formatMessage({
                    id: 'PROPOSALS_UNLOCK_ALL',
                })}
            </Button>

            {formVisible && (
                <Observer>
                    {() => (
                        <UnlockForm
                            tokens={formattedAmount(
                                voting.lockedTokens,
                                voting.tokenDecimals,
                            )}
                            loading={voting.unlockVoteLoading}
                            proposals={proposals}
                            onDismiss={hideForm}
                            onSubmit={submit}
                        />
                    )}
                </Observer>
            )}
        </>
    )
}
