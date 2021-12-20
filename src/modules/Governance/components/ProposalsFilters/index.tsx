import * as React from 'react'
import { useIntl } from 'react-intl'

import {
    DateFilter, FilterField, Filters, RadioFilter,
} from '@/components/common/Filters'
import { ProposalsFilters as ProposalsFiltersType, ProposalState } from '@/modules/Governance/types'

type Props = {
    filters: ProposalsFiltersType;
    onChangeFilters: (filters: ProposalsFiltersType) => void;
}

export function ProposalsFilters({
    filters,
    onChangeFilters,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Filters<ProposalsFiltersType>
            onChange={onChangeFilters}
            filters={filters}
        >
            {(localFilters, changeFilter) => (
                <>
                    <FilterField
                        title={intl.formatMessage({
                            id: 'PROPOSALS_FILTER_START',
                        })}
                    >
                        <DateFilter
                            value={localFilters.startTimeGe}
                            onChange={changeFilter('startTimeGe')}
                        />
                        <DateFilter
                            value={localFilters.startTimeLe}
                            onChange={changeFilter('startTimeLe')}
                        />
                    </FilterField>

                    <FilterField
                        title={intl.formatMessage({
                            id: 'PROPOSALS_FILTER_END',
                        })}
                    >
                        <DateFilter
                            value={localFilters.endTimeGe}
                            onChange={changeFilter('endTimeGe')}
                        />
                        <DateFilter
                            value={localFilters.endTimeLe}
                            onChange={changeFilter('endTimeLe')}
                        />
                    </FilterField>

                    <FilterField
                        title={intl.formatMessage({
                            id: 'PROPOSALS_FILTER_STATE',
                        })}
                    >
                        <RadioFilter<ProposalState>
                            labels={[{
                                id: 'Active',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_ACTIVE',
                                }),
                            }, {
                                id: 'Canceled',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_CANCELED',
                                }),
                            }, {
                                id: 'Executed',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_EXECUTED',
                                }),
                            }, {
                                id: 'Expired',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_EXPIRED',
                                }),
                            }, {
                                id: 'Failed',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_FAILED',
                                }),
                            }, {
                                id: 'Pending',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_PENDING',
                                }),
                            }, {
                                id: 'Queued',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_QUEUED',
                                }),
                            }, {
                                id: 'Succeeded',
                                name: intl.formatMessage({
                                    id: 'PROPOSALS_STATE_SUCCEEDED',
                                }),
                            }]}
                            onChange={changeFilter('state')}
                            value={localFilters.state}
                        />
                    </FilterField>
                </>
            )}
        </Filters>
    )
}
