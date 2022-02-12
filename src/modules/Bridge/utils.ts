import BigNumber from 'bignumber.js'
import { Contract } from 'everscale-inpage-provider'

import { BridgeConstants, DexConstants, TokenAbi } from '@/misc'
import rpc from '@/hooks/useRpcClient'


export function unshiftedAmountWithSlippage(amount: BigNumber, slippage: number | string): BigNumber {
    return amount.times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.TONDecimals)
        .dp(0, BigNumber.ROUND_UP)
}

export function getCreditFactoryContract(): Contract<typeof TokenAbi.CreditFactory> {
    return rpc.createContract(
        TokenAbi.CreditFactory,
        BridgeConstants.CreditFactoryAddress,
    )
}
