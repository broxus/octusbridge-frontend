import * as React from 'react'
import { useIntl } from 'react-intl'

import { Bridge } from '@/modules/CrosschainTransfer'


export default function Page(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <header className="page-header">
                <h1 className="page-title">
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_HEADER_TITLE',
                    })}
                </h1>
            </header>

            <Bridge />
        </div>
    )
}
