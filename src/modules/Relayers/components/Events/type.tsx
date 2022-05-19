import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { RelayersEventsTransferKind } from '@/modules/Relayers/types'
import { getEventFromName, getEventToName } from '@/modules/Relayers/utils'
import { EventsTypeIcons } from '@/modules/Relayers/components/EventsTypeIcons'

import './index.scss'

type Props = {
    chainId: number;
    transferKind: RelayersEventsTransferKind;
    contractAddress: string;
}

export function EventType({
    chainId,
    transferKind,
    contractAddress,
}: Props): JSX.Element {
    const intl = useIntl()
    const fromName = getEventFromName(transferKind, chainId)
    const toName = getEventToName(transferKind, chainId)

    return (
        <div className="events-type">
            <EventsTypeIcons
                chainId={chainId}
                transferKind={transferKind}
            />

            <div className="events-type__main">
                <div className="events-type__type">
                    <Link to={`/relayers/event/${contractAddress}`}>
                        {intl.formatMessage({
                            id: 'EVENTS_TYPE_TRANSFER',
                        })}
                    </Link>
                </div>

                <div className="events-type__info">
                    {intl.formatMessage({
                        id: 'EVENTS_TYPE_INFO',
                    }, {
                        left: fromName || intl.formatMessage({
                            id: 'NA',
                        }),
                        right: toName || intl.formatMessage({
                            id: 'NA',
                        }),
                    })}
                </div>
            </div>

            {/* {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="events-type__link"
                >
                    <Icon icon="externalLink" ratio={0.7} />
                </a>
            )} */}
        </div>
    )
}
