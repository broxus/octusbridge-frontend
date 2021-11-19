import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { TokenIcon } from '@/components/common/TokenIcon'

import './index.scss'

type Props = {
    leftAddress: string;
    leftSymbol: string;
    leftUri?: string;
    rightAddress: string;
    rightSymbol: string;
    rightUri?: string;
    type: string;
    link?: string;
}

export function EventType({
    leftAddress,
    leftSymbol,
    leftUri,
    rightAddress,
    rightSymbol,
    rightUri,
    type,
    link,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="events-type">
            <div className="events-type-icons">
                <div className="events-type-icons__item">
                    <TokenIcon
                        address={leftAddress}
                        uri={leftUri}
                        size="small"
                    />
                </div>
                <div className="events-type-icons__item">
                    <TokenIcon
                        address={rightAddress}
                        uri={rightUri}
                        size="small"
                    />
                </div>
            </div>

            <div className="events-type__main">
                <div className="events-type__type">
                    <Link to="/relayers/events/1">
                        {type}
                    </Link>
                </div>

                <div className="events-type__info">
                    {intl.formatMessage({
                        id: 'EVENTS_TYPE_INFO',
                    }, {
                        left: leftSymbol,
                        right: rightSymbol,
                    })}
                </div>
            </div>

            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="events-type__link"
                >
                    <Icon icon="externalLink" ratio={0.7} />
                </a>
            )}
        </div>
    )
}
