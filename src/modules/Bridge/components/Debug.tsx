import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { useBridge } from '@/modules/Bridge/providers'
import {
    findNetwork,
    formattedAmount,
    getEverscaleMainNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
    sliceAddress,
} from '@/utils'

export function Debug(): JSX.Element {
    const { bridge, summary } = useBridge()
    const { current: everscaleMainnet } = React.useRef(getEverscaleMainNetwork())

    return (
        <>
            <Observer>
                {() => {
                    const leftNetwork = summary.isTransferPage ? summary.leftNetwork : bridge.leftNetwork
                    const rightNetwork = summary.isTransferPage ? summary.rightNetwork : bridge.rightNetwork
                    const pipeline = summary.isTransferPage ? summary.pipeline : bridge.pipeline
                    if (leftNetwork === undefined || rightNetwork === undefined || pipeline === undefined) {
                        return null
                    }
                    const isFromEverscale = summary.isTransferPage ? summary.isFromEverscale : bridge.isFromEverscale
                    const isFromEvm = summary.isTransferPage ? summary.isFromEvm : bridge.isFromEvm
                    return (
                        <div className="card card--ghost card--flat margin-top">
                            <h3 className="margin-bottom">Pipeline debug</h3>
                            <ul className="list ">
                                {Object.keys({ ...pipeline?.toJSON() }).sort().map(key => {
                                    // @ts-ignore
                                    const value = pipeline?.toJSON()[key]
                                    return (
                                        <li style={{ fontSize: 13, padding: '5px 0' }} key={key}>
                                            <span className="text-muted">{`${key}: `}</span>
                                            {(() => {
                                                switch (key) {
                                                    case 'canonicalTokenAddress':
                                                    case 'ethereumConfiguration':
                                                    case 'everscaleConfiguration':
                                                    case 'everscaleTokenAddress':
                                                    case 'evmTokenAddress':
                                                    case 'mergeEverscaleTokenAddress':
                                                    case 'mergeEvmTokenAddress':
                                                    case 'mergePoolAddress':
                                                    case 'proxyAddress':
                                                    case 'vaultAddress': {
                                                        const address = value?.toString?.()
                                                        let href = ''
                                                        if (isEverscaleAddressValid(address)) {
                                                            href = `${everscaleMainnet?.explorerBaseUrl || ''}accounts/${address}`
                                                        }
                                                        if (isEvmAddressValid(address)) {
                                                            if (isFromEverscale) {
                                                                const network = findNetwork(rightNetwork.chainId, 'evm')
                                                                href = `${network?.explorerBaseUrl}address/${address}`
                                                            }
                                                            else if (isFromEvm) {
                                                                const network = findNetwork(leftNetwork.chainId, 'evm')
                                                                href = `${network?.explorerBaseUrl}address/${address}`
                                                            }
                                                        }
                                                        return (
                                                            <a href={href} rel="noreferrer noopener" target="_blank">
                                                                <code>
                                                                    {sliceAddress(address)}
                                                                </code>
                                                            </a>
                                                        )
                                                    }

                                                    case 'evmTokenBalance':
                                                    case 'vaultBalance':
                                                    case 'vaultLimit':
                                                        return (
                                                            <code>
                                                                {formattedAmount(
                                                                    value?.toString?.(),
                                                                    pipeline?.evmTokenDecimals,
                                                                )}
                                                            </code>
                                                        )

                                                    case 'depositFee':
                                                    case 'withdrawFee':
                                                        return (
                                                            <code>{value?.toString?.()}</code>
                                                        )

                                                    default:
                                                        return (
                                                            <code>
                                                                {value?.toString?.()}
                                                            </code>
                                                        )
                                                }
                                            })()}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                }}
            </Observer>
            <Observer>
                {() => {
                    const leftNetwork = summary.isTransferPage ? summary.leftNetwork : bridge.leftNetwork
                    const rightNetwork = summary.isTransferPage ? summary.rightNetwork : bridge.rightNetwork
                    const pipeline = summary.isTransferPage ? summary.hiddenBridgePipeline : bridge.hiddenBridgePipeline
                    if (leftNetwork === undefined || rightNetwork === undefined || pipeline === undefined) {
                        return null
                    }
                    const isFromEverscale = summary.isTransferPage ? summary.isFromEverscale : bridge.isFromEverscale
                    const isFromEvm = summary.isTransferPage ? summary.isFromEvm : bridge.isFromEvm
                    return (
                        <div className="card card--ghost card--flat margin-top">
                            <h3 className="margin-bottom">Opposite pipeline debug</h3>
                            <ul className="list ">
                                {Object.keys({ ...pipeline?.toJSON() }).sort().map(key => {
                                    // @ts-ignore
                                    const value = pipeline?.toJSON()[key]
                                    return (
                                        <li style={{ fontSize: 13, padding: '5px 0' }} key={key}>
                                            <span className="text-muted">{`${key}: `}</span>
                                            {(() => {
                                                switch (key) {
                                                    case 'canonicalTokenAddress':
                                                    case 'ethereumConfiguration':
                                                    case 'everscaleConfiguration':
                                                    case 'everscaleTokenAddress':
                                                    case 'evmTokenAddress':
                                                    case 'mergeEverscaleTokenAddress':
                                                    case 'mergeEvmTokenAddress':
                                                    case 'mergePoolAddress':
                                                    case 'proxyAddress':
                                                    case 'vaultAddress': {
                                                        const address = value?.toString?.()
                                                        let href = ''
                                                        if (isEverscaleAddressValid(address)) {
                                                            href = `${everscaleMainnet?.explorerBaseUrl || ''}accounts/${address}`
                                                        }
                                                        if (isEvmAddressValid(address)) {
                                                            if (isFromEverscale) {
                                                                const network = findNetwork(rightNetwork.chainId, 'evm')
                                                                href = `${network?.explorerBaseUrl}address/${address}`
                                                            }
                                                            else if (isFromEvm) {
                                                                const network = findNetwork(leftNetwork.chainId, 'evm')
                                                                href = `${network?.explorerBaseUrl}address/${address}`
                                                            }
                                                        }
                                                        return (
                                                            <a href={href} rel="noreferrer noopener" target="_blank">
                                                                <code>
                                                                    {sliceAddress(address)}
                                                                </code>
                                                            </a>
                                                        )
                                                    }

                                                    case 'evmTokenBalance':
                                                    case 'vaultBalance':
                                                    case 'vaultLimit':
                                                        return (
                                                            <code>
                                                                {formattedAmount(
                                                                    value?.toString?.(),
                                                                    pipeline?.evmTokenDecimals,
                                                                )}
                                                            </code>
                                                        )

                                                    case 'depositFee':
                                                    case 'withdrawFee':
                                                        return (
                                                            <code>{value?.toString?.()}</code>
                                                        )

                                                    default:
                                                        return (
                                                            <code>
                                                                {value?.toString?.()}
                                                            </code>
                                                        )
                                                }
                                            })()}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                }}
            </Observer>
        </>
    )
}
