import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useSummary } from '@/modules/Bridge/providers'

export const Networks = observer(() => {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <>
            <li>
                <div
                    className="text-muted"
                    dangerouslySetInnerHTML={{
                        __html: intl.formatMessage(
                            {
                                id: summary.leftNetwork?.name
                                    ? 'CROSSCHAIN_TRANSFER_SUMMARY_FROM_BLOCKCHAIN'
                                    : 'CROSSCHAIN_TRANSFER_SUMMARY_FROM',
                            },
                            {
                                abbr: parts => `<abbr title="${summary.leftNetwork?.name}">${parts.join('')}</abbr>`,
                                blockchainName: summary.leftNetwork?.label || '',
                            },
                        ),
                    }}
                />
                {summary.leftNetwork?.name && summary.leftAddress ? (
                    <div>
                        {summary.leftNetwork?.type === 'tvm' && (
                            <EverscanAccountLink key="everscale-address" address={summary.leftAddress} copy />
                        )}
                        {summary.leftNetwork?.type === 'evm' && (
                            <BlockScanAddressLink
                                key="evm-address"
                                address={summary.leftAddress}
                                baseUrl={summary.leftNetwork.explorerBaseUrl}
                                copy
                                explorerLabel={summary.leftNetwork.explorerLabel}
                            />
                        )}
                        {summary.leftNetwork?.type === 'solana' && (
                            <BlockScanAddressLink
                                key="solana-address"
                                address={summary.leftAddress}
                                baseUrl={summary.leftNetwork.explorerBaseUrl}
                                copy
                                explorerLabel={summary.leftNetwork.explorerLabel}
                            />
                        )}
                    </div>
                ) : (
                    <div>–</div>
                )}
            </li>
            <li>
                <div
                    className="text-muted"
                    dangerouslySetInnerHTML={{
                        __html: intl.formatMessage(
                            {
                                id:
                                    summary.rightNetwork?.name
                                        ? 'CROSSCHAIN_TRANSFER_SUMMARY_TO_BLOCKCHAIN'
                                        : 'CROSSCHAIN_TRANSFER_SUMMARY_TO',
                            },
                            {
                                abbr: parts => `<abbr title="${summary.rightNetwork?.name}">${parts.join('')}</abbr>`,
                                blockchainName: summary.rightNetwork?.label || '',
                            },
                        ),
                    }}
                />
                {summary.rightNetwork?.name && summary.rightAddress ? (
                    <div>
                        {summary.rightNetwork?.type === 'tvm' && (
                            <EverscanAccountLink key="everscale-address" address={summary.rightAddress} copy />
                        )}
                        {summary.rightNetwork?.type === 'evm' && (
                            <BlockScanAddressLink
                                key="evm-address"
                                address={summary.rightAddress}
                                baseUrl={summary.rightNetwork.explorerBaseUrl}
                                copy
                                explorerLabel={summary.rightNetwork.explorerLabel}
                            />
                        )}
                        {summary.rightNetwork?.type === 'solana' && (
                            <BlockScanAddressLink
                                key="solana-address"
                                address={summary.rightAddress}
                                baseUrl={summary.rightNetwork.explorerBaseUrl}
                                explorerLabel={summary.rightNetwork.explorerLabel}
                                copy
                            />
                        )}
                    </div>
                ) : (
                    <div>–</div>
                )}
            </li>
        </>
    )
})
