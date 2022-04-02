import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { sliceAddress } from '@/utils'


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
    const href = `https://everscan.io/transactions/${id}`
    const title = intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                className={className}
                href={href}
                title={title}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children || sliceAddress(id)}
            </a>
            {copy && (
                <Copy text={id} id={`copy-${id}`} className="text-muted">
                    <Icon icon="copy" />
                </Copy>
            )}
            {withIcon && (
                <a
                    href={href}
                    title={title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted"
                >
                    <Icon icon="externalLink" ratio={0.7} />
                </a>
            )}
        </span>
    )
}
