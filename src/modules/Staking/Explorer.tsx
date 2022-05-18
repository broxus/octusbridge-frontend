import * as React from 'react'

import { Container } from '@/components/common/Section'
import { CommonStats } from '@/modules/Staking/components/CommonStats'
import { Stakeholders } from '@/modules/Staking/components/Stakeholders'

export function Explorer(): JSX.Element {
    return (
        <Container size="lg">
            <CommonStats />
            <Stakeholders />
        </Container>
    )
}
