import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    limit: number;
    current: number;
    actual: number;
    onSubmit: (value: number) => void;
}

export function Filter({
    limit,
    current,
    actual,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const [value, setValue] = React.useState(actual.toString())

    const next = () => {
        onSubmit(actual + 1)
    }

    const prev = () => {
        onSubmit(actual - 1)
    }

    const reset = () => {
        onSubmit(current)
    }

    const submit = () => {
        const num = parseInt(value, 10)

        if (num > 0 && num <= limit && num !== actual) {
            onSubmit(num)
        }
    }

    const onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    const onBlurInput = () => {
        submit()
    }

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submit()
    }

    return (
        <form className="round-statistic-filter" onSubmit={onSubmitForm}>
            <Button
                type="secondary"
                className="round-statistic-filter__nav"
                disabled={actual >= limit}
                onClick={next}
            >
                <Icon icon="arrowLeft" />
            </Button>

            <div className="round-statistic-filter__input">
                <input
                    className="form-input"
                    type="text"
                    onChange={onChangeInput}
                    onBlur={onBlurInput}
                    value={value}
                />
            </div>

            <Button
                type="secondary"
                className="round-statistic-filter__nav"
                disabled={actual <= 1}
                onClick={prev}
            >
                <Icon icon="arrowRight" />
            </Button>

            <Button
                type="secondary"
                onClick={reset}
            >
                {intl.formatMessage({
                    id: 'ROUND_STATISTIC_FILTER_CURRENT',
                })}
            </Button>
        </form>
    )
}
