import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { TokensUpgradeModal } from '@/components/common/TokensUpgradeModal'
import { WalletConnectingModal } from '@/components/common/WalletConnectingModal'
import { WalletUpdateModal } from '@/components/common/WalletUpdateModal'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { LocalizationContext } from '@/context/Localization'
import { BridgeTransferSummeryProvider } from '@/modules/Bridge'
import Bridge from '@/pages/bridge'
import LiquidityRequests from '@/pages/bridge/liquidity-requests'
import LiquidityDeposit from '@/pages/bridge/liquidity-requests/item'
import Relayer from '@/pages/relayers/item'
import RelayersStatus from '@/pages/relayers/create'
import RelayersKeys from '@/pages/relayers/create/keys'
import Overview from '@/pages/governance'
import Proposals from '@/pages/governance/proposals'
import Proposal from '@/pages/governance/proposals/item'
import ProposalCreate from '@/pages/governance/proposals/create'
import RelayersBiddingRound from '@/pages/relayers/bidding-round'
import RelayersEvent from '@/pages/relayers/events/item'
import Relayers from '@/pages/relayers/index'
import RelayersValidationRound from '@/pages/relayers/validation-round'
import StakingExplorer from '@/pages/staking/explorer'
import StakingUser from '@/pages/staking/explorer/user'
import StakingSelf from '@/pages/staking/my'
import TransferStatus from '@/pages/transfer'
import TransferList from '@/pages/transfers'
import { useEverWallet } from '@/stores/EverWalletService'
import { useUpgradeTokens } from '@/stores/UpgradeTokens'
import { noop } from '@/utils'

import './App.scss'

export function App(): JSX.Element {
    const everWallet = useEverWallet()
    const upgradeTokens = useUpgradeTokens()
    const localization = React.useContext(LocalizationContext)

    return (
        <IntlProvider
            key="intl"
            defaultLocale="en"
            locale={localization.locale}
            messages={localization.messages}
            onError={noop}
        >
            <Router>
                <ScrollManager>
                    <div className="wrapper">
                        <Header key="header" />
                        <div className="main">
                            <Switch>
                                <Route exact path="/">
                                    <Redirect exact to="/bridge" />
                                </Route>
                                <Route exact path="/transfers">
                                    <TransferList />
                                </Route>

                                <Route exact path="/staking">
                                    <StakingExplorer />
                                </Route>
                                <Route exact path="/staking/explorer/:userAddress(0:[A-Fa-f0-9]{64})">
                                    <StakingUser />
                                </Route>
                                <Route exact path="/staking/my">
                                    <StakingSelf />
                                </Route>

                                <Route exact path="/relayers/create">
                                    <RelayersStatus />
                                </Route>
                                <Route exact path="/relayers/create/keys">
                                    <RelayersKeys />
                                </Route>
                                <Route exact path="/relayers">
                                    <Relayers />
                                </Route>
                                <Route exact path="/relayers/round/:num">
                                    <RelayersValidationRound />
                                </Route>
                                <Route exact path="/relayers/bidding/:num">
                                    <RelayersBiddingRound />
                                </Route>
                                <Route exact path="/relayers/:address">
                                    <Relayer />
                                </Route>
                                <Route exact path="/relayers/event/:contractAddress">
                                    <RelayersEvent />
                                </Route>

                                <Route exact path="/governance">
                                    <Overview />
                                </Route>
                                <Route exact path="/governance/proposals">
                                    <Proposals />
                                </Route>
                                <Route exact path="/governance/proposals/create">
                                    <ProposalCreate />
                                </Route>
                                <Route exact path="/governance/proposals/:id([0-9]+)?">
                                    <Proposal />
                                </Route>

                                <BridgeTransferSummeryProvider>
                                    <Route path="/transfer/:fromType(evm)-:fromId/:toType(tvm|evm)-:toId/:txHash(0x[A-Fa-f0-9]{64})">
                                        <TransferStatus />
                                    </Route>
                                    <Route path="/transfer/:fromType(tvm)-:fromId/:toType(evm|solana)-:toId/:contractAddress(0:[A-Fa-f0-9]{64})">
                                        <TransferStatus />
                                    </Route>
                                    <Route path="/transfer/:fromType(solana)-:fromId/:toType(tvm)-:toId/:txSignature([A-HJ-NP-Za-km-z1-9]*)">
                                        <TransferStatus />
                                    </Route>
                                    <Route exact path="/bridge">
                                        <Bridge />
                                    </Route>
                                    <Route exact path="/bridge/liquidity-requests">
                                        <LiquidityRequests />
                                    </Route>
                                    <Route path="/bridge/liquidity-requests/:chainId/:evmTokenAddress">
                                        <LiquidityDeposit />
                                    </Route>
                                </BridgeTransferSummeryProvider>
                            </Switch>
                        </div>
                        <Footer key="footer" />
                    </div>
                </ScrollManager>
                <WalletConnectingModal />
                <Observer>
                    {() => (
                        <>
                            {(everWallet.isInitialized && everWallet.isOutdated) ? (
                                <WalletUpdateModal />
                            ) : null}

                            {upgradeTokens.hasTokensToUpgrade ? (
                                <TokensUpgradeModal />
                            ) : null}
                        </>
                    )}
                </Observer>
            </Router>
        </IntlProvider>
    )
}
