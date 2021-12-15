import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    Actions, Header, Section, Title,
} from '@/components/common/Section'
import { Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { VoteType } from '@/modules/Governance/components/VoteType'
import { ProposalSummary } from '@/modules/Governance/components/ProposalSummary'
import { ProposalStatus } from '@/modules/Governance/components/ProposalStatus'
import { ProposalProgress } from '@/modules/Governance/components/ProposalProgress'
import { DateCard } from '@/modules/Governance/components/DateCard'
import { ProposalsFilters } from '@/modules/Governance/components/ProposalsFilters'
import { UnlockButton } from '@/modules/Governance/components/UnlockButton'
// import { UnlockAllButton } from '@/modules/Governance/components/UnlockAllButton'
import { ProposalsFilters as Filters } from '@/modules/Governance/types'
import { useProposalsFilters, useUserProposal } from '@/modules/Governance/hooks'
import { WalletConnector } from '@/modules/TonWalletConnector/Panel'
import { useTonWallet } from '@/stores/TonWalletService'
import { usePagination } from '@/hooks'
import { error } from '@/utils'

import './index.scss'

// TODO: Unlock all tokens buttons
// TODO: Vote power
export function ProposalsTableUserInner(): JSX.Element | null {
    const intl = useIntl()
    const tonWallet = useTonWallet()
    const userProposal = useUserProposal()
    const pagination = usePagination(userProposal.totalCount)
    const [filters, setFilters] = useProposalsFilters('my')

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const changeFilters = (localFilters: Filters) => {
        pagination.submit(1)
        setFilters(localFilters)
    }

    const fetch = async () => {
        if (!tonWallet.address) {
            return
        }

        try {
            await userProposal.fetch(tonWallet.address, {
                startTimeGe: filters.startTimeGe,
                startTimeLe: filters.startTimeLe,
                endTimeGe: filters.endTimeGe,
                endTimeLe: filters.endTimeLe,
                state: filters.state,
                offset: pagination.offset,
                limit: pagination.limit,
                ordering: {
                    column: 'createdAt',
                    direction: 'DESC',
                },
            })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [
        filters.state,
        filters.endTimeGe,
        filters.endTimeLe,
        filters.startTimeGe,
        filters.startTimeLe,
        pagination.page,
        tonWallet.address,
    ])

    return (
        <Section>
            <Header>
                <Title>
                    {intl.formatMessage({
                        id: 'PROPOSALS_USER_TITLE',
                    })}
                </Title>

                <Actions>
                    {/* <UnlockAllButton /> */}

                    <ProposalsFilters
                        filters={filters}
                        onChangeFilters={changeFilters}
                    />
                </Actions>
            </Header>

            <WalletConnector size="md">
                <div className="card card--flat card--small">
                    <Table
                        className="proposals-user-table"
                        loading={userProposal.loading}
                        cols={[{
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_NO',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_SUMMARY',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_MY_VOTE',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_STATUS',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_VOTING',
                            }),
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_DATE',
                            }),
                            align: 'right',
                        }, {
                            name: intl.formatMessage({
                                id: 'PROPOSALS_TABLE_UNLOCK',
                            }),
                            align: 'right',
                        }]}
                        rows={userProposal.items.map(item => ({
                            cells: [
                                item.proposalId || noValue,
                                item.state ? (
                                    <ProposalSummary
                                        state={item.state}
                                        id={item.proposalId}
                                    />
                                ) : noValue,
                                item.vote?.support !== undefined ? (
                                    <VoteType
                                        type={item.vote.support === true ? 1 : 0}
                                        value="123 000.72"
                                    />
                                ) : noValue,
                                item.state ? <ProposalStatus state={item.state} /> : noValue,
                                <ProposalProgress
                                    againstVotes={item.againstVotes}
                                    forVotes={item.forVotes}
                                />,
                                item.endTime ? <DateCard timestamp={item.endTime} /> : noValue,
                                item.proposalId && item.state ? (
                                    <UnlockButton
                                        proposalId={item.proposalId}
                                        state={item.state}
                                    />
                                ) : noValue,
                            ],
                        }))}
                    />

                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onSubmit={pagination.submit}
                    />
                </div>
            </WalletConnector>

        </Section>
    )
}

export const ProposalsTableUser = observer(ProposalsTableUserInner)
