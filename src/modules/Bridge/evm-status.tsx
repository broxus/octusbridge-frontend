import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { EvmTransferStep, Summary } from '@/modules/Bridge/components'
import { useEvmTransferStoreContext } from '@/modules/Bridge/providers'


export function EvmStatus(): JSX.Element {
    const transfer = useEvmTransferStoreContext()

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
