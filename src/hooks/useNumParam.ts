import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Value = number | undefined

type NumParam = [Value, (value: Value) => void]

export function useNumParam(key: string): NumParam {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<Value>()

    const changeValue = (val: Value) => {
        const searchParams = new URLSearchParams(window.location.search)

        if (!val) {
            searchParams.delete(key)
        }
        else {
            setValue(val)
            searchParams.set(key, val.toString())
        }

        history.replace({ search: searchParams.toString() })
    }

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const param = searchParams.get(key)
        const num = param ? parseInt(param, 10) : undefined

        if (num === undefined || Number.isNaN(num)) {
            setValue(undefined)
        }
        else {
            setValue(num)
        }
    }, [location.search])

    return [value, changeValue]
}
