import * as React from 'react'

import { Icon } from '@/components/common/Icon'

import './index.scss'

export function ExternalLinkIcon(): JSX.Element {
    return (
        <span className="relayers-header-external-link">
            <Icon icon="externalLink" />
        </span>
    )
}
