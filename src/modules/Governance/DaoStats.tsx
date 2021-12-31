import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { DataCard } from '@/components/common/DataCard'
import { Section, Title } from '@/components/common/Section'
import { CommonCharts } from '@/modules/Staking/components/CommonCharts'
import { ExplorerStoreContext } from '@/modules/Staking/providers/ExplorerStoreProvider'
import { useProposals } from '@/modules/Governance/hooks'
import { error, formattedAmount } from '@/utils'

export function DaoStats(): JSX.Element | null {
    const intl = useIntl()
    const explorer = React.useContext(ExplorerStoreContext)
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
                explorer?.fetchMainInfo(),
                explorer?.fetchStakeholders({
                    limit: 1,
                    offset: 0,
                    ordering: 'createdatascending',
                }),
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
                                value={explorer?.tvl
                                    ? formattedAmount(explorer.tvl, 0, true, true)
                                    : noValue}
                            />
                        )}
                    </Observer>

                    <DataCard
                        title={intl.formatMessage({
                            id: 'DAO_STATS_DELEGATED',
                        })}
                        value={noValue}
                    />

                    <Observer>
                        {() => (
                            <DataCard
                                title={intl.formatMessage({
                                    id: 'DAO_STATS_VOTING_ADDRESSES',
                                })}
                                value={explorer?.stakeholderTotalCount
                                    ? formattedAmount(explorer.stakeholderTotalCount)
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
                                    ? formattedAmount(proposals.totalCount)
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
