import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'
import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'


export function VaultDetails(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

    return (
        <Observer>
            {() => {
                let baseUrl = summary.rightNetwork?.explorerBaseUrl as string,
                    vaultAddress = summary.pipeline?.vaultAddress as string
                if (summary.isEvmToEvm) {
                    baseUrl = summary.rightNetwork?.explorerBaseUrl as string
                    vaultAddress = summary.hiddenBridgePipeline?.vaultAddress as string
                }
                else if (summary.isFromEvm) {
                    baseUrl = summary.leftNetwork?.explorerBaseUrl as string
                }
                return (
                    <>
                        {(!summary.isEverscaleBasedToken && summary.vaultBalance !== undefined) && (
                            <li key="vault-balance">
                                <div className="text-muted">
                                    {intl.formatMessage({
                                        id: 'CROSSCHAIN_TRANSFER_SUMMARY_VAULT_BALANCE',
                                    }, {
                                        symbol: summary.token?.symbol || '',
                                    })}
                                </div>
                                <BlockScanAddressLink
                                    address={vaultAddress}
                                    baseUrl={baseUrl}
                                    external
                                >
                                    {formattedTokenAmount(
                                        summary.vaultBalance,
                                        summary.vaultBalanceDecimals,
                                    )}
                                </BlockScanAddressLink>
                            </li>
                        )}
                    </>
                )
            }}
        </Observer>
    )
}
