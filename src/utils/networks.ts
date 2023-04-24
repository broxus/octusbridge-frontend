import { networks } from '@/config'
import { type NetworkShape, type NetworkType } from '@/types'


export function getAssociatedNetwork(type: NetworkType): NetworkType {
    return ({
        everscale: 'tvm',
        tvm: 'tvm',
        evm: 'evm',
        solana: 'solana',
    } as Record<NetworkType, NetworkType>)[type]
}


export function findNetwork(chainId: string, type: NetworkType): NetworkShape | undefined {
    return networks.find(item => item.chainId === chainId && item.type === type)
}

export function getEverscaleMainNetwork(): NetworkShape | undefined {
    return findNetwork('42', 'tvm')
}

export function isEverscaleMainNetwork(network?: NetworkShape): boolean {
    return network !== undefined && (network.chainId === '42' && network.type === 'tvm')
}
