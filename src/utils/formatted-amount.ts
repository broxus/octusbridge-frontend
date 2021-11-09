import BigNumber from 'bignumber.js'

import { isGoodBignumber } from '@/utils/is-good-bignumber'


export function splitAmount(value?: string | number, decimals?: number): string[] {
    let val = new BigNumber(value || 0)

    if (decimals !== undefined) {
        val = val.shiftedBy(-decimals)
    }

    if (!isGoodBignumber(val)) {
        return ['0']
    }

    return val.toFixed().split('.')
}

export function formatDigits(value?: string): string {
    if (!value) {
        return ''
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formattedAmount(value?: string | number, decimals?: number, truncate: boolean = true): string {
    const parts = splitAmount(value, decimals)
    const isGreaterThanOrEqualThousand = new BigNumber(parts[0]).gte('1e3')
    const fractionalPart = new BigNumber(`0.${parts[1]}` || 0).dp(4, BigNumber.ROUND_UP).toFixed().split('.')[1]
    return [
        formatDigits(parts[0]),
        (truncate && isGreaterThanOrEqualThousand) ? fractionalPart : parts[1],
    ].filter(e => e).join('.')
}
