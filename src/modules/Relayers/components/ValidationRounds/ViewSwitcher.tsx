import * as React from 'react'
import classNames from 'classnames'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

import './index.scss'

export enum View {
    Stats,
    Table,
}

type Props = {
    view?: View;
    onChange: (view: View) => void;
}

export function ViewSwitcher({
    view = View.Stats,
    onChange,
}: Props): JSX.Element {
    const onClick = (value: View) => () => onChange(value)

    return (
        <div className="validation-rounds-view-switcher">
            <Button
                type="secondary"
                className={classNames('validation-rounds-view-switcher__item', {
                    'validation-rounds-view-switcher__item_active': view === View.Stats,
                })}
                onClick={onClick(View.Stats)}
            >
                <Icon icon="vCols" />
            </Button>
            <Button
                type="secondary"
                className={classNames('validation-rounds-view-switcher__item', {
                    'validation-rounds-view-switcher__item_active': view === View.Table,
                })}
                onClick={onClick(View.Table)}
            >
                <Icon icon="hCols" />
            </Button>
        </div>
    )
}
