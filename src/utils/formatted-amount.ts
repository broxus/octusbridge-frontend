import BigNumber from 'bignumber.js'


export type FormattedAmountOptions = {
    /**
     * Which symbol should be placed between digits. By default, is space.
     */
    digitsSeparator?: string;
    /**
     *  Precision of the values below than `1e-3` (currency) or `1e-8` (token)
     */
    precision?: number;
    /** Preserve all decimals after point */
    preserve?: boolean;
    /**
     * Rounding mode, integer, 0 to 8.
     *
     * Default: BigNumber.ROUND_DOWN
     */
    roundingMode?: BigNumber.RoundingMode;
    /**
     * Round the amount if the value is greater than or equal
     * to the value passed in this option (`1e3`, `1e6`, `1e9` etc.).
     *
     * If enable - the `preserve` option is ignored.
     *
     * If passed `true` default round value will be `1e3`.
     * Otherwise, if pass `false` - the amount will not be rounded.
     *
     * Default: true
     */
    roundOn?: number | boolean;
    /** Truncate fractional part to this value */
    truncate?: number;
}

export const defaultBigNumberFormat: BigNumber.Format = {
    decimalSeparator: '.',
    groupSeparator: ' ',
    groupSize: 3,
}

export function formattedAmount(
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
        case amount.lte(1e-3):
            return amount.precision(opts.precision ?? 4, roundingMode).toFormat({
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })

        case amount.lte(1e-2):
            return amount.precision(3, roundingMode).toFormat({
                ...defaultBigNumberFormat,
                groupSeparator: opts.digitsSeparator,
            })

        case amount.gte(1) && roundOn && amount.lt(roundOn): {
            const decimalPlaces = amount.dp(2, roundingMode).decimalPlaces() ?? 2
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
