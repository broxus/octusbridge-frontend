import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { Summary, TonTransferStep } from '@/modules/CrosschainTransfer/components'
import {
    useTonTransferStatusStore,
} from '@/modules/CrosschainTransfer/providers'


export function TonStatus(): JSX.Element {
    const status = useTonTransferStatusStore()

    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <TonTransferStep />
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
