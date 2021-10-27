import * as React from 'react'

import { debounce } from '@/utils'

export function useDebounce<T>(value: T, wait: number): T {
    const [debouncedValue, setValue] = React.useState<T>(value)

    const setValueDebounced = React.useCallback(
        debounce(setValue, wait),
        [setValue],
    )

    React.useEffect(() => {
        setValueDebounced(value)
    }, [value])

    return debouncedValue
}
