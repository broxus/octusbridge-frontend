import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components/common/Icon'
import { Popup } from '@/components/common/Popup'
import { Pagination } from '@/components/common/Pagination'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Summary } from '@/components/common/Summary'
import { Button } from '@/components/common/Button'
import { Align, Table } from '@/components/common/Table'
import { ProposalSummary } from '@/modules/Governance/components/ProposalSummary'
import { useUserProposals } from '@/modules/Governance/hooks'
import { calcGazToUnlockVotes } from '@/modules/Governance/utils'
import { useVotingContext } from '@/modules/Governance/providers'
import { usePagination } from '@/hooks'
import { DexConstants } from '@/misc'
import { error, formattedTokenAmount } from '@/utils'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

type Props = {
    onDismiss: () => void;
    onSuccess?: () => void;
}

// TODO: VotingPower
export function UnlockFormInner({
    onDismiss,
    onSuccess,
}: Props): JSX.Element {
    const intl = useIntl()
    const tonWallet = useEverWallet()
    const voting = useVotingContext()
    const userProposals = useUserProposals()
    const pagination = usePagination(userProposals.totalCount)

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const initializing = voting.castedVotes === undefined
        || userProposals.totalCount === undefined
    const hasCastedVotes = voting.castedVotes !== undefined
        && voting.castedVotes.length > 0
    const isAvailableUnlockAll = hasCastedVotes
        && voting.castedVotes.length === userProposals.totalCount

    const fetch = async () => {
        if (!tonWallet.address) {
            return
        }

        try {
            await userProposals.fetch(tonWallet.address, {
                locked: true,
                limit: pagination.limit,
                offset: pagination.offset,
                availableForUnlock: true,
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

    const onSubmit = async () => {
        try {
            if (!voting.castedVotes) {
                return
            }

            const success = await voting.unlockCastedVote(
                voting.castedVotes.map(([id]) => parseInt(id, 10)),
            )

            if (success) {
                onSuccess?.()

                if (pagination.totalPages > 1) {
                    if (pagination.page === 1) {
                        fetch()
                    }
                    else {
                        pagination.submit(1)
                    }
                }
            }
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [
        pagination.page,
    ])

    return (
        <Popup
            className="unlock-form"
            disabled={voting.unlockLoading}
            onDismiss={onDismiss}
        >
            <h2 className="unlock-form__title">
                {intl.formatMessage({
                    id: 'UNLOCK_FORM_TITLE',
                })}
            </h2>

            {initializing ? (
                <div className="unlock-form__loader">
                    <ContentLoader slim transparent />
                </div>
            ) : (
                <>
                    {isAvailableUnlockAll === true && (
                        <>
                            <Table
                                className="unlock-form__table"
                                loading={userProposals.loading}
                                cols={[{
                                    name: intl.formatMessage({
                                        id: 'UNLOCK_FORM_ID',
                                    }),
                                }, {
                                    name: intl.formatMessage({
                                        id: 'UNLOCK_FORM_SUMMARY',
                                    }),
                                }, {
                                    name: intl.formatMessage({
                                        id: 'UNLOCK_FORM_TOKENS',
                                    }),
                                    align: Align.right,
                                }]}
                                rows={userProposals.items.map(({ proposal, vote }) => ({
                                    cells: [
                                        proposal.proposalId,
                                        proposal.state ? (
                                            <ProposalSummary
                                                id={proposal.proposalId}
                                                state={proposal.state}
                                                description={proposal.description}
                                            />
                                        ) : noValue,
                                        /* eslint-disable no-nested-ternary */
                                        voting.unlockedIds.includes(proposal.proposalId) ? (
                                            <Icon icon="success" />
                                        ) : (
                                            voting.token?.decimals ? (
                                                formattedTokenAmount(
                                                    vote.votes,
                                                    voting.token.decimals,
                                                )
                                            ) : noValue
                                        ),
                                    ],
                                }))}
                            />

                            <Summary
                                items={[{
                                    key: intl.formatMessage({
                                        id: 'UNLOCK_FORM_GAZ',
                                    }),
                                    value: intl.formatMessage({
                                        id: 'AMOUNT',
                                    }, {
                                        value: formattedTokenAmount(
                                            calcGazToUnlockVotes(userProposals.items.length),
                                            DexConstants.CoinDecimals,
                                        ),
                                        symbol: DexConstants.CoinSymbol,
                                    }),
                                }]}
                            />

                            {pagination.totalPages > 1 && (
                                <Pagination
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onSubmit={pagination.submit}
                                />
                            )}
                        </>
                    )}

                    {hasCastedVotes && !isAvailableUnlockAll && (
                        <div className="unlock-form__empty">
                            {intl.formatMessage({
                                id: 'USER_VOTE_UNLOCK_ALL_HINT',
                            })}
                        </div>
                    )}

                    {!hasCastedVotes && !isAvailableUnlockAll && (
                        <div className="unlock-form__empty">
                            {intl.formatMessage({
                                id: 'UNLOCK_FORM_NO_PROPOSALS',
                            })}
                        </div>
                    )}
                </>
            )}

            <div className="unlock-form__actions">
                <Button
                    block
                    type="secondary"
                    disabled={voting.unlockLoading}
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'UNLOCK_FORM_CANCEL',
                    })}
                </Button>

                <Button
                    block
                    type="primary"
                    disabled={userProposals.loading || voting.unlockLoading || !isAvailableUnlockAll}
                    onClick={onSubmit}
                >
                    {voting.unlockLoading ? (
                        <ContentLoader slim transparent />
                    ) : (
                        intl.formatMessage({
                            id: 'UNLOCK_FORM_UNLOCK',
                        })
                    )}
                </Button>
            </div>
        </Popup>
    )
}

export const UnlockForm = observer(UnlockFormInner)
