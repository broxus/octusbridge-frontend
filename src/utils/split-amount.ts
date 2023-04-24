import BigNumber from 'bignumber.js'

export function splitAmount(value?: string | number, decimals?: number): string[] {
    let val = new BigNumber(value ?? 0)

    if (decimals !== undefined) {
        val = val.shiftedBy(-decimals)
    }

    if (val.isNaN() || !val.isFinite()) {
        return ['0']
    }

    return val.toFixed().split('.')
}
