import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Pagination } from '@/components/common/Pagination'
import { Container, Description, Title } from '@/components/common/Section'
import { LiquidityRequestsTable } from '@/modules/LiquidityRequests/components/Table'
import { LiquidityRequestsHeader } from '@/modules/LiquidityRequests/components/Header'
import { useLiquidityRequests } from '@/modules/LiquidityRequests/providers/LiquidityRequestsProvider'
import { SearchNotInstantFilters, SearchNotInstantOrdering } from '@/modules/LiquidityRequests/types'
import {
    useBNParam, useDateParam, useNumParam, usePagination, useTableOrder, useTextParam, useUrlParams,
} from '@/hooks'

const mapStatus = (status?: string) => {
    switch (status) {
        case 'open':
            return 'Open'
        case 'close':
            return 'Close'
        default:
            return undefined
    }
}

export function LiquidityRequestsPageInner(): JSX.Element {
    const intl = useIntl()
    const urlParams = useUrlParams()
    const liquidityRequests = useLiquidityRequests()
    const pagination = usePagination(liquidityRequests.totalCount)
    const tableOrder = useTableOrder<SearchNotInstantOrdering>('bountydescending')

    const [createdAtGe] = useDateParam('created-ge')
    const [createdAtLe] = useDateParam('created-le')
    const [bountyGe] = useBNParam('bounty-ge')
    const [bountyLe] = useBNParam('bounty-le')
    const [volumeExecGe] = useBNParam('volume-ge')
    const [volumeExecLe] = useBNParam('volume-le')
    const [chainId] = useNumParam('chain-id')
    const [statusParam] = useTextParam('status')
    const [status, setStatus] = React.useState<string | undefined>('open')
    const statusFixed = mapStatus(status)

    const changeFilters = (localFilters: SearchNotInstantFilters) => {
        pagination.submit(1)
        urlParams.set({
            'created-ge': localFilters.createdAtGe?.toString(),
            'created-le': localFilters.createdAtLe?.toString(),
            'bounty-ge': localFilters.bountyGe,
            'bounty-le': localFilters.bountyLe,
            'volume-ge': localFilters.volumeExecGe,
            'volume-le': localFilters.volumeExecLe,
            'chain-id': localFilters.chainId?.toString(),
            status: localFilters.status?.toLowerCase() ?? 'all',
        })
    }

    React.useEffect(() => {
        if (statusParam) {
            setStatus(statusParam)
        }
    }, [statusParam])

    React.useEffect(() => {
        if (liquidityRequests.isReady) {
            liquidityRequests.fetch({
                createdAtGe,
                createdAtLe,
                bountyGe,
                bountyLe,
                volumeExecGe,
                volumeExecLe,
                chainId,
                status: statusFixed,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
    }, [
        createdAtGe,
        createdAtLe,
        bountyGe,
        bountyLe,
        volumeExecGe,
        volumeExecLe,
        chainId,
        status,
        pagination.limit,
        pagination.offset,
        tableOrder.order,
        liquidityRequests.isReady,
    ])

    return (
        <Container size="lg">
            <Title size="lg">
                {intl.formatMessage({
                    id: 'LIQUIDITY_REQUESTS_TITLE',
                })}
            </Title>

            <Description indent="lg">
                {intl.formatMessage({
                    id: 'LIQUIDITY_REQUESTS_DESC',
                })}
            </Description>

            <LiquidityRequestsHeader
                onChangeFilters={changeFilters}
                filters={{
                    createdAtGe,
                    createdAtLe,
                    bountyGe,
                    bountyLe,
                    volumeExecGe,
                    volumeExecLe,
                    chainId,
                    status: statusFixed,
                }}
            />

            <LiquidityRequestsTable
                onSort={tableOrder.onSort}
                order={tableOrder.order}
            />

            <Pagination
                page={pagination.page}
                totalCount={pagination.totalCount}
                totalPages={pagination.totalPages}
                onSubmit={pagination.submit}
            />
        </Container>
    )
}

export const LiquidityRequestsPage = observer(LiquidityRequestsPageInner)
