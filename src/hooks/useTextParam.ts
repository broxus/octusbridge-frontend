import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type TextParam = [string | undefined, (value: string | undefined) => void]

export function useTextParam(key: string): TextParam {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<string | undefined>()

    const changeValue = (val: string | undefined) => {
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
