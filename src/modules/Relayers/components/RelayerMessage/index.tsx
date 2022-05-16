import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { useUserDataContext } from '@/modules/Relayers/providers'

import './index.scss'

export function RelayerMessageInner(): JSX.Element | null {
    const intl = useIntl()
    const userData = useUserDataContext()

    return (
        <>
            {userData.isRelay && userData.relayIsLowBalance && (
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
                        link="/staking/my"
                        type="dark"
                        size="md"
                    >
                        {intl.formatMessage({
                            id: 'RELAYER_MESSAGE_LOW_STAKE_ACTION',
                        })}
                    </Button>
                </div>
            )}

            {/* {relayer.status === 'slashed' && relayer.slashedProposalId && (
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
            )} */}
        </>
    )
}

export const RelayerMessage = observer(RelayerMessageInner)
