import * as React from 'react'

import { EvmTransferStep, Summary } from '@/modules/Bridge/components'


export function EvmToTonStatus(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EvmTransferStep />
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
