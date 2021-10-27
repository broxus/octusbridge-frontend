import { NetworkShape } from '@/bridge'
import { networks } from '@/config'

export function getNetworkByCurrency(currency: string): NetworkShape | undefined {
    return networks.find(network => network.currencySymbol === currency)
}
