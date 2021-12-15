import { ProposalsFilters, ProposalState } from '@/modules/Governance/types'
import { useDateParam, useDictParam } from '@/hooks'

export function useProposalsFilters(prefix?: string): [
    ProposalsFilters, (filters: ProposalsFilters) => void,
] {
    const key = (val: string) => (prefix ? `${prefix}-${val}` : val)

    const [endTimeGe, setEndTimeGe] = useDateParam(key('end-time-ge'))
    const [endTimeLe, setEndTimeLe] = useDateParam(key('end-time-le'))
    const [startTimeGe, setStartTimeGe] = useDateParam(key('start-time-ge'))
    const [startTimeLe, setStartTimeLe] = useDateParam(key('start-time-le'))
    const [state, setState] = useDictParam<ProposalState>(
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
            setEndTimeGe(filters.endTimeGe)
            setEndTimeLe(filters.endTimeLe)
            setStartTimeGe(filters.startTimeGe)
            setStartTimeLe(filters.startTimeLe)
            setState(filters.state)
        },
    ]
}
