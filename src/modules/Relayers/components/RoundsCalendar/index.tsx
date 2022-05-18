import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Section, Title } from '@/components/common/Section'
import { Calendar } from '@/modules/Relayers/components/RoundsCalendar/calendar'
import { useRoundsCalendarContext } from '@/modules/Relayers/providers'
import { TonButtonConnector } from '@/modules/TonWalletConnector'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

type Props = {
    roundNum?: number | 'current';
}

export function RoundsCalendarInner({
    roundNum,
}: Props): JSX.Element {
    const intl = useIntl()
    const roundsCalendar = useRoundsCalendarContext()
    const wallet = useEverWallet()
    const [isLoading, setIsLoading] = React.useState(true)

    const fetch = async () => {
        if (!wallet.isConnected) {
            return
        }

        setIsLoading(true)

        try {
            if (roundNum === 'current') {
                await roundsCalendar.fetchCurrent()
            }
            else if (roundNum !== undefined) {
                await roundsCalendar.fetchRound(roundNum)
            }
        }
        catch (e) {
            console.error(e)
        }

        setIsLoading(false)
    }

    React.useEffect(() => {
        fetch()
    }, [roundNum, wallet.isConnected])

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'ROUNDS_CALENDAR_TITLE',
                })}
            </Title>

            <div className="card card--flat card--small rounds-calendar">
                <TonButtonConnector
                    block={false}
                >
                    {isLoading && (
                        <div className="rounds-calendar__msg">
                            <ContentLoader slim transparent />
                        </div>
                    )}

                    {!isLoading && !roundsCalendar.rounds?.length && (
                        <div className="rounds-calendar__msg">
                            {intl.formatMessage({
                                id: 'CHART_LAYOUT_NO_DATA',
                            })}
                        </div>
                    )}

                    {!!roundsCalendar.rounds?.length && (
                        <Calendar />
                    )}
                </TonButtonConnector>
            </div>
        </Section>
    )
}

export const RoundsCalendar = observer(RoundsCalendarInner)
