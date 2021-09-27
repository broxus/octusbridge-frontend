import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { EvmTransferStep, Summary } from '@/modules/CrosschainTransfer/components'
import { useEvmTransferStatusStore } from '@/modules/CrosschainTransfer/providers'


export function EvmStatus(): JSX.Element {
    const status = useEvmTransferStatusStore()

    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EvmTransferStep />
                </main>

                <aside className="sidebar">
                    <Observer>
                        {() => (
                            <Summary
                                amount={status.amountNumber.toFixed()}
                                leftAddress={status.leftAddress}
                                leftNetwork={status.leftNetwork}
                                rightAddress={status.rightAddress}
                                rightNetwork={status.rightNetwork}
                                token={status.token}
                            />
                        )}
                    </Observer>
                </aside>
            </div>
        </section>
    )
}
