import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
// import { Badge } from '@/components/common/Badge'
import { UserAvatar } from '@/components/common/UserAvatar'
import { ExternalLinkIcon, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'
import { useTransferEventContext } from '@/modules/Relayers/providers'
import { getEventFromName, getEventToName } from '@/modules/Relayers/utils'
import { sliceAddress } from '@/utils'

import './index.scss'

export function EventHeaderInner(): JSX.Element {
    const intl = useIntl()
    const { event } = useTransferEventContext()

    return (
        <HeaderLayout>
            <div className="event-header-card">
                {event?.contractAddress && (
                    <UserAvatar
                        address={event.contractAddress}
                    />
                )}

                <div>
                    <h3 className="event-header-card__title">
                        {intl.formatMessage({
                            id: event ? 'EVENT_HEADER_TITLE' : 'EVENT_HEADER_TITLE_EMPTY',
                        }, {
                            from: event ? getEventFromName(event.transferKind, event.chainId) : undefined,
                            to: event ? getEventToName(event.transferKind, event.chainId) : undefined,
                        })}
                    </h3>

                    <div className="event-header-card__meta">
                        {event?.contractAddress && (
                            <EverscanAccountLink
                                copy
                                address={event.contractAddress}
                                className="event-header-card__account-link"
                            >
                                {sliceAddress(event.contractAddress)}
                            </EverscanAccountLink>
                        )}
                    </div>
                </div>
            </div>

            {event && (
                <EverscanAccountLink address={event.contractAddress}>
                    <ExternalLinkIcon />
                </EverscanAccountLink>
            )}
        </HeaderLayout>
    )
}

export const EventHeader = observer(EventHeaderInner)
