import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { Summary, TonTransferStep } from '@/modules/Bridge/components'
import { useTonTransferStore } from '@/modules/Bridge/providers'


export function TonStatus(): JSX.Element {
    const transfer = useTonTransferStore()

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
                                amount={transfer.amountNumber.toFixed()}
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
