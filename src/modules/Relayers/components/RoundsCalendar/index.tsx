import * as React from 'react'
import { useIntl } from 'react-intl'

import { Line, Section, Title } from '@/components/common/Section'
import { Day } from '@/modules/Relayers/components/RoundsCalendar/day'
import { Round } from '@/modules/Relayers/components/RoundsCalendar/round'
import { Block } from '@/modules/Relayers/components/RoundsCalendar/block'

import './index.scss'

export function RoundsCalendar(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'ROUNDS_CALENDAR_TITLE',
                })}
            </Title>

            <div className="card card--flat card--small rounds-calendar">
                <div className="rounds-calendar__inner">
                    <div className="rounds-calendar__line">
                        <Day maxLength={11} disabled />
                        <Day maxLength={11} disabled />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                        <Day maxLength={11} active />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                        <Day maxLength={11} />
                    </div>

                    <Line />

                    <div className="rounds-calendar__line">
                        <Round
                            title="Validation round 123"
                            link="/relayers/validation-round/123"
                            length={2}
                            maxLength={11}
                        />
                        <Round
                            title="Validation round 124"
                            length={6}
                            maxLength={11}
                        />
                        <Round
                            title="Validation round 125"
                            length={3}
                            maxLength={11}
                        />
                    </div>

                    <div className="rounds-calendar__line">
                        <Block length={2} maxLength={11}>
                            Finished
                        </Block>
                        <Block length={6} maxLength={11} status="active">
                            Active
                        </Block>
                        <Block length={3} maxLength={11}>
                            Not started
                        </Block>
                    </div>

                    <div className="rounds-calendar__line">
                        <Round
                            title="Bidding round 124"
                            link="/relayers/bidding-round/123"
                            length={2}
                            maxLength={11}
                        />
                        <Round
                            title="Bidding round 125"
                            length={7}
                            maxLength={11}
                        />
                        <Round
                            title="Bidding round 126"
                            length={2}
                            maxLength={11}
                        />
                    </div>

                    <div className="rounds-calendar__line">
                        <Block length={2} maxLength={11}>
                            Finished
                        </Block>
                        <Block length={3} maxLength={11} status="success">
                            Waiting for bidding
                        </Block>
                        <Block length={3} maxLength={11} status="active">
                            Bidding
                        </Block>
                        <Block length={1} maxLength={11} status="waiting">
                            Waiting for confirming
                        </Block>
                        <Block length={2} maxLength={11}>
                            Not started
                        </Block>
                    </div>
                </div>
            </div>
        </Section>
    )
}
