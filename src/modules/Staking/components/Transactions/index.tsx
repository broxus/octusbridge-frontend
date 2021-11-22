import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer, observer } from 'mobx-react-lite'

import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'
import { Header, Section, Title } from '@/components/common/Section'
import { Tab, Tabs } from '@/components/common/Tabs'
import { Table } from '@/components/common/Table'
import { Amount } from '@/components/common/Amount'
import { Pagination } from '@/components/common/Pagination'
import { mapTransactionKindToIntlId } from '@/modules/Staking/utils'
import { TransactionKindApiRequest, TransactionOrdering } from '@/modules/Staking/types'
import { UserStoreContext } from '@/modules/Staking/providers/UserStoreProvider'
import { usePagination } from '@/hooks/usePagination'
import { useTableOrder } from '@/hooks/useTableOrder'
import { dateFormat, error } from '@/utils'

import './index.scss'

type Props = {
    userAddress: string;
}

export function TransactionsInner({
    userAddress,
}: Props): JSX.Element | null {
    const user = React.useContext(UserStoreContext)

    if (!user) {
        return null
    }

    const intl = useIntl()
    const pagination = usePagination(user.transactionsTotalCount)
    const tableOrder = useTableOrder<TransactionOrdering>('timestampblockatdescending')
    const [transactionKind, setTransactionKind] = React.useState<TransactionKindApiRequest>()

    const nullMessage = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const fetch = async () => {
        try {
            await user.fetchTransactions({
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

    const changeKindFn = (value?: TransactionKindApiRequest) => (
        () => {
            pagination.submit(1)
            setTransactionKind(value)
        }
    )

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
                <Observer>
                    {() => (
                        <Table<TransactionOrdering>
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
                                align: 'right',
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKING_TRANSACTIONS_COL_AMOUNT',
                                }),
                                align: 'right',
                                ascending: 'amountascending',
                                descending: 'amountdescending',
                            }, {
                                name: intl.formatMessage({
                                    id: 'STAKING_TRANSACTIONS_COL_DATE',
                                }),
                                align: 'right',
                                ascending: 'timestampblockascending',
                                descending: 'timestampblockatdescending',
                            }]}
                            rows={user.transactionsItems.map(item => ({
                                cells: [
                                    intl.formatMessage({
                                        id: mapTransactionKindToIntlId(item.transactionKind),
                                    }),
                                    item.transactionHash
                                        ? <TransactionExplorerLink withIcon id={item.transactionHash} />
                                        : nullMessage,
                                    <Amount value={item.amountExec} />,
                                    item.timestampBlock ? dateFormat(item.timestampBlock) : nullMessage,
                                ],
                            }))}
                        />
                    )}
                </Observer>

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onSubmit={pagination.submit}
                />
            </div>
        </Section>
    )
}

export const Transactions = observer(TransactionsInner)
