import * as React from 'react'
import RcSelect, { BaseSelectRef, SelectProps } from 'rc-select'

import { Icon } from '@/components/common/Icon'

import './index.scss'


function InternalSelect<T>(props: SelectProps<T>, ref: React.Ref<BaseSelectRef>): JSX.Element {
    const { allowClear, value } = props

    return (
        <RcSelect<T>
            ref={ref}
            showArrow={allowClear ? !value : true}
            inputIcon={<Icon icon="arrowDown" />}
            clearIcon={<Icon icon="remove" ratio={0.6} />}
            transitionName="rc-slide-up"
            getPopupContainer={trigger => trigger.closest('.rc-select') || document.body}
            {...props}
        />
    )
}

export const Select = React.forwardRef(InternalSelect) as <T>(
    props: SelectProps<T> & { ref?: React.Ref<BaseSelectRef> }
) => React.ReactElement
