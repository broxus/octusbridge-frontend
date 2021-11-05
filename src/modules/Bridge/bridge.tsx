import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import {
    ApproveStep,
    AssetStep,
    EvmSwapTransferStep,
    EvmTransferStep,
    RouteStep,
    Summary,
    TonTransferStep,
} from '@/modules/Bridge/components'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'

import './index.scss'


export function Bridge(): JSX.Element {
    const bridge = useBridge()

    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <Observer>
                        {() => {
                            switch (bridge.step) {
                                case CrosschainBridgeStep.SELECT_ASSET:
                                    return <AssetStep key="asset" />

                                case CrosschainBridgeStep.SELECT_APPROVAL_STRATEGY:
                                    return <ApproveStep key="approve" />

                                case CrosschainBridgeStep.TRANSFER:
                                    if (bridge.isEvmToTon) {
                                        return bridge.isSwapEnabled
                                            ? <EvmSwapTransferStep key="evm-swap-transfer" />
                                            : <EvmTransferStep key="evm-transfer" />
                                    }

                                    if (bridge.isTonToEvm) {
                                        return <TonTransferStep key="ton-transfer" />
                                    }

                                    return null

                                default:
                                    return <RouteStep key="step" />
                            }
                        }}
                    </Observer>
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
