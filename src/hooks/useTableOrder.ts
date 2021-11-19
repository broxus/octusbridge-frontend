import * as React from 'react'

type TableOrder<O> = {
    order: O;
    onSort: (order: O) => void;
}

export function useTableOrder<O>(initialOrder: O): TableOrder<O> {
    const [order, setOrder] = React.useState(initialOrder)

    const onSort = (value: O) => {
        setOrder(value)
    }

    return {
        order,
        onSort,
    }
}
