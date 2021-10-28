/*
 * Copyright (c), 2019-present, «Go Trip», LLC.
 * Author: Denis Klimov <plitnichenko@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 *
 */

import * as React from 'react'
import classNames from 'classnames'

import './index.scss'


type Props = {
    children?: React.ReactNode;
    className?: string;
}


export const NativeScrollArea = React.forwardRef<
    HTMLDivElement,
    Props
>(({ children, className }, ref) => (
    <div className={classNames('native-scroll-area', className)}>
        <div className="native-scroll-area-inner" ref={ref}>
            <div className="native-scroll-area-content">
                {children}
            </div>
        </div>
    </div>
))
