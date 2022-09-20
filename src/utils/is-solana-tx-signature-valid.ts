export function isSolanaTxSignatureValid(value?: string): boolean {
    return value ? /^[A-HJ-NP-Za-km-z1-9]*$/.test(value) : false
}
