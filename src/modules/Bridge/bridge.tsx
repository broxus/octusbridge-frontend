import { Observer } from 'mobx-react-lite'
import * as React from 'react'

import {
    ApproveStep,
    AssetStep,
    EvmEvmStagesStep,
    EvmTvmStagesStep,
    RouteStep,
    SolanaTvmStagesStep,
    Summary,
    TvmEvmStagesStep,
    TvmSolanaStagesStep,
} from '@/modules/Bridge/components'
import { Debug } from '@/modules/Bridge/components/Debug'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep, type EvmPendingWithdrawal } from '@/modules/Bridge/types'

import './index.scss'

type Props = {
    evmPendingWithdrawal?: EvmPendingWithdrawal
}

export function Bridge({ evmPendingWithdrawal }: Props): JSX.Element {
    const bridge = useBridge()

    React.useEffect(() => {
        bridge.setData('evmPendingWithdrawal', evmPendingWithdrawal)
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
                                    if (bridge.isTvmEvm) {
                                        return <TvmEvmStagesStep key="tvm-evm-transfer" />
                                    }

                                    if (bridge.isEvmEvm) {
                                        return <EvmEvmStagesStep key="evm-evm-transfer" />
                                    }

                                    if (bridge.isEvmTvm) {
                                        return <EvmTvmStagesStep key="evm-transfer" />
                                    }

                                    if (bridge.isTvmSolana) {
                                        return <TvmSolanaStagesStep key="tvm-solana-transfer" />
                                    }

                                    if (bridge.isSolanaTvm) {
                                        return <SolanaTvmStagesStep key="solana-tvm-transfer" />
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

                    {process.env.NODE_ENV !== 'production' && <Debug />}
                </aside>
            </div>
        </section>
    )
}
