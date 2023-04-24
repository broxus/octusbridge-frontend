import * as React from 'react'
import classNames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Tooltip } from 'react-tooltip'

import './index.scss'


type Place = 'top' | 'right' | 'bottom' | 'left'

type Props = {
    children?: React.ReactNode
    className?: string
    id?: string
    place?: Place
    text: string
}

export function Copy({
    children,
    className,
    id,
    place = 'left',
    text,
}: Props): JSX.Element {
    const [isCopied, setCopied] = React.useState(false)

    const onCopy = () => {
        setCopied(true)
    }

    const onMouseLeave = () => {
        setCopied(false)
    }

    return (
        <>
            <CopyToClipboard
                text={text}
                onCopy={onCopy}
            >
                <span
                    className={classNames('copy', className)}
                    data-tooltip-content={isCopied ? 'Copied!' : 'Click to copy'}
                    id={id}
                    onMouseLeave={onMouseLeave}
                >
                    {children || text}
                </span>
            </CopyToClipboard>
            <Tooltip
                anchorId={id}
                className="tooltip-common"
                noArrow
                place={place}
            />
        </>
    )
}
