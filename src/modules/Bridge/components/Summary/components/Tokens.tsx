import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useBridge } from '@/modules/Bridge/providers'
import { sliceAddress } from '@/utils'


export function Tokens(): JSX.Element {
    const intl = useIntl()
    const { bridge, summary } = useBridge()
    const everWallet = bridge.useEverWallet
    const evmWallet = bridge.useEvmWallet
    const tokensAssets = bridge.useTokensAssets

    const addToEverAsset = (root: string) => async () => {
        try {
            await everWallet.addAsset(root)
        }
        catch (e) {

        }
    }

    const addToEvmAsset = (address: string) => async () => {
        if (summary.token === undefined || summary.pipeline?.chainId === undefined) {
            return
        }

        const asset = tokensAssets.get('evm', summary.pipeline.chainId, address.toLowerCase())
        try {
            const contract = tokensAssets.getEvmTokenContract(address, summary.pipeline.chainId)
            const symbol = await contract?.methods.symbol().call()
            await evmWallet.addAsset({
                address,
                decimals: summary.token.decimals,
                image: asset?.icon,
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
                                        onAddAsset={addToEvmAsset(evmTokenAddress)}
                                    >
                                        {sliceAddress(evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            ) : (isLeftEverscale && everscaleTokenAddress !== undefined) ? (
                                <div>
                                    <EverscanAccountLink
                                        key="token-link"
                                        addAsset
                                        address={everscaleTokenAddress}
                                        className="text-regular"
                                        onAddAsset={addToEverAsset(everscaleTokenAddress)}
                                    >
                                        {sliceAddress(everscaleTokenAddress)}
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
                                        onAddAsset={addToEvmAsset(evmTokenAddress)}
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
                                        address={everscaleTokenAddress}
                                        className="text-regular"
                                        onAddAsset={addToEverAsset(everscaleTokenAddress)}
                                    >
                                        {sliceAddress(everscaleTokenAddress)}
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
