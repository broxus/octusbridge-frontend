import * as React from 'react'

type UrlPagination = {
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
    submit: (page: number) => void;
}

const LIMIT = 10

export function usePagination(totalCount: number = 1): UrlPagination {
    const [params, setParams] = React.useState({
        page: 1,
        limit: LIMIT,
    })

    const submit = (page: number, limit?: number) => {
        setParams({
            page,
            limit: limit || LIMIT,
        })
    }

    const offset = (params.page - 1) * params.limit
    const totalPages = Math.ceil(totalCount / params.limit)

    return {
        offset,
        totalPages,
        page: params.page,
        limit: params.limit,
        submit,
    }
}
