import * as React from 'react'

import { EverscaleTransferStep, Summary } from '@/modules/Bridge/components'


export function EverscaleToEvm(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EverscaleTransferStep />
                </main>

                <aside className="sidebar">
                    <Summary />
                </aside>
            </div>
        </section>
    )
}
