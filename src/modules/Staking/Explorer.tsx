import * as React from 'react'

import { CommonStats } from '@/modules/Staking/components/CommonStats'
import { Stakeholders } from '@/modules/Staking/components/Stakeholders'

export function Explorer(): JSX.Element {
    return (
        <div className="container container--large">
            <CommonStats />
            <Stakeholders />
        </div>
    )
}
