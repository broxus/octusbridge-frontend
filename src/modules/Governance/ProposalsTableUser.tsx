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
import { UnlockAllButton } from '@/modules/Governance/components/UnlockAllButton'
import { ProposalsFilters as Filters } from '@/modules/Governance/types'
import { useProposalsFilters, useUserProposal } from '@/modules/Governance/hooks'
import { WalletConnector } from '@/modules/TonWalletConnector/Panel'
import { useTonWallet } from '@/stores/TonWalletService'
import { usePagination } from '@/hooks'
import { error, formattedAmount } from '@/utils'
import { DexConstants } from '@/misc'

import './index.scss'

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
        if (tonWallet.address) {
            fetch()
        }
        else {
            userProposal.dispose()
        }
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
                    <UnlockAllButton
                        onSuccess={fetch}
                    />

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
                        rows={userProposal.items.map(({ proposal, vote }) => ({
                            cells: [
                                proposal.proposalId || noValue,
                                proposal.state ? (
                                    <ProposalSummary
                                        state={proposal.state}
                                        id={proposal.proposalId}
                                        description={proposal.description}
                                    />
                                ) : noValue,
                                vote?.support !== undefined ? (
                                    <VoteType
                                        badge
                                        type={vote.support === true ? 1 : 0}
                                        value={vote.votes
                                            ? formattedAmount(vote.votes, DexConstants.TONDecimals)
                                            : undefined}
                                    />
                                ) : noValue,
                                proposal.state ? <ProposalStatus state={proposal.state} /> : noValue,
                                <ProposalProgress
                                    againstVotes={proposal.againstVotes}
                                    forVotes={proposal.forVotes}
                                />,
                                proposal.startTime && proposal.endTime ? (
                                    <DateCard
                                        startTime={proposal.startTime * 1000}
                                        endTime={proposal.endTime * 1000}
                                    />
                                ) : noValue,
                                proposal.proposalId && proposal.state ? (
                                    <UnlockButton
                                        proposalId={proposal.proposalId}
                                        state={proposal.state}
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
