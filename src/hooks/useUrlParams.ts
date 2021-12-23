import { useHistory } from 'react-router-dom'

type Params = Record<string, string | undefined>

type UrlParams = {
    set: (params: Params) => void;
}

export function useUrlParams(): UrlParams {
    const history = useHistory()

    const set = (params: Params) => {
        const searchParams = new URLSearchParams(window.location.search)
        const keys = Object.keys(params)

        keys.forEach(key => {
            const val = params[key]

            if (val) {
                searchParams.set(key, val)
            }
            else {
                searchParams.delete(key)
            }
        })

        history.push({ search: searchParams.toString() })
    }

    return { set }
}
