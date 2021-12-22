import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Transfers } from '@/modules/Transfers/transfers'
import { useTonWallet } from '@/stores/TonWalletService'
import { sliceAddress } from '@/utils'

type Params = {
    userAddress: string;
}

export function PageInner(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useTonWallet()
    const { userAddress } = useParams<Params>()

    let titleId = 'TRANSFERS_ALL_TITLE'

    if (tonWallet.address && tonWallet.address === userAddress) {
        titleId = 'TRANSFERS_MY_TITLE'
    }
    else if (userAddress) {
        titleId = 'TRANSFERS_USER_TITLE'
    }

    return (
        <div className="container container--large">
            <Transfers
                userAddress={userAddress}
                title={intl.formatMessage({
                    id: titleId,
                }, {
                    address: sliceAddress(userAddress),
                })}
            />
        </div>
    )
}

export default observer(PageInner)
