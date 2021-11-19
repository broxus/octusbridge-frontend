import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Value = number | undefined

type DateParam = [Value, (value: Value) => void]

export function useDateParam(key: string): DateParam {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<Value>()

    const changeValue = (val: Value) => {
        const searchParams = new URLSearchParams(window.location.search)
        const date = val ? new Date(val) : null
        const time = date ? date.getTime() : null

        if (!val || Number.isNaN(time)) {
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

        if (!param) {
            setValue(undefined)
        }
        else {
            const num = parseInt(param, 10)
            const date = new Date(num)
            const time = date.getTime()

            setValue(Number.isNaN(time) ? undefined : time)
        }
    }, [location.search])

    return [value, changeValue]
}
