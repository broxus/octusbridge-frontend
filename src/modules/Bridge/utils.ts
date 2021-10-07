import { NetworkShape } from '@/bridge'
import { networks } from '@/config'


// todo: move to global utils
export function findNetwork(chainId: string, type: string): NetworkShape | undefined {
    return networks.find(item => item.chainId === chainId && item.type === type)
}

export function getTonMainNetwork(): NetworkShape | undefined {
    return findNetwork('1', 'ton')
}

export function isTonMainNetwork(network?: NetworkShape): boolean {
    return network !== undefined && (network.chainId === '1' && network.type === 'ton')
}

export function isSameNetwork(selectedNetworkChainId?: string, walletChainId?: string): boolean {
    return (
        selectedNetworkChainId !== undefined
        && walletChainId !== undefined
        && selectedNetworkChainId === walletChainId
    )
}
