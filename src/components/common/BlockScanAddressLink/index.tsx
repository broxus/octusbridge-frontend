import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { Copy } from '@/components/common/Copy'
import { sliceAddress, uniqueId } from '@/utils'
import { Icon } from '@/components/common/Icon'

type Props = {
    addAsset?: boolean;
    address: string;
    baseUrl: string;
    children?: React.ReactChild | React.ReactChild[] | null;
    className?: string;
    copy?: boolean;
    external?: boolean;
    onAddAsset?: (root: string) => void;
}


export function BlockScanAddressLink({
    addAsset,
    address,
    baseUrl,
    children,
    className,
    copy,
    external,
    onAddAsset,
}: Props): JSX.Element {
    const intl = useIntl()

    const addToAsset = () => {
        onAddAsset?.(address)
    }

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
            {external && (
                <Icon icon="externalLink" ratio={0.75} />
            )}
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
