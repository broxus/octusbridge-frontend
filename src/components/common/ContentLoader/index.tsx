import * as React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    slim?: boolean;
    iconRation?: number;
}

export function ContentLoader({
    slim,
    iconRation,
}: Props): JSX.Element {
    return (
        <div
            className={classNames('content-loader', {
                'content-loader_slim': slim,
            })}
        >
            <Icon icon="loader" ratio={iconRation} />
        </div>
    )
}
