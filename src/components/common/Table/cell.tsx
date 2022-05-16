import * as React from 'react'
import classNames from 'classnames'

import { OrderingSwitcher } from '@/components/common/OrderingSwitcher'

import './index.scss'

export type Order = 'asc' | 'desc'

export enum Align {
    center = 'center',
    left = 'left',
    right = 'right',
}

type Props<O> = {
    align?: Align;
    ascending?: O;
    descending?: O;
    order?: O;
    children: React.ReactNode;
    onSort?: (order: O) => void;
}

export function Cell<O>({
    align = Align.left,
    ascending,
    descending,
    order,
    children,
    onSort,
}: Props<O>): JSX.Element {
    return (
        <div
            className={classNames('list__cell', {
                [`list__cell--${align}`]: Boolean(align),
            })}
        >
            {ascending && descending && onSort ? (
                <OrderingSwitcher<O>
                    ascending={ascending}
                    descending={descending}
                    value={order}
                    onSwitch={onSort}
                >
                    {children}
                </OrderingSwitcher>
            ) : (
                children
            )}
        </div>
    )
}
