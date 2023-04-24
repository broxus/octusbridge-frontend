import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { Tooltip } from 'react-tooltip'

import { Copy } from '@/components/common/Copy'
import { sliceAddress, uniqueId } from '@/utils'
import { Icon } from '@/components/common/Icon'

type Props = React.PropsWithChildren<{
    addAsset?: boolean;
    address: string;
    baseUrl: string;
    className?: string;
    copy?: boolean;
    explorerLabel?: string;
    external?: boolean;
    onAddAsset?: (root: string) => void;
    type?: 'link' | 'icon';
}>


export function BlockScanAddressLink({
    addAsset,
    address,
    baseUrl,
    children,
    className,
    copy,
    explorerLabel,
    external,
    type = 'link',
    onAddAsset,
}: Props): JSX.Element {
    const intl = useIntl()

    const linkId = React.useRef(`link${uniqueId()}-${uniqueId()}`)
    const externalLinkId = React.useRef(`externalLink${uniqueId()}-${uniqueId()}`)

    const addToAsset: VoidFunction = () => {
        onAddAsset?.(address)
    }

    return (
        <span className={classNames('explorer-link', className)}>
            {type === 'link' ? (
                <>
                    <a
                        href={`${baseUrl}address/${address}`}
                        id={linkId.current}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip-content={intl.formatMessage(
                            { id: 'OPEN_IN_ETHERSCAN' },
                            { explorerLabel },
                        )}
                    >
                        {children || sliceAddress(address)}
                    </a>
                    <Tooltip
                        anchorId={linkId.current}
                        className="tooltip-common"
                        noArrow
                        place="left"
                    />
                </>
            ) : null}
            {copy && (
                <Copy text={address} id={`copy-${address}-${uniqueId()}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
            {(type === 'icon' || external) ? (
                <>
                    <span
                        data-tooltip-content={intl.formatMessage(
                            { id: 'OPEN_IN_ETHERSCAN' },
                            { explorerLabel },
                        )}
                        id={externalLinkId.current}
                        style={{ lineHeight: 0 }}
                    >
                        <Icon
                            component="a"
                            href={`${baseUrl}address/${address}`}
                            icon="externalLink"
                            target="_blank"
                            ratio={0.75}
                            rel="noopener noreferrer"
                        />
                    </span>
                    <Tooltip
                        anchorId={externalLinkId.current}
                        className="tooltip-common"
                        noArrow
                        place="left"
                    />
                </>
            ) : null}
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
