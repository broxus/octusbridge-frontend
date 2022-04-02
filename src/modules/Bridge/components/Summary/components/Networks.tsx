import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useBridge } from '@/modules/Bridge/providers'


export function Networks(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

    return (
        <>
            <li>
                <Observer>
                    {() => (
                        <>
                            <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: intl.formatMessage({
                                        id: summary.leftNetwork?.name !== undefined
                                            ? 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_BLOCKCHAIN'
                                            : 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                                    }, {
                                        abbr: parts => `<abbr title="${summary.leftNetwork?.label}">${parts.join('')}</abbr>`,
                                        blockchainName: summary.leftNetwork?.name || '',
                                    }),
                                }}
                            />
                            {(summary.leftNetwork?.name !== undefined && summary.leftAddress !== undefined) ? (
                                <div>
                                    {summary.leftNetwork?.type === 'everscale' && (
                                        <EverscanAccountLink
                                            key="ton-address"
                                            address={summary.leftAddress}
                                            copy
                                        />
                                    )}
                                    {summary.leftNetwork?.type === 'evm' && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={summary.leftAddress}
                                            baseUrl={summary.leftNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </div>
                            ) : (
                                <div>–</div>
                            )}
                        </>
                    )}
                </Observer>
            </li>
            <li>
                <Observer>
                    {() => (
                        <>
                            <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: intl.formatMessage({
                                        id: summary.rightNetwork?.name !== undefined
                                            ? 'CROSSCHAIN_TRANSFER_SUMMARY_TO_BLOCKCHAIN'
                                            : 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                                    }, {
                                        abbr: parts => `<abbr title="${summary.rightNetwork?.label}">${parts.join('')}</abbr>`,
                                        blockchainName: summary.rightNetwork?.name || '',
                                    }),
                                }}
                            />
                            {(summary.rightNetwork?.name !== undefined && summary.rightAddress !== undefined) ? (
                                <div>
                                    {summary.rightNetwork?.type === 'everscale' && (
                                        <EverscanAccountLink
                                            key="ton-address"
                                            address={summary.rightAddress}
                                            copy
                                        />
                                    )}
                                    {summary.rightNetwork?.type === 'evm' && (
                                        <BlockScanAddressLink
                                            key="evm-address"
                                            address={summary.rightAddress}
                                            baseUrl={summary.rightNetwork.explorerBaseUrl}
                                            copy
                                        />
                                    )}
                                </div>
                            ) : (
                                <div>–</div>
                            )}
                        </>
                    )}
                </Observer>
            </li>
        </>
    )
}
