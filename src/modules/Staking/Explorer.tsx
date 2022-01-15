import * as React from 'react'

import { Container } from '@/components/common/Section'
import { CommonStats } from '@/modules/Staking/components/CommonStats'
import { Stakeholders } from '@/modules/Staking/components/Stakeholders'
import { useScrollTop } from '@/hooks/useScrollTop'

export function Explorer(): JSX.Element {
    useScrollTop()

    return (
        <Container size="lg">
            <CommonStats />
            <Stakeholders />
        </Container>
    )
}
