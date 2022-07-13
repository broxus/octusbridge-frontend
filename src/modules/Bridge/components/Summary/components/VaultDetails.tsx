import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedTokenAmount } from '@/utils'


export function VaultDetails(): JSX.Element {
    const intl = useIntl()
    const { summary } = useBridge()

    return (
        <Observer>
            {() => (
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
                            <div className="text-truncate">
                                {formattedTokenAmount(
                                    summary.vaultBalance,
                                    summary.vaultBalanceDecimals,
                                )}
                            </div>
                        </li>
                    )}
                </>
            )}
        </Observer>
    )
}
