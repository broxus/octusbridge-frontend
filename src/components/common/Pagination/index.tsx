import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    totalPages?: number;
    page: number;
    label?: string;
    size?: 'lg';
    onSubmit: (page: number) => void;
}

export function Pagination({
    totalPages = 1,
    page,
    label,
    size,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const [localPage, setLocalPage] = React.useState(page.toString())

    const next = () => {
        onSubmit(page + 1)
    }

    const prev = () => {
        onSubmit(page - 1)
    }

    const submit = () => {
        const num = parseInt(localPage, 10)

        if (num > 0 && num <= totalPages && num !== page) {
            onSubmit(num)
        }
    }

    const onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
        setLocalPage(e.currentTarget.value)
    }

    const onBlurInput = () => {
        submit()
    }

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit()
    }

    React.useEffect(() => {
        setLocalPage(page.toString())
    }, [page])

    return (
        <form className="pagination" onSubmit={onSubmitForm}>
            <div className="pagination-pages">
                {label || intl.formatMessage({
                    id: 'PAGINATION_PAGE',
                })}

                <div className="pagination-pages__field">
                    <input
                        className={classNames('form-input', {
                            [`form-input--${size}`]: size !== undefined,
                        })}
                        type="text"
                        value={localPage}
                        onChange={onChangeInput}
                        onBlur={onBlurInput}
                    />
                    <div className="pagination-pages__limit">
                        {intl.formatMessage({
                            id: 'PAGINATION_LIMIT',
                        }, {
                            value: totalPages,
                        })}
                    </div>
                </div>
            </div>

            <div className="pagination-nav">
                <Button
                    type="secondary"
                    className="pagination-nav__btn"
                    disabled={page <= 1}
                    onClick={prev}
                    size={size === 'lg' ? 'md' : undefined}
                >
                    <Icon icon="arrowLeft" className="pagination-nav__icon" />
                </Button>

                <Button
                    type="secondary"
                    className="pagination-nav__btn"
                    disabled={page >= totalPages}
                    onClick={next}
                    size={size === 'lg' ? 'md' : undefined}
                >
                    <Icon icon="arrowRight" className="pagination-nav__icon" />
                </Button>
            </div>
        </form>
    )
}
