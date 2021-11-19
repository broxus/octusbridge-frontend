import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { Events } from '@/modules/Relayers/components/Events'
import { Relayers } from '@/modules/Relayers/components/Relayers'
import { RoundData } from '@/modules/Relayers/components/RoundData'
import { RoundHeader } from '@/modules/Relayers/components/RoundHeader'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'

export function ValidationRound(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'RELAYERS_BREADCRUMB_VALIDATION',
                    }, {
                        name: '123',
                    }),
                }]}
            />

            <RoundHeader
                title="Validation round 123"
                type="validation"
            />

            <Section>
                <Title>
                    {intl.formatMessage({
                        id: 'VALIDATION_ROUND_TITLE',
                    })}
                </Title>

                <RoundData />
            </Section>

            <Relayers />
            <Events />
        </div>
    )
}
