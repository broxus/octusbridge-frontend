import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Value<T> = T | undefined

type DictParam<T> = [Value<T>, (value: Value<T>) => void]

export function useDictParam<T extends string>(key: string, dict: T[]): DictParam<T> {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<Value<T>>()

    const changeValue = (val: Value<T>) => {
        const searchParams = new URLSearchParams(window.location.search)

        if (!val) {
            searchParams.delete(key)
        }
        else {
            setValue(val)
            searchParams.set(key, val)
        }

        history.replace({ search: searchParams.toString() })
    }

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const param = searchParams.get(key)

        if (!param || !dict.includes(param as T)) {
            setValue(undefined)
        }
        else {
            setValue(param as T)
        }
    }, [location.search])

    return [value, changeValue]
}
