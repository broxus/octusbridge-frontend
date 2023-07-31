import { debug } from '@broxus/js-utils'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import Web3 from 'web3'

import { useBridge } from '@/modules/Bridge/providers/CrosschainBridgeStoreProvider'
import { type Tickers, getPrice } from '@/modules/Bridge/utils'
import { findNetwork, throwException } from '@/utils'
import { getFullContractState } from '@/misc/contracts'

export function usePricePolling(): void {
    const bridge = useBridge()

    React.useEffect(() => {
        const interval = setInterval(async () => {
            if (bridge.pipeline?.chainId === undefined) {
                clearInterval(interval)
                return
            }
            try {
                const network = findNetwork(bridge.pipeline.chainId, 'evm')

                if (network === undefined) {
                    throwException('Network config not defined')
                }

                let web3 = new Web3(network.rpcUrl),
                    rate = '0'

                if (bridge.isFromEvm) {
                    rate = await getPrice(bridge.leftNetwork!.currencySymbol.toUpperCase() as Tickers)
                }
                else if (bridge.isFromTvm) {
                    rate = await getPrice(bridge.rightNetwork!.currencySymbol.toUpperCase() as Tickers)
                }

                const [gasPrice, gasUsage] = await Promise.all([
                    (await web3.eth.getGasPrice().catch(() => '0')),
                    bridge.getGasUsage(),
                ])
                let gasPriceNumber = BigNumber(gasPrice || 0)
                    .times(bridge.gasUsage || 0)
                    .shiftedBy(-bridge.evmWallet.coin.decimals)
                    .times(rate)
                    .times(1.2)
                    .dp(bridge.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                    .shiftedBy(bridge.tvmWallet.coin.decimals)

                if (bridge.isEvmEvm) {
                    const targetNetwork = bridge.secondPipeline?.chainId
                        ? findNetwork(bridge.secondPipeline.chainId, 'evm')
                        : undefined

                    if (targetNetwork) {
                        web3 = new Web3(targetNetwork.rpcUrl)
                        const [_rate, _gasPrice = '0', _gasUsage] = await Promise.all([
                            getPrice(targetNetwork.currencySymbol.toLowerCase() as Tickers),
                            web3.eth.getGasPrice().catch(() => '0'),
                            bridge.getSecondGasUsage(),
                        ])
                        gasPriceNumber = gasPriceNumber.plus(
                            BigNumber(_gasPrice || 0)
                            .times(_gasUsage)
                            .shiftedBy(-bridge.evmWallet.coin.decimals)
                            .times(_rate)
                            .times(1.2) // +20%
                            .dp(bridge.tvmWallet.coin.decimals, BigNumber.ROUND_DOWN)
                            .shiftedBy(bridge.tvmWallet.coin.decimals),
                        )
                    }

                    try {
                        if (bridge.pipeline.everscaleTokenAddress) {
                            const state = await getFullContractState(bridge.pipeline.everscaleTokenAddress)
                            if (!state?.isDeployed) {
                                debug('Token not deployed: + 1 expected evers')
                                gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
                            }
                        }
                        else {
                            debug('Token not deployed: + 1 expected evers')
                            gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
                        }
                    }
                    catch (e) {
                        debug('Token not deployed: + 1 expected evers')
                        gasPriceNumber = gasPriceNumber.plus(1_000_000_000)
                    }
                }

                debug('Gas price updated', gasPriceNumber.shiftedBy(-bridge.tvmWallet.coin.decimals).toFixed())
                debug('Rate updated', rate)

                bridge.setData({
                    evmGas: gasPrice,
                    gasPrice: gasPriceNumber.toFixed(),
                    gasUsage: gasUsage.toString(),
                    rate,
                })
                bridge.setState('isLocked', false)
            }
            catch (e) {
                bridge.setState('isLocked', true)
            }
        }, 10000)
        return () => {
            clearInterval(interval)
        }
    }, [])
}
