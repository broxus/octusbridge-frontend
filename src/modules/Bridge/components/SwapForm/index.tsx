import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { EversAmountFieldset } from '@/modules/Bridge/components/SwapForm/EversAmountFieldset'
import { SwapSwitcherFieldset } from '@/modules/Bridge/components/SwapForm/SwapSwitcherFieldset'
import { useBridge } from '@/modules/Bridge/providers'

export const SwapForm = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()

    let symbol = ''

    if (bridge.isFromTvm) {
        symbol = bridge.evmWallet.coin.symbol
    }
    else if (bridge.isFromEvm) {
        symbol = bridge.tvmWallet.coin.symbol
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage(
                    {
                        id: 'CROSSCHAIN_TRANSFER_SWAP_LABEL',
                    },
                    { symbol },
                )}
            </div>
            <form className="form crosschain-transfer__form">
                <SwapSwitcherFieldset />
                {bridge.isEvmTvm && bridge.isSwapEnabled ? <EversAmountFieldset /> : null}
            </form>
        </div>
    )
})
