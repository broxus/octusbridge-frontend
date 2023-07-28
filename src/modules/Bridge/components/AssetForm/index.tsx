import { debug } from '@broxus/js-utils'
import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'
import Web3 from 'web3'

import { Alert } from '@/components/common/Alert'
import { AmountFieldset } from '@/modules/Bridge/components/AssetForm/AmountFieldset'
import { TokensAssetsFieldset } from '@/modules/Bridge/components/AssetForm/TokensAssetsFieldset'
import { useBridge } from '@/modules/Bridge/providers'
import { type Tickers, getPrice } from '@/modules/Bridge/utils'
import { findNetwork, throwException } from '@/utils'

export const AssetForm = observer(() => {
    const intl = useIntl()
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
                    rate = (await getPrice(bridge.leftNetwork!.currencySymbol.toUpperCase() as Tickers)).price
                }
                else if (bridge.isFromTvm) {
                    rate = (await getPrice(bridge.rightNetwork!.currencySymbol.toUpperCase() as Tickers)).price
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
                            (await getPrice(targetNetwork.currencySymbol.toLowerCase() as Tickers)).price,
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
                }

                debug('Gas price updated', gasPriceNumber.shiftedBy(-bridge.tvmWallet.coin.decimals).toFixed())
                debug('Rate updated', rate)

                bridge.setData({
                    evmGas: gasPrice,
                    gasPrice: gasPriceNumber.toFixed(),
                    gasUsage: gasUsage.toString(),
                    rate,
                })
            }
            catch (e) {}
        }, 10000)
        return () => {
            clearInterval(interval)
        }
    }, [bridge.token])

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_ASSET_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <TokensAssetsFieldset />
                <AmountFieldset />
                {bridge.isLocked && (
                    <Alert
                        key="connection-alert"
                        className="margin-top"
                        text={intl.formatMessage({
                            id: 'CONNECTION_TROUBLE_NOTE',
                        })}
                        title={intl.formatMessage({
                            id: 'CONNECTION_TROUBLE_TITLE',
                        })}
                        type="danger"
                    />
                )}
            </form>
        </div>
    )
})
