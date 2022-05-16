import * as React from 'react'

import { ValidationRound } from '@/modules/Relayers/ValidationRound'
import { RoundInfoProvider, ValidationRoundProvider } from '@/modules/Relayers/providers'

export default function Page(): JSX.Element {
    return (
        <RoundInfoProvider>
            <ValidationRoundProvider>
                <ValidationRound />
            </ValidationRoundProvider>
        </RoundInfoProvider>
    )
}
