import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { sliceAddress, uniqueId } from '@/utils'


type Props = React.PropsWithChildren<{
    baseUrl: string;
    explorerLabel?: string;
    className?: string;
    copy?: boolean;
    hash: string;
}>


export function BlockScanTxLink({
    hash,
    baseUrl,
    explorerLabel,
    children,
    className,
    copy,
}: Props): JSX.Element {
    const intl = useIntl()

    const linkId = React.useRef(`link${uniqueId()}-${uniqueId()}`)

    return (
        <span className={classNames('explorer-link', className)}>
            <a
                href={`${baseUrl}tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-content={intl.formatMessage(
                    { id: 'OPEN_IN_ETHERSCAN' },
                    { explorerLabel },
                )}
                id={linkId.current}
            >
                {children || sliceAddress(hash)}
            </a>
            <Tooltip
                anchorId={linkId.current}
                className="tooltip-common"
                noArrow
                place="left"
            />
            {copy && (
                <Copy text={hash} id={`copy-${hash}`}>
                    <Icon icon="copy" />
                </Copy>
            )}
        </span>
    )
}
