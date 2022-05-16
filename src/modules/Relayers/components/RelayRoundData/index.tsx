import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { EventsDistribution } from '@/modules/Relayers/components/EventsDistribution'
import { useRelayRoundInfoContext } from '@/modules/Relayers/providers'
import { formatDigits, formattedAmount } from '@/utils'

export function RelayRoundData(): JSX.Element | null {
    const intl = useIntl()
    const relayRoundInfo = useRelayRoundInfoContext()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <div className="board">
            <div className="board__side">
                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAY_ROUND_DATA_BIDDING',
                            })}
                            value={relayRoundInfo.info
                                ? formatDigits(relayRoundInfo.info.relayPlace)
                                : noValue}
                        />
                    )}
                </Observer>

                {/* <DataCard
                    hint={intl.formatMessage({
                        id: 'SOON',
                    })}
                    title={intl.formatMessage({
                        id: 'RELAY_ROUND_DATA_REWARD',
                    })}
                /> */}

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAY_ROUND_DATA_STAKE',
                            })}
                            value={relayRoundInfo.info?.stake
                                ? formattedAmount(relayRoundInfo.info.stake)
                                : noValue}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAY_ROUND_DATA_EVENTS',
                            })}
                            value={relayRoundInfo.info?.eventsConfirmed
                                ? formatDigits(relayRoundInfo.info.eventsConfirmed)
                                : noValue}
                        />
                    )}
                </Observer>
            </div>

            <div className="board__main">
                <Observer>
                    {() => (
                        <EventsDistribution
                            isLoading={relayRoundInfo.isLoading}
                            ethToTonUsdt={relayRoundInfo.info?.ethToTonUsdt}
                            tonToEthUsdt={relayRoundInfo.info?.tonToEthUsdt}
                        />
                    )}
                </Observer>
            </div>
        </div>
    )
}
