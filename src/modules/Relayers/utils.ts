import { ETH_ADDRESS_REGEXP, TON_PUBLIC_KEY_REGEXP } from '@/modules/Relayers/constants'

function normalizeKey(pattern: RegExp, value: string): string {
    const result = value.toLowerCase()
    const match = value.match(pattern)

    if (!match) {
        return result
    }

    return match[1] ? result : `0x${result}`
}

export function normalizeTonPubKey(value: string): string {
    return normalizeKey(TON_PUBLIC_KEY_REGEXP, value)
}

export function normalizeEthAddress(value: string): string {
    return normalizeKey(ETH_ADDRESS_REGEXP, value)
}
