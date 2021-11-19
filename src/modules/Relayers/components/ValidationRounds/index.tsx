import * as React from 'react'
import { useIntl } from 'react-intl'

import { Header, Section, Title } from '@/components/common/Section'
import { RoundStatistic } from '@/modules/Relayers/components/RoundStatistic'
import { Rounds } from '@/modules/Relayers/components/Rounds'
import { View, ViewSwitcher } from '@/modules/Relayers/components/ValidationRounds/ViewSwitcher'

export function ValidationRounds(): JSX.Element | null {
    const intl = useIntl()
    const [view, setView] = React.useState(View.Stats)

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'VALIDATION_ROUNDS_TITLE',
                    })}
                </Title>

                <ViewSwitcher
                    view={view}
                    onChange={setView}
                />
            </Header>

            <hr />

            {view === View.Stats ? (
                <RoundStatistic />
            ) : (
                <Rounds />
            )}
        </Section>
    )
}
