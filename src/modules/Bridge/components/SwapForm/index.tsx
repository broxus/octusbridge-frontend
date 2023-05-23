import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { SwapSwitcherFieldset } from '@/modules/Bridge/components/SwapForm/SwapSwitcherFieldset'
import { EversAmountFieldset } from '@/modules/Bridge/components/SwapForm/EversAmountFieldset'


export function SwapForm(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const everWallet = bridge.useEverWallet
    const evmWallet = bridge.useEvmWallet

    let symbol = ''

    if (bridge.isFromEverscale) {
        symbol = evmWallet.coin.symbol
    }
    else if (bridge.isFromEvm) {
        symbol = everWallet.coin.symbol
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SWAP_LABEL',
                }, { symbol })}
            </div>
            <form className="form crosschain-transfer__form">
                <SwapSwitcherFieldset />
                <Observer>
                    {() => (
                        <React.Fragment key="evers-amount">
                            {bridge.isEvmToEverscale && bridge.isSwapEnabled ? (
                                <EversAmountFieldset />
                            ) : null}
                        </React.Fragment>
                    )}
                </Observer>
            </form>
        </div>
    )
}
