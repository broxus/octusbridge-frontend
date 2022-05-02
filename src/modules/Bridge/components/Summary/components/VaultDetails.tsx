import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount } from '@/utils'


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
                                {formattedAmount(
                                    summary.vaultBalance,
                                    summary.vaultBalanceDecimals,
                                    { target: 'token' },
                                )}
                            </div>
                        </li>
                    )}
                </>
            )}
        </Observer>
    )
}
