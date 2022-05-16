import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { Icon } from '@/components/common/Icon'
import { formatDigits } from '@/utils'

import './index.scss'

type Props = {
    totalPages?: number;
    totalCount?: number;
    page: number;
    count?: number;
    label?: string;
    size?: 'lg' | 'md';
    className?: string;
    onSubmit: (page: number, count?: number) => void;
}

const COUNTS = [10, 20, 30, 40]
const DEFAULT_COUNT = 10

export function Pagination({
    totalPages = 1,
    totalCount,
    page,
    count = DEFAULT_COUNT,
    label,
    size,
    className,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const [localPage, setLocalPage] = React.useState(page.toString())

    const next = () => {
        onSubmit(page + 1, count)
    }

    const prev = () => {
        onSubmit(page - 1, count)
    }

    const submit = () => {
        const num = parseInt(localPage, 10)

        if (num > 0 && num <= totalPages && num !== page) {
            onSubmit(num, count)
        }
    }

    const onBlurInput = () => {
        submit()
    }

    const onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
        setLocalPage(e.currentTarget.value)
    }

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit()
    }

    const onChangeCount = (value: number) => {
        onSubmit(page, value)
    }

    React.useEffect(() => {
        setLocalPage(page.toString())
    }, [page])

    return (
        <form className={classNames('pagination', className)} onSubmit={onSubmitForm}>
            {totalCount !== undefined && totalPages > 1 && (
                <div className="pagination-count">
                    {intl.formatMessage({
                        id: 'PAGINATION_COUNT',
                    })}

                    <Select
                        value={count}
                        options={COUNTS.map(value => ({ value, label: value }))}
                        onChange={onChangeCount}
                    />

                    <span className="pagination-count__total">
                        {intl.formatMessage({
                            id: 'PAGINATION_TOTAL',
                        }, {
                            value: formatDigits(totalCount.toString()),
                        })}
                    </span>
                </div>
            )}

            <div className="pagination-pages">
                {label || intl.formatMessage({
                    id: 'PAGINATION_PAGE',
                })}

                <div className="pagination-pages__field">
                    <input
                        type="text"
                        value={localPage}
                        onChange={onChangeInput}
                        onBlur={onBlurInput}
                        className={classNames('form-input', {
                            [`form-input--${size}`]: size !== undefined,
                        })}
                    />
                    <div className="pagination-pages__limit">
                        {intl.formatMessage({
                            id: 'PAGINATION_LIMIT',
                        }, {
                            value: formatDigits(totalPages.toString()),
                        })}
                    </div>
                </div>

                <div className="pagination-nav">
                    <Button
                        type="secondary"
                        className="pagination-nav__btn"
                        disabled={page <= 1}
                        onClick={prev}
                        size={size}
                    >
                        <Icon icon="arrowLeft" className="pagination-nav__icon" />
                    </Button>

                    <Button
                        type="secondary"
                        className="pagination-nav__btn"
                        disabled={page >= totalPages}
                        onClick={next}
                        size={size}
                    >
                        <Icon icon="arrowRight" className="pagination-nav__icon" />
                    </Button>
                </div>
            </div>
        </form>
    )
}
