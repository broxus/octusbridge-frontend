import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { Skeleton } from '@/components/common/Skeleton'
import { erc20TokenContract } from '@/misc/eth-contracts'
import { type Pipeline } from '@/models'
import { EverAsset } from '@/modules/Bridge/components/Summary/components/EverAsset'
import { useBridge, useSummary } from '@/modules/Bridge/providers'
import { findNetwork, sliceAddress } from '@/utils'

export function Tokens(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const summary = useSummary()

    const addToEvmAsset = (address: string, pipeline?: Pipeline) => async () => {
        if (summary.token === undefined || pipeline?.chainId === undefined) {
            return
        }

        const asset = bridge.bridgeAssets.get('evm', pipeline.chainId, address.toLowerCase())
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
               symbol = summary.token.symbol
            }

            await bridge.evmWallet.addAsset({
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

                const isLeftEverscale = summary.leftNetwork?.type === 'tvm'
                const isRightEverscale = summary.rightNetwork?.type === 'tvm'
                const isLeftEvm = summary.leftNetwork?.type === 'evm'
                const isRightEvm = summary.rightNetwork?.type === 'evm'
                const isLeftSolana = summary.leftNetwork?.type === 'solana'
                const isRightSolana = summary.rightNetwork?.type === 'solana'
                const isNativeEvmCurrency = bridge.isNativeEvmCurrency || summary.isNativeEvmCurrency
                const isNativeTvmCurrency = bridge.isNativeTvmCurrency || summary.isNativeTvmCurrency

                const { everscaleTokenAddress, evmTokenAddress, solanaTokenAddress } = summary.pipeline

                return (
                    <>
                        <li key="tokens-divider" className="divider" />

                        <li key="tokens-header" className="header">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOKENS',
                            }, { symbol: summary.token?.symbol })}
                        </li>

                        {(() => {
                            if (
                                (isLeftEvm && isRightEvm && !isNativeEvmCurrency)
                                || (isLeftEvm && isRightEvm && isNativeTvmCurrency)
                                || (isLeftEvm && !isNativeEvmCurrency)
                            ) {
                                return (
                                    <li key="left-tokeт-1">
                                        <div className="text-muted">
                                            {summary.leftNetwork?.label}
                                        </div>
                                        <div>
                                            {!evmTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <BlockScanAddressLink
                                                    key="token-link"
                                                    addAsset
                                                    address={summary.token?.root ?? evmTokenAddress}
                                                    className="text-regular"
                                                    baseUrl={summary.leftNetwork.explorerBaseUrl}
                                                    explorerLabel={summary.leftNetwork.explorerLabel}
                                                    onAddAsset={addToEvmAsset(
                                                        summary.token?.root ?? evmTokenAddress,
                                                        summary.pipeline,
                                                    )}
                                                >
                                                    {sliceAddress(summary.token?.root ?? evmTokenAddress)}
                                                </BlockScanAddressLink>
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            if (isLeftEverscale && !isNativeTvmCurrency) {
                                return (
                                    <li key="left-tokeт-2">
                                        <div className="text-muted">
                                            {summary.leftNetwork?.label}
                                        </div>
                                        <div>
                                            {!everscaleTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <EverAsset
                                                    key="token-link"
                                                    address={everscaleTokenAddress.toString()}
                                                />
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            if (isLeftSolana) {
                                return (
                                    <li key="left-tokeт-3">
                                        <div className="text-muted">
                                            {summary.leftNetwork?.label}
                                        </div>
                                        <div>
                                            {!solanaTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <BlockScanAddressLink
                                                    key="token-link"
                                                    address={solanaTokenAddress.toBase58()}
                                                    className="text-regular"
                                                    copy
                                                    baseUrl={summary.leftNetwork.explorerBaseUrl}
                                                    explorerLabel={summary.leftNetwork.explorerLabel}
                                                >
                                                    {sliceAddress(
                                                        solanaTokenAddress.toBase58(),
                                                    )}
                                                </BlockScanAddressLink>
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            return null
                        })()}

                        {(() => {
                            if ((isLeftEvm && isRightEvm) || (isRightEvm && !isNativeEvmCurrency)) {
                                return (
                                    <li key="right-toke-1">
                                        <div className="text-muted">
                                            {summary.rightNetwork?.label}
                                        </div>
                                        <div>
                                            {!evmTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <BlockScanAddressLink
                                                    key="token-link"
                                                    className="text-regular"
                                                    addAsset
                                                    address={(summary.isEvmEvm
                                                        ? summary.secondPipeline?.evmTokenAddress as string
                                                        : evmTokenAddress)}
                                                    baseUrl={summary.rightNetwork.explorerBaseUrl}
                                                    explorerLabel={summary.rightNetwork.explorerLabel}
                                                    onAddAsset={addToEvmAsset(
                                                        evmTokenAddress,
                                                        summary.isEvmEvm
                                                            ? summary.secondPipeline
                                                            : summary.pipeline,
                                                    )}
                                                >
                                                    {sliceAddress(summary.isEvmEvm
                                                        ? summary.secondPipeline?.evmTokenAddress as string
                                                        : evmTokenAddress)}
                                                </BlockScanAddressLink>
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            if (isRightEverscale && !isNativeTvmCurrency) {
                                return (
                                    <li key="right-toke-2">
                                        <div className="text-muted">
                                            {summary.rightNetwork?.label}
                                        </div>
                                        <div>
                                            {!everscaleTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <EverAsset
                                                    key="token-link"
                                                    address={everscaleTokenAddress.toString()}
                                                />
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            if (isRightSolana) {
                                return (
                                    <li key="right-toke-3">
                                        <div className="text-muted">
                                            {summary.rightNetwork?.label}
                                        </div>
                                        <div>
                                            {!solanaTokenAddress ? (
                                                <Skeleton width={60} />
                                            ) : (
                                                <BlockScanAddressLink
                                                    key="token-link"
                                                    address={solanaTokenAddress.toBase58()}
                                                    className="text-regular"
                                                    copy
                                                    baseUrl={summary.rightNetwork.explorerBaseUrl}
                                                    explorerLabel={summary.rightNetwork.explorerLabel}
                                                >
                                                    {sliceAddress(
                                                        solanaTokenAddress.toBase58(),
                                                    )}
                                                </BlockScanAddressLink>
                                            )}
                                        </div>
                                    </li>
                                )
                            }
                            return null
                        })()}
                    </>
                )
            }}
        </Observer>
    )
}
