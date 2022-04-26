import * as React from 'react'
import { useIntl } from 'react-intl'

import { Amount } from '@/modules/Bridge/components/Summary/components/Amount'
import { PendingWithdrawals } from '@/modules/Bridge/components/Summary/components/PendingWithdrawals'
import { FeesDetails } from '@/modules/Bridge/components/Summary/components/FeesDetails'
import { Networks } from '@/modules/Bridge/components/Summary/components/Networks'
import { SwapDetails } from '@/modules/Bridge/components/Summary/components/SwapDetails'
import { TokenAmountDetails } from '@/modules/Bridge/components/Summary/components/TokenAmountDetails'
import { Tokens } from '@/modules/Bridge/components/Summary/components/Tokens'
import { TransitDetails } from '@/modules/Bridge/components/Summary/components/TransitDetails'
import { VaultDetails } from '@/modules/Bridge/components/Summary/components/VaultDetails'


export function Summary(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--ghost card--flat card--small">
            <h3 className="card-title">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TITLE',
                })}
            </h3>
            <ul className="summary">
                <Networks />
                <TransitDetails />
                <VaultDetails />
                <Tokens />
                <FeesDetails />
                <PendingWithdrawals />
                <Amount />
                <SwapDetails />
                <TokenAmountDetails />
            </ul>
        </div>
    )
}
