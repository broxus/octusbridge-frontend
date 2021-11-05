import * as React from 'react'
import classNames from 'classnames'

import { truncateDecimals, validateMaxValue } from '@/utils'

import './index.scss'


type Props = {
    className?: string;
    decimals?: number;
    disabled?: boolean;
    displayMaxButton?: boolean;
    isValid?: boolean;
    maxButtonLabel?: string;
    maxValue?: string;
    placeholder?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    value?: string;
    onClickMax?: () => void;
    onChange?: (value: string) => void;
}


export function AmountField({
    className,
    decimals,
    disabled,
    displayMaxButton = true,
    maxButtonLabel = 'Max',
    maxValue,
    isValid,
    placeholder,
    prefix,
    suffix,
    onClickMax,
    ...props
}: Props): JSX.Element {
    const onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
        const { value } = event.target
        if (value.length === 0) {
            return
        }
        const validatedAmount = truncateDecimals(value, decimals)
        if (props.value !== validatedAmount && validatedAmount != null) {
            props.onChange?.(validatedAmount)
        }
        else if (validatedAmount == null) {
            props.onChange?.('')
        }
    }

    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        let { value } = event.target
        value = value.replace(/,/g, '.')
        value = value.replace(/[.]+/g, '.')
        value = value.replace(/(?!- )[^0-9.]/g, '')
        props.onChange?.(value)
    }

    return (
        <div
            className={classNames('amount-field', className, {
                disabled,
                invalid: !(isValid === undefined ? validateMaxValue(maxValue, props.value, decimals) : isValid),
            })}
        >
            {prefix}
            <input
                className={classNames([
                    'form-input',
                    'form-input--lg',
                ])}
                disabled={disabled}
                inputMode="decimal"
                placeholder={placeholder}
                type="text"
                value={props.value}
                onBlur={onBlur}
                onChange={onChange}
            />
            {suffix}
            {displayMaxButton && (
                <button
                    className="btn btn--secondary btn--sm"
                    disabled={disabled}
                    type="button"
                    onClick={onClickMax}
                >
                    {maxButtonLabel}
                </button>
            )}
        </div>
    )
}
