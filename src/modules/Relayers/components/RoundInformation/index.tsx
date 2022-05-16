import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { DataCard } from '@/components/common/DataCard'
import { RelayRoundInfoResponse, RoundInfoResponse } from '@/modules/Relayers/types'
import { formattedAmount } from '@/utils'
import { RelayConfig } from '@/misc'

type Props = {
    relayConfig?: RelayConfig;
    roundInfo?: RoundInfoResponse;
    relayRoundInfo?: RelayRoundInfoResponse;
}

export function RoundInformation({
    relayConfig,
    roundInfo,
    relayRoundInfo,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'RELAYERS_ROUND_INFO_TITLE',
                })}
            </Title>

            <div className="tiles">
                {relayRoundInfo && (
                    <>
                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAYERS_ROUND_RANK',
                            })}
                        >
                            {relayRoundInfo.relayPlace}
                        </DataCard>

                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAYERS_ROUND_STAKE',
                            })}
                            value={formattedAmount(relayRoundInfo.stake, undefined, {
                                target: 'token',
                            })}
                        />

                        <DataCard
                            title={intl.formatMessage({
                                id: 'RELAYERS_ROUND_UNFROZEN',
                            })}
                        >
                            {intl.formatMessage({
                                id: 'SOON',
                            })}
                        </DataCard>
                    </>
                )}

                <DataCard
                    value={roundInfo?.relaysCount || noValue}
                    title={intl.formatMessage({
                        id: 'RELAYERS_ROUND_TOTAL',
                    })}
                />

                <DataCard
                    value={relayConfig?.minRelayDeposit
                        ? formattedAmount(relayConfig.minRelayDeposit, 9, {
                            target: 'token',
                        }) : noValue}
                    title={intl.formatMessage({
                        id: 'RELAYERS_ROUND_MINIMUM_STAKE',
                    })}
                />

                <DataCard
                    value={roundInfo?.averageRelayStake
                        ? formattedAmount(roundInfo.averageRelayStake, undefined, {
                            target: 'token',
                        }) : noValue}
                    title={intl.formatMessage({
                        id: 'RELAYERS_ROUND_AVERAGE_STAKE',
                    })}
                />
            </div>
        </Section>
    )
}
