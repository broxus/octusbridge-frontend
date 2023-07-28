import * as React from 'react'

import { SolanaTvmStagesStep, Summary } from '@/modules/Bridge/components'
import { Debug } from '@/modules/Bridge/components/Debug'

export function SolanaToTvm(): JSX.Element {
    return (
        <section className="section">
            <div className="section__wrapper">
                <main className="content">
                    <hr />
                    <SolanaTvmStagesStep />
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
