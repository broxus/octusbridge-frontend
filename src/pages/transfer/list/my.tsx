import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Transfers } from '@/modules/Transfers/transfers'
import { WalletConnector } from '@/modules/TonWalletConnector'
import { useTonWallet } from '@/stores/TonWalletService'

function PageInner(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useTonWallet()

    return (
        <div className="container container--large">
            <WalletConnector
                message={intl.formatMessage({
                    id: 'WALLET_CONNECT_MSG',
                })}
            >
                {tonWallet.address && (
                    <Transfers
                        userAddress={tonWallet.address}
                        title={intl.formatMessage({
                            id: 'TRANSFERS_MY_TITLE',
                        })}
                    />
                )}
            </WalletConnector>
        </div>
    )
}

const Page = observer(PageInner)

export default Page
