import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer, observer } from 'mobx-react-lite'

import {
    DateFilter, FilterField, Filters, NUM_REGEXP, RadioFilter, TextFilter,
} from '@/components/common/Filters'
import { Align, Table } from '@/components/common/Table'
import { Header, Section, Title } from '@/components/common/Section'
import { UserCard } from '@/components/common/UserCard'
import { Pagination } from '@/components/common/Pagination'
import { mapStakeholderKindToIntlId } from '@/modules/Staking/utils'
import { StakeholderApiOrdering, StakeholderKindApiRequest, StakeholdersApiFilters } from '@/modules/Staking/types'
import { useStakeholdersContext } from '@/modules/Staking/providers/StakeholdersProvider'
import {
    useBNParam, useDateParam, useDictParam, usePagination,
    useTableOrder, useUrlParams,
} from '@/hooks'
import {
    dateFormat, error, formattedTokenAmount,
} from '@/utils'

import './index.scss'

export function StakeholdersInner(): JSX.Element | null {
    const stakeholders = useStakeholdersContext()
    const intl = useIntl()
    const urlParams = useUrlParams()
    const pagination = usePagination(stakeholders.totalCount)
    const tableOrder = useTableOrder<StakeholderApiOrdering>('createdatdescending')

    const [createdAtGe] = useDateParam('created-ge')
    const [createdAtLe] = useDateParam('created-le')
    const [frozenStakeGe] = useBNParam('frozen-ge')
    const [frozenStakeLe] = useBNParam('frozen-le')
    const [lastRewardGe] = useBNParam('last-reward-ge')
    const [lastRewardLe] = useBNParam('last-reward-le')
    const [totalRewardGe] = useBNParam('total-reward-ge')
    const [totalRewardLe] = useBNParam('total-reward-le')
    const [userBalanceGe] = useBNParam('user-balance-ge')
    const [userBalanceLe] = useBNParam('user-balance-le')
    const [stakeholderKind] = useDictParam<StakeholderKindApiRequest>('stakeholder', ['ordinary', 'relay'])

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await stakeholders.fetch({
                createdAtGe,
                createdAtLe,
                frozenStakeGe,
                frozenStakeLe,
                lastRewardGe,
                lastRewardLe,
                totalRewardGe,
                totalRewardLe,
                userBalanceGe,
                userBalanceLe,
                stakeholderKind,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }
    }

    const changeFilters = (localFilters: StakeholdersApiFilters) => {
        pagination.submit(1)

        urlParams.set({
            'created-ge': localFilters.createdAtGe?.toString(),
            'created-le': localFilters.createdAtLe?.toString(),
            'frozen-ge': localFilters.frozenStakeGe?.toString(),
            'frozen-le': localFilters.frozenStakeLe?.toString(),
            'last-reward-ge': localFilters.lastRewardGe?.toString(),
            'last-reward-le': localFilters.lastRewardLe?.toString(),
            'total-reward-ge': localFilters.totalRewardGe?.toString(),
            'total-reward-le': localFilters.totalRewardLe?.toString(),
            'user-balance-ge': localFilters.userBalanceGe?.toString(),
            'user-balance-le': localFilters.userBalanceLe?.toString(),
            stakeholder: localFilters.stakeholderKind,
        })
    }

    React.useEffect(() => {
        fetch()
    }, [
        createdAtGe,
        createdAtLe,
        frozenStakeGe,
        frozenStakeLe,
        lastRewardGe,
        lastRewardLe,
        totalRewardGe,
        totalRewardLe,
        userBalanceGe,
        userBalanceLe,
        stakeholderKind,
        pagination.limit,
        pagination.page,
        tableOrder.order,
    ])

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKEHOLDERS_TITLE',
                    })}
                </Title>

                <Filters<StakeholdersApiFilters>
                    filters={{
                        createdAtGe,
                        createdAtLe,
                        frozenStakeGe,
                        frozenStakeLe,
                        lastRewardGe,
                        lastRewardLe,
                        totalRewardGe,
                        totalRewardLe,
                        userBalanceGe,
                        userBalanceLe,
                        stakeholderKind,
                    }}
                    onChange={changeFilters}
                >
                    {(localFilters, changeFilter) => (
                        <>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_DATE',
                                })}
                            >
                                <DateFilter
                                    value={localFilters.createdAtGe}
                                    onChange={changeFilter('createdAtGe')}
                                />
                                <DateFilter
                                    value={localFilters.createdAtLe}
                                    onChange={changeFilter('createdAtLe')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_BALANCE',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                    value={localFilters.userBalanceGe}
                                    onChange={changeFilter('userBalanceGe')}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                    value={localFilters.userBalanceLe}
                                    onChange={changeFilter('userBalanceLe')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_FROZEN',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                    value={localFilters.frozenStakeGe}
                                    onChange={changeFilter('frozenStakeGe')}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                    value={localFilters.frozenStakeLe}
                                    onChange={changeFilter('frozenStakeLe')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_LAST_REWARD',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                    value={localFilters.lastRewardGe}
                                    onChange={changeFilter('lastRewardGe')}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                    value={localFilters.lastRewardLe}
                                    onChange={changeFilter('lastRewardLe')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_REWARD',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                    value={localFilters.totalRewardGe}
                                    onChange={changeFilter('totalRewardGe')}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                    value={localFilters.totalRewardLe}
                                    onChange={changeFilter('totalRewardLe')}
                                />
                            </FilterField>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'STAKEHOLDERS_TYPE',
                                })}
                            >
                                <RadioFilter<StakeholderKindApiRequest>
                                    labels={[{
                                        id: 'ordinary',
                                        name: intl.formatMessage({
                                            id: 'STAKEHOLDERS_TYPE_ORDINARY',
                                        }),
                                    }, {
                                        id: 'relay',
                                        name: intl.formatMessage({
                                            id: 'STAKEHOLDERS_TYPE_RELAY',
                                        }),
                                    }]}
                                    onChange={changeFilter('stakeholderKind')}
                                    value={localFilters.stakeholderKind}
                                />
                            </FilterField>
                        </>
                    )}
                </Filters>
            </Header>

            <div className="card card--flat card--small">
                <Observer>
                    {() => (
                        <Table
                            loading={stakeholders.isLoading}
                            className="stakeholders-table"
                            onSort={tableOrder.onSort}
                            order={tableOrder.order}
                            cols={[{
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_ADDRESS',
                                }),
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_TYPE',
                                }),
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_STAKE',
                                }),
                                align: Align.right,
                                ascending: 'stakeascending',
                                descending: 'stakedescending',

                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_FROZEN',
                                }),
                                align: Align.right,
                                ascending: 'frozenstakeascending',
                                descending: 'frozenstakedescending',
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_30D',
                                }),
                                align: Align.right,
                                ascending: 'lastrewardascending',
                                descending: 'lastrewarddescending',
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_REWARD',
                                }),
                                align: Align.right,
                                ascending: 'totalrewardascending',
                                descending: 'totalrewarddescending',
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKEHOLDERS_DATE',
                                }),
                                align: Align.right,
                                ascending: 'createdatascending',
                                descending: 'createdatdescending',
                            }]}
                            rows={stakeholders.items.map(item => ({
                                cells: [
                                    item.userAddress ? (
                                        <UserCard
                                            copy
                                            external
                                            address={item.userAddress}
                                            link={`/staking/explorer/${item.userAddress}`}
                                        />
                                    ) : noValue,
                                    intl.formatMessage({
                                        id: mapStakeholderKindToIntlId(item.userType),
                                    }),
                                    item.stakeBalance ? formattedTokenAmount(item.stakeBalance) : noValue,
                                    item.frozenStakeBalance ? formattedTokenAmount(item.frozenStakeBalance) : noValue,
                                    item.lastReward ? formattedTokenAmount(item.lastReward) : noValue,
                                    item.totalReward ? formattedTokenAmount(item.totalReward) : noValue,
                                    item.createdAt ? dateFormat(item.createdAt) : noValue,
                                ],
                            }))}
                        />
                    )}
                </Observer>

                <Pagination
                    count={pagination.limit}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.totalCount}
                    page={pagination.page}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const Stakeholders = observer(StakeholdersInner)
