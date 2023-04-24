import BigNumber from 'bignumber.js'

import { defaultBigNumberFormat, type FormattedAmountOptions } from '@/utils/formatted-amount'

export function formattedTokenAmount(
    value?: string | number,
    decimals?: number,
    options?: FormattedAmountOptions,
): string {
    let amount = new BigNumber(value ?? 0)

    const opts: FormattedAmountOptions = {
        digitsSeparator: defaultBigNumberFormat.groupSeparator,
        roundOn: true,
        ...options,
    }
    const roundingMode = options?.roundingMode ?? BigNumber.ROUND_DOWN

    if (decimals !== undefined && decimals >= 0) {
        amount = (amount.decimalPlaces() ?? 0) > 0
            ? amount.dp(decimals, roundingMode)
            : amount.shiftedBy(-decimals)
    }

    const roundOn = typeof opts?.roundOn === 'boolean' ? (opts.roundOn && 1e3) : (opts?.roundOn ?? 1e3)

    if (opts?.preserve) {
        if (roundOn && amount.gte(roundOn)) {
            return amount.toFormat(0, roundingMode, {
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })
        }
        const decimalPlaces = amount.dp(decimals ?? amount.decimalPlaces() ?? 0, roundingMode).decimalPlaces() ?? 0
        return amount.toFormat(decimalPlaces, roundingMode, {
            ...defaultBigNumberFormat,
            groupSeparator: opts.digitsSeparator,
        })
    }

    if (opts?.truncate !== undefined) {
        if (roundOn && amount.gte(roundOn)) {
            return amount.toFormat(0, roundingMode, {
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })
        }
        const decimalPlaces = amount.dp(opts?.truncate ?? 0, roundingMode).decimalPlaces() ?? 0
        return amount.toFormat(decimalPlaces, roundingMode, {
            ...defaultBigNumberFormat,
            groupSeparator: opts.digitsSeparator,
        })
    }

    if (roundOn && amount.gte(roundOn)) {
        return amount.toFormat(0, roundingMode, {
            ...defaultBigNumberFormat,
            groupSeparator: opts.digitsSeparator,
        })
    }

    switch (true) {
        case amount.lte(1e-8):
            return amount.precision(opts.precision ?? 4, roundingMode).toFormat({
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })

        case amount.lt(1): {
            const decimalPlaces = amount.dp(8, roundingMode).decimalPlaces() ?? 8
            return amount.toFormat(decimalPlaces, roundingMode, {
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })
        }

        default: {
            const decimalPlaces = amount.dp(4, roundingMode).decimalPlaces() ?? 4
            return amount.toFormat(decimalPlaces, roundingMode, {
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })
        }
    }
}
