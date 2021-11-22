import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { User } from '@/modules/Staking/User'
import { UserStoreProvider } from '@/modules/Staking/providers/UserStoreProvider'
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
                    <UserStoreProvider>
                        <User
                            userAddress={tonWallet.address}
                            title={intl.formatMessage({
                                id: 'STAKING_USER_STATS_SELF',
                            })}
                        />
                    </UserStoreProvider>
                )}
            </WalletConnector>
        </div>
    )
}

export default observer(PageInner)
