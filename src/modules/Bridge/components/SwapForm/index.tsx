import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBridge } from '@/modules/Bridge/providers'
import { SwapSwitcherFieldset } from '@/modules/Bridge/components/SwapForm/SwapSwitcherFieldset'
import { TokensAmountFieldset } from '@/modules/Bridge/components/SwapForm/TokensAmountFieldset'
import { EversAmountFieldset } from '@/modules/Bridge/components/SwapForm/EversAmountFieldset'


export function SwapForm(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_SWAP_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <SwapSwitcherFieldset />
                <Observer>
                    {() => (
                        <>
                            {bridge.isSwapEnabled ? (
                                <>
                                    <TokensAmountFieldset />
                                    <EversAmountFieldset />
                                </>
                            ) : null}
                        </>
                    )}
                </Observer>
            </form>
        </div>
    )
}
