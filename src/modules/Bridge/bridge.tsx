import * as React from 'react'
import { reaction } from 'mobx'
import { Observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import {
    ApproveStep,
    AssetStep,
    EvmTransferStep,
    RouteStep,
    Summary,
    TonTransferStep,
} from '@/modules/Bridge/components'
import { useBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'

import './index.scss'


export function Bridge(): JSX.Element {
    const history = useHistory()
    const bridge = useBridge()

    React.useEffect(() => {
        bridge.init()

        const redirectDisposer = reaction(() => bridge.txHash, value => {
            if (value === undefined) {
                return
            }

            const leftNetwork = `${bridge.leftNetwork?.type}-${bridge.leftNetwork?.chainId}`
            const rightNetwork = `${bridge.rightNetwork?.type}-${bridge.rightNetwork?.chainId}`

            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}`)
        })

        return () => {
            redirectDisposer()
            bridge.dispose()
        }
    }, [])

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
                                        return <EvmTransferStep key="evm-transfer" />
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
                    <Observer>
                        {() => (
                            <Summary
                                amount={bridge.amount}
                                leftAddress={bridge.leftAddress}
                                leftNetwork={bridge.leftNetwork}
                                rightAddress={bridge.rightAddress}
                                rightNetwork={bridge.rightNetwork}
                                token={bridge.token}
                            />
                        )}
                    </Observer>
                </aside>
            </div>
        </section>
    )
}
