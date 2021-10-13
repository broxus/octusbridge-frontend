import BigNumber from 'bignumber.js'

import { isGoodBignumber } from '@/utils'


export function useBalanceValidation(balance?: string, amount?: string, decimals?: number): boolean {
    if (!amount) {
        return true
    }

    const balanceBN = new BigNumber(balance || 0)
    if (!isGoodBignumber(balanceBN)) {
        return false
    }

    let amountBN = new BigNumber(amount || 0)
    if (decimals !== undefined) {
        amountBN = amountBN.shiftedBy(decimals)
    }

    return amountBN.lte(balanceBN)
}
