import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Section, Title } from '@/components/common/Section'
import { Pagination } from '@/components/common/Pagination'
import { useTransfers } from '@/modules/Transfers/hooks/useTransfers'
import { TransfersTable } from '@/modules/Transfers/components/TransfersTable'
import { usePagination, useTableOrder, useTextParam } from '@/hooks'
import { TransfersOrdering } from '@/modules/Transfers/types'
import { useTokensCache } from '@/stores/TokensCacheService'
import { error } from '@/utils'

function PendingTransfersListInner(): JSX.Element {
    const intl = useIntl()
    const pendingTransfers = useTransfers()
    const tokensCache = useTokensCache()
    const pendingPagination = usePagination(pendingTransfers.totalCount)
    const pendingTableOrder = useTableOrder<TransfersOrdering>('createdatdescending')

    const [userAddress] = useTextParam('user')

    const fetchPending = async () => {
        if (!tokensCache.isInitialized) {
            return
        }
        try {
            await pendingTransfers.fetch({
                status: 'pending',
                userAddress,
                limit: pendingPagination.limit,
                offset: pendingPagination.offset,
                ordering: pendingTableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }
    }

    React.useEffect(() => {
        fetchPending()
    }, [
        userAddress,
        pendingPagination.limit,
        pendingPagination.offset,
        pendingTableOrder.order,
        tokensCache.isInitialized,
    ])

    return (
        <>
            {pendingTransfers.totalCount !== undefined && pendingTransfers.totalCount > 0 && (
                <Section>
                    <Title>
                        {intl.formatMessage({
                            id: 'TRANSFERS_PENDING_TITLE',
                        })}
                    </Title>

                    <div className="card card--flat card--small">
                        <TransfersTable
                            loading={pendingTransfers.loading}
                            items={pendingTransfers.items}
                            order={pendingTableOrder.order}
                            onSort={pendingTableOrder.onSort}
                        />

                        {pendingPagination.totalPages > 1 && (
                            <Pagination
                                page={pendingPagination.page}
                                totalPages={pendingPagination.totalPages}
                                onSubmit={pendingPagination.submit}
                            />
                        )}
                    </div>
                </Section>
            )}
        </>
    )
}

export const PendingTransfersList = observer(PendingTransfersListInner)
