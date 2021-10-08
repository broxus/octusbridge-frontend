import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { sliceAddress } from '@/utils'
import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'


type Props = {
    baseUrl: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    copy?: boolean;
    hash: string;
}


export function BlockScanTxLink({
    hash,
    baseUrl,
    children,
    className,
    copy,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                href={`${baseUrl}tx/${hash}`}
                title={intl.formatMessage({ id: 'OPEN_IN_ETHERSCAN' })}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children || sliceAddress(hash)}
            </a>
            {copy && (
                <Copy text={hash} id={`copy-${hash}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
        </span>
    )
}
