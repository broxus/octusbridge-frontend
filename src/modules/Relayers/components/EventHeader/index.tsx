import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { ExternalLinkIcon, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'
import { useTransferEventContext } from '@/modules/Relayers/providers'
import { EventsTypeIcons } from '@/modules/Relayers/components/EventsTypeIcons'
import { getEventFromName, getEventToName } from '@/modules/Relayers/utils'
import { sliceAddress } from '@/utils'

import './index.scss'

export function EventHeaderInner(): JSX.Element {
    const intl = useIntl()
    const { event } = useTransferEventContext()
    const params = useParams<any>()

    return (
        <HeaderLayout>
            <div className="event-header-card">
                <EventsTypeIcons
                    size="lg"
                    chainId={event?.chainId}
                    transferKind={event?.transferKind}
                />

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
                        {params.contractAddress && (
                            <EverscanAccountLink
                                copy
                                address={params.contractAddress}
                                className="event-header-card__account-link"
                            >
                                {sliceAddress(params.contractAddress)}
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
