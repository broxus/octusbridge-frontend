import BigNumber from 'bignumber.js'

import { TokenCache as EvmTokenCache } from '@/stores/EvmTokensCacheService'
import { TokenCache as TonTokenCache } from '@/stores/TonTokensCacheService'


export function useBalanceValidation(token?: EvmTokenCache | TonTokenCache, amount?: string): boolean {
    if (token && amount) {
        const balanceBN = new BigNumber(token.balance || 0)
        const amountBN = new BigNumber(amount).shiftedBy(token.decimals)
        return amountBN.lte(balanceBN)
    }

    return true
}
