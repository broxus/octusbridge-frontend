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
}

export function TransactionExplorerLink({
    children,
    className,
    copy,
    id,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                className={className}
                href={`https://ton-explorer.com/transactions/${id}`}
                title={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children || sliceAddress(id)}
            </a>
            {copy && (
                <Copy text={id} id={`copy-${id}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
        </span>
    )
}
