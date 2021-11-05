import * as React from 'react'
import { reaction } from 'mobx'

import { Summary, TonTransferStep } from '@/modules/Bridge/components'
import { useTonTransfer } from '@/modules/Bridge/providers'
import { useSummary } from '@/modules/Bridge/stores/TransferSummary'


export function TonToEvmStatus(): JSX.Element {
    const transfer = useTonTransfer()
    const summary = useSummary()

    React.useEffect(() => {
        const summaryDisposer = reaction(
            () => ({
                amount: transfer.amountNumber.toFixed(),
                leftAddress: transfer.leftAddress,
                leftNetwork: transfer.leftNetwork,
                rightAddress: transfer.rightAddress,
                rightNetwork: transfer.rightNetwork,
                token: transfer.token,
            }),
            data => {
                summary.update(data)
            },
        )
        return () => {
            summaryDisposer()
        }
    }, [])

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
