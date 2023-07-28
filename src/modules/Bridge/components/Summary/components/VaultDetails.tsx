import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { BlockScanAddressLink } from '@/components/common/BlockScanAddressLink'
import { useSummary } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'

export function VaultDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => {
                let baseUrl = summary.rightNetwork?.explorerBaseUrl as string,
                    vaultAddress = summary.pipeline?.vaultAddress as string,
                    explorerLabel
                if (summary.isEvmEvm) {
                    baseUrl = summary.rightNetwork?.explorerBaseUrl as string
                    explorerLabel = summary.leftNetwork?.explorerLabel
                    vaultAddress = summary.secondPipeline?.vaultAddress as string
                }
                else if (summary.isFromEvm || summary.isSolanaTvm) {
                    explorerLabel = summary.leftNetwork?.explorerLabel
                    baseUrl = summary.leftNetwork?.explorerBaseUrl as string
                }
                else if (summary.isTvmEvm) {
                    explorerLabel = summary.rightNetwork?.explorerLabel
                }
                return (
                    <React.Fragment key="vault-balance">
                        {(!summary.isTvmBasedToken && summary.vaultBalance !== undefined) && (
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
                                    explorerLabel={explorerLabel ?? ''}
                                    external
                                >
                                    {formattedTokenAmount(
                                        summary.vaultBalance,
                                        summary.vaultBalanceDecimals,
                                    )}
                                </BlockScanAddressLink>
                            </li>
                        )}
                    </React.Fragment>
                )
            }}
        </Observer>
    )
}
