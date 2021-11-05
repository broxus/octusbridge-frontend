import BigNumber from 'bignumber.js'

import { networks } from '@/config'
import { DexConstants } from '@/misc'
import { NetworkShape } from '@/types'


export function amountWithSlippage(amount: BigNumber, slippage: number): string {
    return amount.times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.TONDecimals)
        .dp(0, BigNumber.ROUND_UP)
        .toFixed()
}


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
