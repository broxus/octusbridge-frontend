import BigNumber from 'bignumber.js'
import { Contract } from 'everscale-inpage-provider'

import staticRpc from '@/hooks/useStaticRpc'
import { BridgeConstants, DexConstants, TokenAbi } from '@/misc'

export function unshiftedAmountWithSlippage(amount: BigNumber, slippage: number | string): BigNumber {
    return amount.times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.CoinDecimals)
        .dp(0, BigNumber.ROUND_UP)
}

export function getCreditFactoryContract(): Contract<typeof TokenAbi.CreditFactory> {
    return new staticRpc.Contract(
        TokenAbi.CreditFactory,
        BridgeConstants.CreditFactoryAddress,
    )
}
