import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { sliceAddress } from '@/utils'
import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'


type Props = {
    address: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    copy?: boolean;
}


export function TonscanAccountLink({
    address,
    children,
    className,
    copy,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                href={`https://tonscan.io/accounts/${address}`}
                title={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children || sliceAddress(address)}
            </a>
            {copy && (
                <Copy text={address} id={`copy-${address}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
        </span>
    )
}
