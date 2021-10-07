import BigNumber from 'bignumber.js'

import { isGoodBignumber } from '@/utils'


export function useBalanceValidation(balance?: string, amount?: string, decimals?: number): boolean {
    if (balance && amount && decimals) {
        const balanceBN = new BigNumber(balance || 0)
        if (!isGoodBignumber(balanceBN)) {
            return false
        }
        const amountBN = new BigNumber(amount).shiftedBy(decimals)
        return amountBN.lte(balanceBN)
    }
    return true
}
