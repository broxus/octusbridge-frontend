import * as React from 'react'

import { Summary, TonTransferStep } from '@/modules/Bridge/components'


export function TonToEvmStatus(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <TonTransferStep />
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
