import * as React from 'react'
import { useIntl } from 'react-intl'

import {
    Header, Line, Section, Title,
} from '@/components/common/Section'
import { Rounds } from '@/modules/Relayers/components/Rounds'
import { RoundData } from '@/modules/Relayers/components/RoundData'
import { RelayRoundData } from '@/modules/Relayers/components/RelayRoundData'
import { RoundHeader } from '@/modules/Relayers/components/ValidationRounds/RoundHeader'
import { View, ViewSwitcher } from '@/modules/Relayers/components/ValidationRounds/ViewSwitcher'
import { useRoundInfoListContext } from '@/modules/Relayers/providers'

export function ValidationRounds(): JSX.Element | null {
    const intl = useIntl()
    const roundInfoList = useRoundInfoListContext()
    const [view, setView] = React.useState(View.Stats)

    React.useEffect(() => {
        roundInfoList.current()
    }, [])

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

            <Line />

            <div className="validation-rounds-statistic">
                {view === View.Stats ? (
                    <>
                        <RoundHeader />

                        {roundInfoList.relayAddress ? (
                            <RelayRoundData />
                        ) : (
                            <RoundData />
                        )}
                    </>
                ) : (
                    <Rounds />
                )}
            </div>
        </Section>
    )
}
