import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { Pipeline } from '@/models'
import { useBridge } from '@/modules/Bridge/providers'
import { erc20TokenContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import { findNetwork, sliceAddress } from '@/utils'


export function Tokens(): JSX.Element {
    const intl = useIntl()
    const { bridge, summary } = useBridge()
    const everWallet = bridge.useEverWallet
    const evmWallet = bridge.useEvmWallet
    const bridgeAssets = bridge.useBridgeAssets

    const addToEverAsset = (root: string) => async () => {
        try {
            await everWallet.addAsset(root)
        }
        catch (e) {

        }
    }

    const addToEvmAsset = (address: string, pipeline?: Pipeline) => async () => {
        if (summary.token === undefined || pipeline?.chainId === undefined) {
            return
        }

        const asset = bridgeAssets.get('evm', pipeline.chainId, address.toLowerCase())
        try {
            const network = findNetwork(pipeline.chainId, 'evm')
            if (network === undefined) {
                return
            }
            let symbol
            try {
                symbol = await erc20TokenContract(address, network.rpcUrl).methods.symbol().call()
            }
            catch (e) {
                const [activation, , symbolPrefix] = await evmMultiVaultContract(pipeline.vaultAddress, network.rpcUrl)
                    .methods.prefixes(address.toLowerCase())
                    .call()
                symbol = `${activation === '0' ? 'oct' : symbolPrefix}${summary.token.symbol}`
            }

            await evmWallet.addAsset({
                address,
                decimals: pipeline.evmTokenDecimals ?? summary.token.decimals,
                image: asset?.icon || summary.token.icon,
                symbol,
            })
        }
        catch (e) {}
    }

    return (
        <Observer>
            {() => {
                if (
                    summary.leftNetwork === undefined
                    || summary.rightNetwork === undefined
                    || summary.pipeline === undefined
                ) {
                    return null
                }

                const isLeftEverscale = summary.leftNetwork?.type === 'everscale'
                const isRightEverscale = summary.rightNetwork?.type === 'everscale'
                const isLeftEvm = summary.leftNetwork?.type === 'evm'
                const isRightEvm = summary.rightNetwork?.type === 'evm'

                const { everscaleTokenAddress, evmTokenAddress } = summary.pipeline

                return (
                    <>
                        <li key="min-max-transfer-fees-divider" className="divider" />

                        <li key="min-max-transfer-fees-header" className="header">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOKENS',
                            }, { symbol: summary.token?.symbol })}
                        </li>

                        <li>
                            <div className="text-muted">
                                {summary.leftNetwork?.name}
                            </div>

                            {/* eslint-disable-next-line no-nested-ternary */}
                            {(isLeftEvm && evmTokenAddress !== undefined) ? (
                                <div>
                                    <BlockScanAddressLink
                                        key="token-link"
                                        addAsset
                                        address={evmTokenAddress}
                                        className="text-regular"
                                        baseUrl={summary.leftNetwork.explorerBaseUrl}
                                        onAddAsset={addToEvmAsset(evmTokenAddress, summary.pipeline)}
                                    >
                                        {sliceAddress(evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            ) : (isLeftEverscale && everscaleTokenAddress !== undefined) ? (
                                <div>
                                    <EverscanAccountLink
                                        key="token-link"
                                        addAsset
                                        address={everscaleTokenAddress.toString()}
                                        className="text-regular"
                                        onAddAsset={addToEverAsset(everscaleTokenAddress.toString())}
                                    >
                                        {sliceAddress(everscaleTokenAddress.toString())}
                                    </EverscanAccountLink>
                                </div>
                            ) : <div>-</div>}
                        </li>

                        <li>
                            <div className="text-muted">
                                {summary.rightNetwork?.name}
                            </div>

                            {/* eslint-disable-next-line no-nested-ternary */}
                            {(isRightEvm && evmTokenAddress !== undefined) ? (
                                <div>
                                    <BlockScanAddressLink
                                        key="token-link"
                                        className="text-regular"
                                        addAsset
                                        address={summary.isEvmToEvm
                                            ? summary.hiddenBridgePipeline?.evmTokenAddress as string
                                            : evmTokenAddress}
                                        baseUrl={summary.rightNetwork.explorerBaseUrl}
                                        onAddAsset={addToEvmAsset(
                                            evmTokenAddress,
                                            summary.isEvmToEvm
                                                ? summary.hiddenBridgePipeline
                                                : summary.pipeline,
                                        )}
                                    >
                                        {sliceAddress(summary.isEvmToEvm
                                            ? summary.hiddenBridgePipeline?.evmTokenAddress as string
                                            : evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            ) : (isRightEverscale && everscaleTokenAddress !== undefined) ? (
                                <div>
                                    <EverscanAccountLink
                                        key="token-link"
                                        addAsset
                                        address={everscaleTokenAddress.toString()}
                                        className="text-regular"
                                        onAddAsset={addToEverAsset(everscaleTokenAddress.toString())}
                                    >
                                        {sliceAddress(everscaleTokenAddress.toString())}
                                    </EverscanAccountLink>
                                </div>
                            ) : <div>-</div>}
                        </li>
                    </>
                )
            }}
        </Observer>
    )
}
