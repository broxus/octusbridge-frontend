import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type Value = string | undefined

type TextParam = [Value, (value: Value) => void]

export function useTextParam(key: string): TextParam {
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
            searchParams.set(key, val)
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
            setValue(param)
        }
    }, [location.search])

    return [value, changeValue]
}
