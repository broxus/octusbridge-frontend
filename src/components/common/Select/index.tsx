import * as React from 'react'
import RcSelect, { SelectProps } from 'rc-select'

import { Icon } from '@/components/common/Icon'
import './index.scss'


function InternalSelect<T>(props: SelectProps<T>, ref: React.Ref<RcSelect<T>>): JSX.Element {
    return (
        <RcSelect<T>
            ref={ref}
            inputIcon={<Icon icon="arrowDown" />}
            transitionName="rc-slide-up"
            getPopupContainer={trigger => trigger.closest('.rc-select') || document.body}
            {...props}
        />
    )
}

export const Select = React.forwardRef(InternalSelect) as <T>(
    props: SelectProps<T> & { ref?: React.Ref<RcSelect<T>> }
) => React.ReactElement
