export function isEverscaleAddressValid(value?: string): boolean {
    return value ? /^[0][:][0-9a-fA-F]{64}$/.test(value) : false
}
