export function isEvmAddressValid(value: string): boolean {
    return /^[0][x][0-9a-fA-F]{40}$/.test(value)
}
