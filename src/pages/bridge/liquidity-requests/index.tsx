import * as React from 'react'

import { LiquidityRequestsPage, LiquidityRequestsProvider } from '@/modules/LiquidityRequests'

export default function Page(): JSX.Element {
    return (
        <LiquidityRequestsProvider>
            <LiquidityRequestsPage />
        </LiquidityRequestsProvider>
    )
}
