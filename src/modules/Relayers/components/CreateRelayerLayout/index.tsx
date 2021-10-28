import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { CreateRelayerSummary } from '@/modules/Relayers/components/CreateRelayerSummary'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
    tonTokenSymbol?: string;
    tonTokenDecimals?: number;
    relayInitialTonDeposit?: string;
    stakingBalance?: string;
    stakingTokenDecimals?: number;
    stakingTokenSymbol?: string;
    relayTonPubkey?: string;
    relayEthAddress?: string;
}

export function CreateRelayerLayout({
    children,
    tonTokenSymbol,
    tonTokenDecimals,
    relayInitialTonDeposit,
    stakingBalance,
    stakingTokenDecimals,
    stakingTokenSymbol,
    relayTonPubkey,
    relayEthAddress,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <header className="page-header">
                <h1 className="page-title">
                    {intl.formatMessage({
                        id: 'RELAYERS_CREATE_PAGE_TITLE',
                    })}
                </h1>
            </header>

            <div className="section">
                <div className="section__wrapper">
                    <main className="content">
                        <hr />

                        {children}
                    </main>

                    <aside className="sidebar">
                        <Observer>
                            {() => (
                                <CreateRelayerSummary
                                    tonTokenSymbol={tonTokenSymbol}
                                    tonTokenDecimals={tonTokenDecimals}
                                    contractFee={relayInitialTonDeposit}
                                    stakingBalance={stakingBalance}
                                    stakingTokenDecimals={stakingTokenDecimals}
                                    stakingTokenSymbol={stakingTokenSymbol}
                                    tonPublicKey={relayTonPubkey}
                                    ethAddress={relayEthAddress}
                                />
                            )}
                        </Observer>
                    </aside>
                </div>
            </div>
        </div>
    )
}
