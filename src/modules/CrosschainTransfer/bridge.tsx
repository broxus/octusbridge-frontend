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
} from '@/modules/CrosschainTransfer/components'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'
import { CrosschainTransferStep } from '@/modules/CrosschainTransfer/types'

import './index.scss'


export function Bridge(): JSX.Element {
    const history = useHistory()
    const transfer = useCrosschainTransfer()

    React.useEffect(() => {
        transfer.init()

        const redirectDisposer = reaction(() => transfer.txHash, value => {
            if (value === undefined) {
                return
            }

            const leftNetwork = `${transfer.leftNetwork?.type}-${transfer.leftNetwork?.chainId}`
            const rightNetwork = `${transfer.rightNetwork?.type}-${transfer.rightNetwork?.chainId}`

            history.push(`/transfer/${leftNetwork}/${rightNetwork}/${value}`)
        })

        return () => {
            redirectDisposer()
            transfer.dispose()
        }
    }, [])

    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <Observer>
                        {() => {
                            switch (true) {
                                case transfer.step === CrosschainTransferStep.SELECT_ASSET:
                                    return <AssetStep key="asset" />

                                case transfer.step === CrosschainTransferStep.SELECT_APPROVAL_STRATEGY:
                                case transfer.step === CrosschainTransferStep.TRANSFER && transfer.isAwaitConfirmation:
                                    return <ApproveStep key="approve" />

                                case transfer.step === CrosschainTransferStep.TRANSFER && transfer.isEvmToTon:
                                    return <EvmTransferStep key="evm-transfer" />

                                case transfer.step === CrosschainTransferStep.TRANSFER && transfer.isTonToEvm:
                                    return <TonTransferStep key="ton-transfer" />

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
                                amount={transfer.amount}
                                leftAddress={transfer.leftAddress}
                                leftNetwork={transfer.leftNetwork}
                                rightAddress={transfer.rightAddress}
                                rightNetwork={transfer.rightNetwork}
                                token={transfer.token}
                            />
                        )}
                    </Observer>
                </aside>
            </div>
        </section>
    )
}