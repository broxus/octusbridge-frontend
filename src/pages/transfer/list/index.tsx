import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'

import { Transfers } from '@/modules/Transfers/transfers'
import { sliceAddress } from '@/utils'

type Params = {
    userAddress: string;
}

export default function Page(): JSX.Element {
    const intl = useIntl()
    const { userAddress } = useParams<Params>()

    return (
        <div className="container container--large">
            <Transfers
                userAddress={userAddress}
                title={intl.formatMessage({
                    id: 'TRANSFERS_USER_TITLE',
                }, {
                    address: sliceAddress(userAddress),
                })}
            />
        </div>
    )
}
