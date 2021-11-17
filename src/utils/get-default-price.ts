import BigNumber from 'bignumber.js'

export function getDefaultPrice(value: BigNumber, dividedBy: BigNumber, decimals: number): BigNumber {
    return value.div(dividedBy).dp(decimals, BigNumber.ROUND_UP).shiftedBy(decimals)
}
