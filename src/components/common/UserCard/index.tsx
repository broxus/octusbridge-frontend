import * as React from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { UserAvatar } from '@/components/common/UserAvatar'
import { sliceAddress, uniqueId } from '@/utils'

import './index.scss'

type Props = {
    name?: string;
    address: string;
    link?: string;
    copy?: boolean;
    external?: boolean;
}

export function UserCard({
    name,
    address,
    link,
    copy,
    external,
}: Props): JSX.Element {
    const intl = useIntl()
    const shortAddress = sliceAddress(address)
    const externalLinkId = React.useRef(`externalLink${uniqueId()}-${uniqueId()}`)

    const avatar = (
        <UserAvatar
            size="small"
            address={address}
        />
    )

    return (
        <div className="user-card">
            {link ? <Link to={link}>{avatar}</Link> : avatar}

            {name ? (
                <div>
                    <div className="user-card__name">
                        {link ? (
                            <Link to={link}>{name}</Link>
                        ) : name}
                    </div>
                    <div className="user-card__address">
                        {link ? <Link to={link}>{shortAddress}</Link> : shortAddress}
                    </div>
                </div>
            ) : (
                <div className="user-card__name">
                    {link ? <Link to={link}>{shortAddress}</Link> : shortAddress}
                </div>
            )}

            {copy && (
                <Copy
                    text={address}
                    id={`copy-${address}`}
                    className="text-muted"
                >
                    <Icon icon="copy" />
                </Copy>
            )}

            {external && (
                <>
                    <a
                        href={`https://everscan.io/accounts/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted user-card__external"
                        data-tooltip-content={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                        id={externalLinkId.current}
                    >
                        <Icon icon="externalLink" ratio={0.7} />
                    </a>
                    <Tooltip
                        anchorId={externalLinkId.current}
                        className="tooltip-common"
                        noArrow
                        place="right"
                    />
                </>
            )}
        </div>
    )
}
