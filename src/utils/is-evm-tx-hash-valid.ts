export function isEvmTxHashValid(value: string): boolean {
    return /^[0][x][0-9a-fA-F]{64}$/.test(value)
}
