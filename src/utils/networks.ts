import { networks } from '@/config'
import { LabeledNetwork, NetworkShape } from '@/types'


export function findNetwork(chainId: string, type: string): NetworkShape | undefined {
    return networks.find(item => item.chainId === chainId && item.type === type)
}

export function getTonMainNetwork(): NetworkShape | undefined {
    return findNetwork('1', 'ton')
}

export function isTonMainNetwork(network?: NetworkShape): boolean {
    return network !== undefined && (network.chainId === '1' && network.type === 'ton')
}

export function getLabeledNetworks(): LabeledNetwork[] {
    return networks.map((network: NetworkShape) => ({ label: network.label, value: network.id }))
}
