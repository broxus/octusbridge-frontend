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
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    suffix?: React.ReactNode;
    value?: string;
    onClickMax?: (maxValue: string) => void;
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
    readOnly,
    size,
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
        if (
            props.value
            && value.length > props.value.length
            && props.value.indexOf('.') > -1
            && value.charAt(value.length - 1) === '.'
        ) {
            return
        }
        value = value.replace(/,/g, '.')
        value = value.replace(/[.]+/g, '.')
        value = value.replace(/(?!- )[^0-9.]/g, '')
        props.onChange?.(value)
    }

    const clickMax = () => {
        onClickMax?.(maxValue || '')
    }

    return (
        <label
            className={classNames('amount-field', className, {
                [`amount-field--${size}`]: size !== undefined,
                disabled,
                invalid: !(isValid === undefined ? validateMaxValue(maxValue, props.value, decimals) : isValid),
            })}
        >
            {prefix}
            <input
                className={classNames('form-input', {
                    [`form-input--${size}`]: size !== undefined,
                })}
                disabled={disabled}
                inputMode="decimal"
                placeholder={placeholder}
                readOnly={readOnly}
                type="text"
                value={props.value}
                onBlur={onBlur}
                onChange={onChange}
            />
            {displayMaxButton && (
                <div className="amount-field-suffix">
                    <button
                        className={classNames('btn btn--secondary', {
                            [`btn--${size}`]: size !== undefined,
                        })}
                        disabled={disabled}
                        type="button"
                        onClick={clickMax}
                    >
                        {maxButtonLabel}
                    </button>
                </div>
            )}
            {suffix}
        </label>
    )
}
