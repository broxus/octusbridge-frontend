import * as React from 'react'

import { EvmTvmStagesStep, Summary } from '@/modules/Bridge/components'
import { Debug } from '@/modules/Bridge/components/Debug'

export function EvmToTvm(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <EvmTvmStagesStep />
                </main>

                <aside className="sidebar">
                    <Summary />

                    {process.env.NODE_ENV !== 'production' && (
                        <Debug />
                    )}
                </aside>
            </div>
        </section>
    )
}
