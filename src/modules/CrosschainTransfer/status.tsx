import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { Summary, TransferStep } from '@/modules/CrosschainTransfer/components'
import { useCrosschainTransferStatusStore } from '@/modules/CrosschainTransfer/providers'


export function Status(): JSX.Element {
    const transferStatus = useCrosschainTransferStatusStore()

    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <TransferStep />
                </main>

                <aside className="sidebar">
                    <Observer>
                        {() => (
                            <Summary
                                amount={transferStatus.amountNumber.toFixed()}
                                leftAddress={transferStatus.leftAddress}
                                leftNetwork={transferStatus.leftNetwork}
                                rightAddress={transferStatus.rightAddress}
                                rightNetwork={transferStatus.rightNetwork}
                                token={transferStatus.token}
                            />
                        )}
                    </Observer>
                </aside>
            </div>
        </section>
    )
}
