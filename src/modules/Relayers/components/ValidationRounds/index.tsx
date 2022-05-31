import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import {
    Header, Line, Section, Title,
} from '@/components/common/Section'
import { Rounds } from '@/modules/Relayers/components/Rounds'
import { RelayRounds } from '@/modules/Relayers/components/RelayRounds'
import { RoundData } from '@/modules/Relayers/components/RoundData'
import { RelayRoundData } from '@/modules/Relayers/components/RelayRoundData'
import { RoundHeader } from '@/modules/Relayers/components/ValidationRounds/RoundHeader'
import { View, ViewSwitcher } from '@/modules/Relayers/components/ValidationRounds/ViewSwitcher'
import { useRoundInfoListContext } from '@/modules/Relayers/providers'

function ValidationRoundsInner(): JSX.Element | null {
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
                    <>
                        {roundInfoList.relayAddress ? (
                            <RelayRounds
                                relayAddress={roundInfoList.relayAddress}
                            />
                        ) : (
                            <Rounds />
                        )}
                    </>
                )}
            </div>
        </Section>
    )
}

export const ValidationRounds = observer(ValidationRoundsInner)
