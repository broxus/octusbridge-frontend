import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import {
    ApproveStep,
    AssetStep,
    EverscaleEvmStagesStep,
    EverscaleSolanaStagesStep,
    EvmEverscaleStagesStep,
    RouteStep,
    SolanaEverscaleStagesStep,
    Summary,
} from '@/modules/Bridge/components'
import { Debug } from '@/modules/Bridge/components/Debug'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep, type EvmPendingWithdrawal } from '@/modules/Bridge/types'

import './index.scss'


type Props = {
    evmPendingWithdrawal?: EvmPendingWithdrawal;
}

export function Bridge({ evmPendingWithdrawal }: Props): JSX.Element {
    const bridge = useBridge()

    React.useEffect(() => {
        bridge.setState('evmPendingWithdrawal', evmPendingWithdrawal)
    }, [evmPendingWithdrawal])

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
                                    if (bridge.isEverscaleToEvm) {
                                        return <EverscaleEvmStagesStep key="everscale-evm-transfer" />
                                    }

                                    if (bridge.isEvmToEverscale) {
                                        return <EvmEverscaleStagesStep key="evm-transfer" />
                                    }

                                    if (bridge.isEverscaleToSolana) {
                                        return <EverscaleSolanaStagesStep key="everscale-solana-transfer" />
                                    }

                                    if (bridge.isSolanaToEverscale) {
                                        return <SolanaEverscaleStagesStep key="solana-everscale-transfer" />
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

                    {process.env.NODE_ENV !== 'production' && (
                        <Debug />
                    )}
                </aside>
            </div>
        </section>
    )
}
