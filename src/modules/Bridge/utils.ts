import BigNumber from 'bignumber.js'

import { DexConstants } from '@/misc'

export function unshiftedAmountWithSlippage(amount: BigNumber, slippage: number | string): BigNumber {
    return amount.times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.CoinDecimals)
        .dp(0, BigNumber.ROUND_UP)
}
