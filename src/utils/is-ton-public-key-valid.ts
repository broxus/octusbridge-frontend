export function isTonPublicKeyValid(value: string): boolean {
    return /^[0][x][a-fA-F0-9]{64}$/.test(value)
}
