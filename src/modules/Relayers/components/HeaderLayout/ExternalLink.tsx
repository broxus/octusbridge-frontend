import * as React from 'react'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    link: string;
}

export function ExternalLink({
    link,
}: Props): JSX.Element {
    return (
        <a
            target="_blank"
            className="relayers-header-external-link"
            rel="nofollow noopener noreferrer"
            href={link}
        >
            <Icon icon="externalLink" />
        </a>
    )
}
