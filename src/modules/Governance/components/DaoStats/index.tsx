import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { Section, Title } from '@/components/common/Section'
import { CommonCharts } from '@/modules/Staking/components/CommonCharts'
import { useExplorerContext } from '@/modules/Staking/providers/ExplorerProvider'
import { useProposals } from '@/modules/Governance/hooks'
import { error, formatDigits, formattedAmount } from '@/utils'

export function DaoStats(): JSX.Element | null {
    const intl = useIntl()
    const { mainInfo } = useExplorerContext()
    const proposals = useProposals()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await Promise.all([
                proposals.fetch({
                    limit: 1,
                    offset: 0,
                }),
                mainInfo.fetch(),
            ])
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'GOVERNANCE_DAO_OVERVIEW',
                })}
            </Title>

            <div className="board">
                <div className="board__side">
                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'DAO_STATS_RESERVES',
                                })}
                                value={mainInfo.tvl
                                    ? formattedAmount(mainInfo.tvl)
                                    : noValue}
                            />
                        )}
                    </Observer>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'DAO_STATS_DELEGATED',
                        })}
                    >
                        {intl.formatMessage({
                            id: 'SOON',
                        })}
                    </DataCard>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'DAO_STATS_VOTING_ADDRESSES',
                                })}
                                value={mainInfo.stakeholders
                                    ? formatDigits(mainInfo.stakeholders ?? 0)
                                    : noValue}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'DAO_STATS_PROPOSALS',
                                })}
                                value={proposals.totalCount
                                    ? formatDigits(proposals.totalCount ?? 0)
                                    : noValue}
                            />
                        )}
                    </Observer>
                </div>

                <div className="board__main">
                    <CommonCharts />
                </div>
            </div>
        </Section>
    )
}
