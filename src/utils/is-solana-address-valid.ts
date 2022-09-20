import bs58 from 'bs58'

export function isSolanaAddressValid(value?: string): boolean {
    try {
        if (value === undefined) {
            return false
        }
        const decoded = bs58.decode(value)
        return decoded?.length > 0
    }
    catch (e) {
        return false
    }
}
