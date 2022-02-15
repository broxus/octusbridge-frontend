import * as React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    slim?: boolean;
    transparent?: boolean;
    iconRatio?: number;
}

export function ContentLoader({
    slim,
    transparent,
    iconRatio,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('content-loader', {
                'content-loader_slim': slim,
                'content-loader_transparent': transparent,
            })}
        >
            <Icon icon="loader" ratio={iconRatio} />
        </div>
    )
}
