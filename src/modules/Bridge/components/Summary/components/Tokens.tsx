import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useBridge } from '@/modules/Bridge/providers'
import { sliceAddress } from '@/utils'


export function Tokens(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

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

                const isLeftEverscale = summary.leftNetwork.type === 'everscale'
                const isRightEverscale = summary.rightNetwork.type === 'everscale'
                const isLeftEvm = summary.leftNetwork.type === 'evm'
                const isRightEvm = summary.rightNetwork.type === 'evm'

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
                            <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOKEN',
                                    }, {
                                        blockchainName: summary.leftNetwork?.name || '',
                                    }),
                                }}
                            />

                            {/* eslint-disable-next-line no-nested-ternary */}
                            {(isLeftEvm && evmTokenAddress !== undefined) ? (
                                <div>
                                    <BlockScanAddressLink
                                        key="token-link"
                                        className="text-regular"
                                        baseUrl={summary.leftNetwork.explorerBaseUrl}
                                        address={evmTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            ) : (isLeftEverscale && everscaleTokenAddress !== undefined) ? (
                                <div>
                                    <EverscanAccountLink
                                        key="token-link"
                                        className="text-regular"
                                        address={everscaleTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(everscaleTokenAddress)}
                                    </EverscanAccountLink>
                                </div>
                            ) : <div>-</div>}
                        </li>

                        <li>
                            <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOKEN',
                                    }, {
                                        blockchainName: summary.rightNetwork?.name || '',
                                    }),
                                }}
                            />

                            {/* eslint-disable-next-line no-nested-ternary */}
                            {(isRightEvm && evmTokenAddress !== undefined) ? (
                                <div>
                                    <BlockScanAddressLink
                                        key="token-link"
                                        className="text-regular"
                                        baseUrl={summary.rightNetwork.explorerBaseUrl}
                                        address={evmTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            ) : (isRightEverscale && everscaleTokenAddress !== undefined) ? (
                                <div>
                                    <EverscanAccountLink
                                        key="token-link"
                                        className="text-regular"
                                        address={everscaleTokenAddress}
                                        copy
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
