
export type CoinRateKeys = 'ever' | 'eth' | 'bnb' | 'matic' | 'ftm' | 'avax'

const rates = new Map<CoinRateKeys, string>([
    ['ever', '0.05189'],
    ['eth', '1622.47'],
    ['bnb', '315.04'],
    ['matic', '1.01'],
    ['ftm', '1.01'],
    ['avax', '18.26'],
])

export function useCoinRate(key: CoinRateKeys): string {
    return rates.get(key) ?? '0'
}
