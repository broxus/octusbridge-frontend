import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Value<T> = T[]

type DictParam<T> = [Value<T>, (value: Value<T>) => void]

export function useCheckParam<T extends string>(key: string, dict: T[]): DictParam<T> {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<Value<T>>([])

    const changeValue = (val: Value<T>) => {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.delete(key)
        val.forEach(item => {
            searchParams.append(key, item)
        })

        history.replace({ search: searchParams.toString() })
    }

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const param = searchParams.getAll(key)
        const result = param.filter(item => dict.includes(item as T)) as T[]

        setValue(result)
    }, [location.search])

    return [value, changeValue]
}
