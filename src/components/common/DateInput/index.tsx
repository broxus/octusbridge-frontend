import { DateTime } from 'luxon'
import * as React from 'react'
import { useIntl } from 'react-intl'
import DatePicker from 'react-datepicker'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    value?: Date | null;
    minDate?: Date | null;
    showClear?: boolean;
    placeholder?: string;
    onChange: (value: Date | null) => void;
}

export function DateInput({
    value,
    minDate,
    showClear,
    placeholder,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()

    const clear = () => {
        onChange(null)
    }

    return (
        <div className="date-input">
            <DatePicker
                selected={value}
                minDate={minDate}
                onChange={onChange}
                showPopperArrow={false}
                dateFormat="yyyy.MM.dd"
                className="form-input"
                placeholderText={placeholder || intl.formatMessage({
                    id: 'DATE_INPUT_PLACEHOLDER',
                })}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,

                }) => (
                    <div className="date-input__head">
                        <button
                            type="button"
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="date-input__nav"
                        >
                            <Icon icon="arrowLeft" />
                        </button>

                        {DateTime.fromJSDate(date).toFormat('LLLL')}
                        <button
                            type="button"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="date-input__nav"
                        >
                            <Icon icon="arrowRight" />
                        </button>
                    </div>
                )}
            />

            {showClear && value && (
                <button
                    type="button"
                    className="clear-input"
                    onClick={clear}
                >
                    <Icon icon="remove" ratio={0.6} />
                </button>
            )}
        </div>
    )
}
