import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { sliceAddress, uniqueId } from '@/utils'


type Props = {
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    id: string;
    copy?: boolean;
    withIcon?: boolean;
}

export function TransactionExplorerLink({
    children,
    className,
    copy,
    id,
    withIcon,
}: Props): JSX.Element {
    const intl = useIntl()

    const linkId = React.useRef(`link${uniqueId()}-${uniqueId()}`)
    const externalLinkId = React.useRef(`externalLink${uniqueId()}-${uniqueId()}`)

    const href = `https://everscan.io/transactions/${id}`

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                className={className}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-content={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                id={linkId.current}
            >
                {children || sliceAddress(id)}
            </a>
            <Tooltip
                anchorId={linkId.current}
                className="tooltip-common"
                noArrow
                place="left"
            />
            {copy && (
                <Copy text={id} id={`copy-${id}`} className="text-muted">
                    <Icon icon="copy" />
                </Copy>
            )}
            {withIcon && (
                <>
                    <a
                        href={href}
                        data-tooltip-content={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                        id={externalLinkId.current}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted"
                    >
                        <Icon icon="externalLink" ratio={0.7} />
                    </a>
                    <Tooltip
                        anchorId={externalLinkId.current}
                        className="tooltip-common"
                        noArrow
                        place="left"
                    />
                </>
            )}
        </span>
    )
}
