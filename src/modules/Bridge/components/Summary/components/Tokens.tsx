import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { TonscanAccountLink } from '@/components/common/TonscanAccountLink'
import { useSummary } from '@/modules/Bridge/stores'
import { sliceAddress } from '@/utils'


export function Tokens(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => (
                <>
                    {(
                        (summary.leftNetwork !== undefined && summary.pipeline !== undefined)
                        || (summary.rightNetwork !== undefined && summary.pipeline !== undefined)
                    ) && (
                        <>
                            <li key="min-max-transfer-fees-divider" className="divider" />

                            <li key="min-max-transfer-fees-header" className="header">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TOKENS',
                                }, { symbol: summary.token?.symbol })}
                            </li>
                        </>
                    )}

                    {(summary.leftNetwork !== undefined && summary.pipeline !== undefined) && (
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

                            {(summary.leftNetwork.type === 'evm' && summary.pipeline.evmTokenAddress !== undefined) && (
                                <div>
                                    <BlockScanAddressLink
                                        key="token-link"
                                        className="text-regular"
                                        baseUrl={summary.leftNetwork.explorerBaseUrl}
                                        address={summary.pipeline.evmTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(summary.pipeline.evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            )}

                            {(summary.leftNetwork.type === 'everscale' && summary.pipeline.everscaleTokenAddress !== undefined) && (
                                <div>
                                    <TonscanAccountLink
                                        key="token-link"
                                        className="text-regular"
                                        address={summary.pipeline.everscaleTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(summary.pipeline.everscaleTokenAddress)}
                                    </TonscanAccountLink>
                                </div>
                            )}
                        </li>
                    )}

                    {(summary.rightNetwork !== undefined && summary.pipeline !== undefined) && (
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

                            {(summary.rightNetwork.type === 'evm' && summary.pipeline.evmTokenAddress !== undefined) && (
                                <div key="evm-token">
                                    <BlockScanAddressLink
                                        key="token-link"
                                        className="text-regular"
                                        baseUrl={summary.rightNetwork.explorerBaseUrl}
                                        address={summary.pipeline.evmTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(summary.pipeline.evmTokenAddress)}
                                    </BlockScanAddressLink>
                                </div>
                            )}

                            {(summary.rightNetwork.type === 'everscale' && summary.pipeline.everscaleTokenAddress !== undefined) && (
                                <div key="everscale">
                                    <TonscanAccountLink
                                        key="token-link"
                                        className="text-regular"
                                        address={summary.pipeline.everscaleTokenAddress}
                                        copy
                                    >
                                        {sliceAddress(summary.pipeline.everscaleTokenAddress)}
                                    </TonscanAccountLink>
                                </div>
                            )}
                        </li>
                    )}
                </>
            )}
        </Observer>
    )
}
