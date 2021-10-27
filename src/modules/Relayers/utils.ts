import { ETH_ADDRESS_REGEXP, TON_PUBLIC_KEY_REGEXP } from '@/modules/Relayers/constants'

function normalizeKey(pattern: RegExp, value: string): string {
    const result = value.match(pattern)

    if (!result) {
        return value
    }

    return result[1] ? value : `0x${value}`
}

export function normalizeTonPubKey(value: string): string {
    return normalizeKey(TON_PUBLIC_KEY_REGEXP, value)
}

export function normalizeEthAddress(value: string): string {
    return normalizeKey(ETH_ADDRESS_REGEXP, value)
}
