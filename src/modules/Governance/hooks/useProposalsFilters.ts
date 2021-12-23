import { ProposalsFilters, ProposalState } from '@/modules/Governance/types'
import { useDateParam, useDictParam, useUrlParams } from '@/hooks'

export function useProposalsFilters(prefix?: string): [
    ProposalsFilters, (filters: ProposalsFilters) => void,
] {
    const urlParams = useUrlParams()
    const key = (val: string) => (prefix ? `${prefix}-${val}` : val)

    const [endTimeGe] = useDateParam(key('end-time-ge'))
    const [endTimeLe] = useDateParam(key('end-time-le'))
    const [startTimeGe] = useDateParam(key('start-time-ge'))
    const [startTimeLe] = useDateParam(key('start-time-le'))
    const [state] = useDictParam<ProposalState>(
        key('state'),
        [
            'Active',
            'Canceled',
            'Executed',
            'Expired',
            'Failed',
            'Pending',
            'Queued',
            'Succeeded',
        ],
    )

    return [
        {
            endTimeGe,
            endTimeLe,
            startTimeGe,
            startTimeLe,
            state,
        },
        (filters: ProposalsFilters) => {
            urlParams.set({
                [key('end-time-ge')]: filters.endTimeGe?.toString(),
                [key('end-time-le')]: filters.endTimeLe?.toString(),
                [key('start-time-ge')]: filters.startTimeGe?.toString(),
                [key('start-time-le')]: filters.startTimeLe?.toString(),
                [key('state')]: filters.state,
            })
        },
    ]
}
