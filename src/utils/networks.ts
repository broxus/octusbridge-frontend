import { networks } from '@/config'
import { NetworkShape, NetworkType } from '@/types'


export function findNetwork(chainId: string, type: NetworkType): NetworkShape | undefined {
    return networks.find(item => item.chainId === chainId && item.type === type)
}

export function getEverscaleMainNetwork(): NetworkShape | undefined {
    return findNetwork('1', 'everscale')
}

export function isEverscaleMainNetwork(network?: NetworkShape): boolean {
    return network !== undefined && (network.chainId === '1' && network.type === 'everscale')
}
