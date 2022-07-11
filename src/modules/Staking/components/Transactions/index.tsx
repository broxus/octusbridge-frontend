import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import BigNumber from 'bignumber.js'

import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'
import { Header, Section, Title } from '@/components/common/Section'
import { Tab, Tabs } from '@/components/common/Tabs'
import { Align, Table } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { mapTransactionKindToIntlId } from '@/modules/Staking/utils'
import { useTransactionsContext } from '@/modules/Staking/providers/TransactionsProvider'
import { TransactionKindApiRequest, TransactionOrdering } from '@/modules/Staking/types'
import { usePagination } from '@/hooks/usePagination'
import { useTableOrder } from '@/hooks/useTableOrder'
import {
    dateFormat, error, formattedTokenAmount,
} from '@/utils'

import './index.scss'

type Props = {
    userAddress?: string;
}

export function TransactionsInner({
    userAddress,
}: Props): JSX.Element | null {
    const intl = useIntl()
    const transactions = useTransactionsContext()
    const pagination = usePagination(transactions.totalCount)
    const tableOrder = useTableOrder<TransactionOrdering>('timestampblockatdescending')
    const [transactionKind, setTransactionKind] = React.useState<TransactionKindApiRequest>()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const changeKindFn = (value?: TransactionKindApiRequest) => () => {
        pagination.submit(1)
        setTransactionKind(value)
    }

    const fetch = async () => {
        try {
            await transactions.fetch({
                userAddress,
                transactionKind,
                limit: pagination.limit,
                offset: pagination.offset,
                ordering: tableOrder.order,
            })
        }
        catch (e) {
            error(e)
        }

    }

    React.useEffect(() => {
        fetch()
    }, [
        userAddress,
        transactionKind,
        pagination.limit,
        pagination.offset,
        tableOrder.order,
    ])

    return (
        <Section>
            <Header size="lg">
                <Title size="lg">
                    {intl.formatMessage({
                        id: 'STAKING_TRANSACTIONS_TITLE',
                    })}
                </Title>
                <Tabs adaptive size="lg">
                    <Tab
                        active={transactionKind === undefined}
                        onClick={changeKindFn()}
                    >
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_ALL',
                        })}
                    </Tab>
                    <Tab
                        active={transactionKind === 'deposit'}
                        onClick={changeKindFn('deposit')}
                    >
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_DEPOSITS',
                        })}
                    </Tab>
                    <Tab
                        active={transactionKind === 'withdraw'}
                        onClick={changeKindFn('withdraw')}
                    >
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_WITHDRAWALS',
                        })}
                    </Tab>
                    <Tab
                        active={transactionKind === 'claim'}
                        onClick={changeKindFn('claim')}
                    >
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_REWARDS',
                        })}
                    </Tab>
                    <Tab
                        active={transactionKind === 'freeze'}
                        onClick={changeKindFn('freeze')}
                    >
                        {intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_FREEZES',
                        })}
                    </Tab>
                </Tabs>
            </Header>

            <div className="card card--flat card--small">
                <Table<TransactionOrdering>
                    loading={transactions.isLoading}
                    className="staking-transactions"
                    onSort={tableOrder.onSort}
                    order={tableOrder.order}
                    cols={[{
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_TYPE',
                        }),
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_TRS',
                        }),
                        align: Align.right,
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_AMOUNT',
                        }),
                        align: Align.right,
                        ascending: 'amountascending',
                        descending: 'amountdescending',
                    }, {
                        name: intl.formatMessage({
                            id: 'STAKING_TRANSACTIONS_COL_DATE',
                        }),
                        align: Align.right,
                        ascending: 'timestampblockascending',
                        descending: 'timestampblockatdescending',
                    }]}
                    rows={transactions.items.map(item => ({
                        cells: [
                            intl.formatMessage({
                                id: mapTransactionKindToIntlId(item.transactionKind),
                            }),
                            item.transactionHash
                                ? <TransactionExplorerLink withIcon id={item.transactionHash} />
                                : noValue,
                            item.amountExec
                                ? formattedTokenAmount(new BigNumber(item.amountExec).abs().toFixed())
                                : noValue,
                            item.timestampBlock ? dateFormat(item.timestampBlock) : noValue,
                        ],
                    }))}
                />

                <Pagination
                    count={pagination.limit}
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.totalCount}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const Transactions = observer(TransactionsInner)
