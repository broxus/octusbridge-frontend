import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { sliceAddress, uniqueId } from '@/utils'


type Props = {
    addAsset?: boolean;
    address: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    copy?: boolean;
    onAddAsset?: (root: string) => void;
}


export function EverscanAccountLink({
    addAsset,
    address,
    children,
    className,
    copy,
    onAddAsset,
}: Props): JSX.Element {
    const intl = useIntl()

    const addToAsset = () => {
        onAddAsset?.(address)
    }

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                href={`https://everscan.io/accounts/${address}`}
                title={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
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
            {addAsset && (
                <Icon
                    icon="addAssetToWallet"
                    ratio={0.85}
                    style={{ cursor: 'pointer' }}
                    onClick={addToAsset}
                />
            )}
        </span>
    )
}
