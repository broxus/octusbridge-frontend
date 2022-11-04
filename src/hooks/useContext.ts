import * as React from 'react'

export function useContext<T>(Context: React.Context<T>): NonNullable<T> {
    const context = React.useContext(Context)

    if (context === undefined) {
        throw new Error(`${Context.displayName || 'Unknown'} context must be defined`)
    }

    return context as NonNullable<T>
}
