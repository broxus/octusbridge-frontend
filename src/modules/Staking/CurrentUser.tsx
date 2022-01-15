import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Container } from '@/components/common/Section'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Transactions } from '@/modules/Staking/components/Transactions'
import { UserStats } from '@/modules/Staking/components/UserStats'
import { StakingBalance } from '@/modules/Staking/components/Balance'
import { WalletConnector } from '@/modules/TonWalletConnector'
import { useTonWallet } from '@/stores/TonWalletService'

export function CurrentUser(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useTonWallet()

    return (
        <Container size="lg">
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_ROOT',
                    }),
                    link: '/staking',
                }, {
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_MY_STAKE',
                    }),
                }]}
            />

            <WalletConnector
                message={intl.formatMessage({
                    id: 'STAKING_CONNECT_WALLET_MSG',
                })}
            >
                <StakingBalance />

                <Observer>
                    {() => (
                        tonWallet.address ? (
                            <UserStats
                                showActions={false}
                                userAddress={tonWallet.address}
                            />
                        ) : null
                    )}
                </Observer>

                <Observer>
                    {() => (
                        tonWallet.address ? (
                            <Transactions
                                userAddress={tonWallet.address}
                            />
                        ) : null
                    )}
                </Observer>
            </WalletConnector>

        </Container>
    )
}
