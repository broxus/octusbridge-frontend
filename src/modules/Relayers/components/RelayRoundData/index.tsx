import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'
import BigNumber from 'bignumber.js'

import { DataCard } from '@/components/common/DataCard'
import { EventsByChainId } from '@/modules/Relayers/components/EventsDistribution'
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
                            value={relayRoundInfo.info?.relayPlace !== undefined
                                ? formatDigits(relayRoundInfo.info.relayPlace.toString())
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
                            value={relayRoundInfo.info?.totalRoundConfirms !== undefined
                                && relayRoundInfo.info.eventsConfirmed !== undefined
                                ? `${formatDigits(relayRoundInfo.info.eventsConfirmed.toString())}/${formatDigits(relayRoundInfo.info.totalRoundConfirms.toString())}`
                                : noValue}
                        />
                    )}
                </Observer>

                <Observer>
                    {() => (
                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAY_ROUND_DATA_EVENTS_SHARE',
                            })}
                            value={relayRoundInfo.info?.eventsConfirmedShare
                                ? `${formatDigits(
                                    new BigNumber(relayRoundInfo.info.eventsConfirmedShare).times(100)
                                        .dp(2).toFixed(),
                                )}%`
                                : noValue}
                        />
                    )}
                </Observer>
            </div>

            <div className="board__main">
                <Observer>
                    {() => (
                        <EventsByChainId
                            isLoading={relayRoundInfo.isLoading}
                            evmStats={relayRoundInfo.info?.evmStats}
                        />
                    )}
                </Observer>
            </div>
        </div>
    )
}
