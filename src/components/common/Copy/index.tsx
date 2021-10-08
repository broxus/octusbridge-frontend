import * as React from 'react'
import classNames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'

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
    place = 'top',
    text,
}: Props): JSX.Element {
    const [isCopied, setCopied] = React.useState(false)

    React.useEffect(() => {
        ReactTooltip.rebuild()
    }, [isCopied])

    return (
        <>
            <CopyToClipboard
                text={text}
                onCopy={() => {
                    setCopied(true)
                }}
            >
                <span
                    className={classNames('copy', className)}
                    data-tip=""
                    data-for={id}
                    onMouseLeave={() => {
                        setCopied(false)
                    }}
                >
                    {children || text}
                </span>
            </CopyToClipboard>
            <ReactTooltip
                id={id}
                type="dark"
                effect="solid"
                place={place}
                getContent={() => (isCopied ? 'Copied!' : 'Click to copy')}
            />
        </>
    )
}
