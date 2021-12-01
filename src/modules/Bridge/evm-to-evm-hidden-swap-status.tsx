import * as React from 'react'

import { EvmHiddenSwapTransferStep, Summary } from '@/modules/Bridge/components'


export function EvmToEvmHiddenSwapStatus(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EvmHiddenSwapTransferStep />
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
