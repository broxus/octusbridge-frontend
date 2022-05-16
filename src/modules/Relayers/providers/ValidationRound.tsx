import * as React from 'react'

import { useValidationRoundStore } from '@/modules/Relayers/hooks'
import { ValidationRoundStore } from '@/modules/Relayers/store'

export const ValidationRoundContext = React.createContext<ValidationRoundStore | undefined>(undefined)

export function useValidationRoundContext(): ValidationRoundStore {
    const validationRoundContext = React.useContext(ValidationRoundContext)

    if (!validationRoundContext) {
        throw new Error('ValidationRoundContext must be defined')
    }

    return validationRoundContext
}

type Props = {
    children: React.ReactNode;
}

export function ValidationRoundProvider({
    children,
}: Props): JSX.Element {
    const validationRound = useValidationRoundStore()

    return (
        <ValidationRoundContext.Provider value={validationRound}>
            {children}
        </ValidationRoundContext.Provider>
    )
}
