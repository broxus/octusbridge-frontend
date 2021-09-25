export function isTonAddressValid(value: string): boolean {
    return /^[0][:][0-9a-fA-F]{64}$/.test(value)
}
