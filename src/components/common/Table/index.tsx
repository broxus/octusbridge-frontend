import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Row } from '@/components/common/Table/row'
import { Align, Cell } from '@/components/common/Table/cell'

import './index.scss'

export * from '@/components/common/Table/cell'
export * from '@/components/common/Table/row'
export * from '@/components/common/Table/value'

type Col<O> = {
    name?: string | React.ReactNode;
    align?: Align;
    ascending?: O;
    descending?: O;
}

type Cell = string | React.ReactNode

type Row = {
    link?: string;
    cells: Cell[];
    disabled?: boolean;
};

type Props<O> = {
    cols: Col<O>[];
    rows?: Row[];
    rawRows?: React.ReactNode[];
    order?: O;
    className?: string;
    loading?: boolean;
    body?: React.ReactNode;
    soon?: boolean;
    onSort?: (order: O) => void;
}

export function Table<O>({
    cols,
    rows,
    rawRows,
    order,
    className,
    loading,
    body,
    soon,
    onSort,
}: Props<O>): JSX.Element {
    const intl = useIntl()

    const emptyMsg = (
        <div className="table__empty">
            {intl.formatMessage({
                id: 'EMPTY_LIST',
            })}
        </div>
    )

    return (
        <div className={classNames('list table', className)}>
            <div className="list__header">
                {cols.map((col, index) => (
                    /* eslint-disable react/no-array-index-key */
                    <Cell<O>
                        key={index}
                        align={col.align}
                        ascending={col.ascending}
                        descending={col.descending}
                        order={order}
                        onSort={onSort}
                    >
                        {col.name}
                    </Cell>
                ))}
            </div>

            {soon ? (
                <div className="table__soon">
                    {intl.formatMessage({
                        id: 'SOON',
                    })}
                </div>
            ) : (
                <div className="table__body">
                    {body || (
                        <>
                            {!loading && (
                                <>
                                    {!rows && !rawRows && emptyMsg}
                                    {rows && rows.length === 0 && emptyMsg}
                                    {rawRows && rawRows.length === 0 && emptyMsg}
                                </>
                            )}

                            {rawRows ? (
                                rawRows.map(item => item)
                            ) : (
                                rows && rows.length > 0 && (
                                    rows.map((row, i) => (
                                        /* eslint-disable react/no-array-index-key */
                                        <Row
                                            key={i}
                                            link={row.link}
                                            disabled={row.disabled}
                                        >
                                            {row.cells.map((cell, j) => (
                                                <Cell align={cols[j].align} key={j}>
                                                    {cell}
                                                </Cell>
                                            ))}
                                        </Row>
                                    ))
                                )
                            )}
                        </>
                    )}

                    <div
                        className={classNames('table__loader', {
                            table__loader_active: loading,
                        })}
                    >
                        <ContentLoader transparent slim />
                    </div>
                </div>
            )}
        </div>
    )
}
