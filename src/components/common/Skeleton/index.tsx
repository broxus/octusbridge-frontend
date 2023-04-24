import * as React from 'react'
import classNames from 'classnames'

import './index.scss'

type Props = Pick<React.CSSProperties, 'height' | 'width'> & {
    circle?: boolean
    className?: string
    style?: React.CSSProperties
}

export const Skeleton = React.memo((props: Props) => {
    const { circle, className, height, style, width } = props

    return (
        <span
            className={classNames(
                'skeleton',
                {
                    'skeleton-circle': circle,
                },
                className,
            )}
            style={{
                height: circle ? width : height,
                width,
                ...style,
            }}
        >
            {'\u200B'}
        </span>
    )
})
