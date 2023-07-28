import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Amount } from '@/modules/Bridge/components/Summary/components/Amount'
import { FeesDetails } from '@/modules/Bridge/components/Summary/components/FeesDetails'
import { Networks } from '@/modules/Bridge/components/Summary/components/Networks'
import { PendingWithdrawals } from '@/modules/Bridge/components/Summary/components/PendingWithdrawals'
import { Tokens } from '@/modules/Bridge/components/Summary/components/Tokens'
import { VaultDetails } from '@/modules/Bridge/components/Summary/components/VaultDetails'
import { useBridge, useSummary } from '@/modules/Bridge/providers'

export const Summary = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()
    const summary = useSummary()

    const isNativeTvmCurrency = bridge.isNativeTvmCurrency || summary.isNativeTvmCurrency
    const isAlienForTargetNetwork = (
        bridge.isNativeEvmCurrency && bridge.secondPipeline?.isNative
    ) || (
        summary.isNativeEvmCurrency && summary.secondPipeline?.isNative
    )

    return (
        <div className="card card--ghost card--flat card--small">
            <h3 className="card-title">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_TITLE',
                })}
            </h3>
            <ul className="summary">
                <Networks />
                {!isNativeTvmCurrency && !isAlienForTargetNetwork && (
                    <VaultDetails />
                )}
                <Tokens />
                {(bridge.token || summary.token) && (
                    <FeesDetails />
                )}
                <PendingWithdrawals />
                <Amount />
            </ul>
        </div>
    )
})
