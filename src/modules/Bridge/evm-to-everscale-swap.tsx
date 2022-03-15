import * as React from 'react'

import { EvmSwapTransferStep, Summary } from '@/modules/Bridge/components'


export function EvmToEverscaleSwap(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EvmSwapTransferStep />
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
