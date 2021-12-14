import * as React from 'react'
import BigNumber from 'bignumber.js'
import { useHistory, useLocation } from 'react-router-dom'

type Value = string | undefined

type BNParam = [Value, (value: Value) => void]

export function useBNParam(key: string): BNParam {
    const history = useHistory()
    const location = useLocation()

    const [value, setValue] = React.useState<Value>()

    const changeValue = (val: Value) => {
        const searchParams = new URLSearchParams(window.location.search)
        const bn = val ? new BigNumber(val) : undefined

        if (bn && !bn.isNaN() && bn.isFinite()) {
            setValue(val)
            searchParams.set(key, bn.toFixed())
        }
        else {
            searchParams.delete(key)
        }

        history.replace({ search: searchParams.toString() })
    }

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const param = searchParams.get(key)
        const bn = param ? new BigNumber(param) : undefined

        if (bn && !bn.isNaN() && bn.isFinite()) {
            setValue(bn.toFixed())
        }
        else {
            setValue(undefined)
        }
    }, [location.search])

    return [value, changeValue]
}
