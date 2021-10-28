import BigNumber from 'bignumber.js'

import { isGoodBignumber } from '@/utils/is-good-bignumber'


export function amount(value?: string | number, decimals?: number): string {
    let val = new BigNumber(value || 0)

    if (decimals !== undefined) {
        val = val.shiftedBy(-decimals)
    }

    if (!isGoodBignumber(val)) {
        return '0'
    }

    const parts = val.toFixed().split('.')

    const strings = [
        parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
        parts[1],
    ]

    return strings.filter(e => e).join('.')
}
