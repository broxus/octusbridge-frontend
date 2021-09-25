import { networks } from '@/modules/CrosschainTransfer/constants'
import { NetworkShape } from '@/modules/CrosschainTransfer/types'

export function findNetwork(chainId: string, type: string): NetworkShape | undefined {
    return networks.find(item => item.chainId === chainId && item.type === type)
}

export function getFreeTonNetwork(): NetworkShape | undefined {
    return findNetwork('1', 'ton')
}
