import * as React from 'react'
import { useIntl } from 'react-intl'

import { EverscaleTransferForm } from '@/modules/Bridge/components/EverscaleTransferForm'


export function EverscaleTransferStep(): JSX.Element {
    const intl = useIntl()

    return (
        <>
            <header className="section__header">
                <h2 className="section-title">
                    <div className="small">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STEP_3_HINT',
                        })}
                    </div>
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STEP_4_TITLE',
                    })}
                </h2>
            </header>

            <EverscaleTransferForm />
        </>
    )
}
