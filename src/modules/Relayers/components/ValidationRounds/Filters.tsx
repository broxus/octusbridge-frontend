import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useRoundInfoContext, useRoundInfoListContext } from '@/modules/Relayers/providers'

import './index.scss'

export function FiltersInner(): JSX.Element {
    const intl = useIntl()
    const roundInfo = useRoundInfoContext()
    const roundInfoList = useRoundInfoListContext()

    const actual = roundInfo.info?.roundNum
    const limit = roundInfoList.currentRoundNum

    const [value, setValue] = React.useState('')

    const next = () => {
        if (actual !== undefined) {
            roundInfoList.select(actual + 1)
        }
    }

    const prev = () => {
        if (actual !== undefined) {
            roundInfoList.select(actual - 1)
        }
    }

    const submit = () => {
        if (limit !== undefined) {
            const num = parseInt(value, 10)

            if (num > 0 && num <= limit && num !== actual) {
                roundInfoList.select(num)
            }
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

    React.useEffect(() => {
        if (roundInfo.info?.roundNum) {
            setValue(roundInfo.info.roundNum.toString())
        }
    }, [roundInfo.info?.roundNum])

    return (
        <form className="validation-rounds-filter" onSubmit={onSubmitForm}>
            <Button
                type="secondary"
                className="validation-rounds-filter__nav"
                disabled={actual === undefined || limit === undefined || actual <= 1}
                onClick={prev}
            >
                <Icon icon="arrowLeft" />
            </Button>

            <div className="validation-rounds-filter__input">
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
                className="validation-rounds-filter__nav"
                disabled={actual === undefined || limit === undefined || actual >= limit}
                onClick={next}
            >
                <Icon icon="arrowRight" />
            </Button>

            <Button
                type="secondary"
                onClick={roundInfoList.current}
            >
                {intl.formatMessage({
                    id: 'ROUND_STATISTIC_FILTER_CURRENT',
                })}
            </Button>
        </form>
    )
}

export const Filters = observer(FiltersInner)
