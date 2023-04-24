import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { sliceAddress, uniqueId } from '@/utils'


type Props = React.PropsWithChildren<{
    addAsset?: boolean;
    address: string;
    className?: string;
    copy?: boolean;
    external?: boolean;
    type?: 'link' | 'icon';
    onAddAsset?: (root: string) => void;
}>


export function EverscanAccountLink({
    addAsset,
    address,
    children,
    className,
    copy,
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
                        href={`https://everscan.io/accounts/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip-content={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                        id={linkId.current}
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
                        data-tooltip-content={intl.formatMessage({ id: 'OPEN_IN_EXPLORER' })}
                        id={externalLinkId.current}
                        style={{ lineHeight: 0 }}
                    >
                        <Icon
                            component="a"
                            href={`https://everscan.io/accounts/${address}`}
                            icon="externalLink"
                            target="_blank"
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
