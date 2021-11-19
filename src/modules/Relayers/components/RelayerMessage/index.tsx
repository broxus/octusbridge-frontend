import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { RelayerStoreContext } from '@/modules/Relayers/providers/RelayerStoreProvider'
import { STAKING_LOCATION } from '@/modules/Staking/constants'

import './index.scss'

export function RelayerMessage(): JSX.Element | null {
    const intl = useIntl()
    const relayer = React.useContext(RelayerStoreContext)

    if (!relayer) {
        return null
    }

    return (
        <>
            {relayer.isAdmin && relayer.isStakeBalanceLow && (
                <div className="relayer-message">
                    <div>
                        <h2>
                            {intl.formatMessage({
                                id: 'RELAYER_MESSAGE_LOW_STAKE_TITLE',
                            })}
                        </h2>
                        <p>
                            {intl.formatMessage({
                                id: 'RELAYER_MESSAGE_LOW_STAKE_TEXT',
                            })}
                        </p>
                    </div>
                    <Button
                        link={STAKING_LOCATION}
                        type="dark"
                        size="md"
                    >
                        {intl.formatMessage({
                            id: 'RELAYER_MESSAGE_LOW_STAKE_ACTION',
                        })}
                    </Button>
                </div>
            )}

            {relayer.status === 'slashed' && relayer.slashedProposalId && (
                <div className="relayer-message relayer-message_danger">
                    <h2>
                        {intl.formatMessage({
                            id: 'RELAYER_MESSAGE_SLASHED_TITLE',
                        }, {
                            proposal: relayer.slashedProposalId,
                        })}
                    </h2>
                    <Button
                        link="/" // TODO: Add proposal page link
                        type="tertiary"
                        size="md"
                    >
                        {intl.formatMessage({
                            id: 'RELAYER_MESSAGE_SLASHED_ACTION',
                        })}
                    </Button>
                </div>
            )}
        </>
    )
}
