import * as React from 'react'

type UrlPagination = {
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
    totalCount?: number;
    submit: (page: number, limit?: number) => void;
}

const LIMIT = 10

export function usePagination(totalCount?: number): UrlPagination {
    const [params, setParams] = React.useState({
        page: 1,
        limit: LIMIT,
    })

    const submit = (page: number, limit?: number) => {
        setParams({
            page,
            limit: limit || params.limit,
        })
    }

    const offset = (params.page - 1) * params.limit
    const totalPages = Math.ceil((totalCount || 1) / params.limit)

    return {
        offset,
        totalPages,
        totalCount,
        page: params.page,
        limit: params.limit,
        submit,
    }
}
