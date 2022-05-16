import * as React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Container, Section, Title } from '@/components/common/Section'
import { Events } from '@/modules/Relayers/components/Events'
import { RoundData } from '@/modules/Relayers/components/RoundData'
import { ValidationRoundHeader } from '@/modules/Relayers/components/RoundHeader'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { RoundRelayers } from '@/modules/Relayers/components/Relayers'
import {
    RelayersEventsProvider,
    RelaysRoundInfoProvider,
    RoundsCalendarProvider,
    useRoundInfoContext,
    useValidationRoundContext,
} from '@/modules/Relayers/providers'

type Params = {
    num: string;
}

export function ValidationRoundInner(): JSX.Element {
    const intl = useIntl()
    const params = useParams<Params>()
    const validationRound = useValidationRoundContext()
    const roundInfo = useRoundInfoContext()
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const roundNum = parseInt(params.num, 10)

        if (roundNum) {
            validationRound.fetch(roundNum)
            roundInfo.fetch({ roundNum })
        }
    }, [params.num])

    React.useEffect(() => {
        if (validationRound.isLoading !== undefined) {
            setLoading(validationRound.isLoading)
        }
    }, [validationRound.isLoading])

    if (loading) {
        return (
            <ContentLoader transparent />
        )
    }

    return (
        <Container size="lg">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'RELAYERS_BREADCRUMB_VALIDATION',
                    }, {
                        name: params.num,
                    }),
                }]}
            />

            <RoundsCalendarProvider>
                <ValidationRoundHeader />
            </RoundsCalendarProvider>

            <Section>
                <Title>
                    {intl.formatMessage({
                        id: 'VALIDATION_ROUND_TITLE',
                    })}
                </Title>

                <RoundData />
            </Section>

            <RelaysRoundInfoProvider>
                <RoundRelayers
                    roundNum={parseInt(params.num, 10)}
                />
            </RelaysRoundInfoProvider>

            <RelayersEventsProvider>
                <Events
                    roundNum={parseInt(params.num, 10)}
                />
            </RelayersEventsProvider>
        </Container>
    )
}

export const ValidationRound = observer(ValidationRoundInner)
