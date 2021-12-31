import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { Copy } from '@/components/common/Copy'
import { sliceAddress, uniqueId } from '@/utils'
import { Icon } from '@/components/common/Icon'

type Props = {
    address: string;
    baseUrl: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    copy?: boolean;
}


export function BlockScanAddressLink({
    address,
    baseUrl,
    children,
    className,
    copy,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                href={`${baseUrl}address/${address}`}
                title={intl.formatMessage({ id: 'OPEN_IN_ETHERSCAN' })}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children || sliceAddress(address)}
            </a>
            {copy && (
                <Copy text={address} id={`copy-${address}-${uniqueId()}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
        </span>
    )
}
