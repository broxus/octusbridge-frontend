import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { NativeScrollArea } from '@/components/common/NativeScrollArea'
import { TokensUpgradeModal } from '@/components/common/TokensUpgradeModal'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import messages from '@/lang/en'
import { EverWallet, EvmWallet } from '@/modules/Accounts'
// import Airdrop from '@/pages/airdrop'
import Bridge from '@/pages/bridge'
import TransferStatus from '@/pages/transfer'
import TransferList from '@/pages/transfer/list'
import StakingSelf from '@/pages/staking/my'
import StakingUser from '@/pages/staking/explorer/user'
import StakingExplorer from '@/pages/staking/explorer'
import RelayersStatus from '@/pages/relayers/create'
import RelayersKeys from '@/pages/relayers/create/keys'
import Overview from '@/pages/governance'
import Proposals from '@/pages/governance/proposals'
import Proposal from '@/pages/governance/proposals/item'
import ProposalCreate from '@/pages/governance/proposals/create'
import { useEverWallet } from '@/stores/EverWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useUpgradeTokens } from '@/stores/UpgradeTokens'
import { noop } from '@/utils'

import './App.scss'


export function App(): JSX.Element {
    const evmWallet = useEvmWallet()
    const tonWallet = useEverWallet()
    const upgradeTokens = useUpgradeTokens()

    return (
        <IntlProvider
            key="intl"
            defaultLocale="en"
            locale="en"
            messages={messages}
            onError={noop}
        >
            <Router>
                <div className="wrapper">
                    <Header key="header" />
                    <div className="main">
                        <Switch>
                            <Route exact path="/">
                                <Redirect exact to="/bridge" />
                            </Route>
                            {/*
                            <Route exact path="/transfers">
                                <TransferList />
                            </Route>
                            */}
                            <Route path="/transfers">
                                <TransferList />
                            </Route>
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:txHash(0x[A-Fa-f0-9]{64})/:depositType?">
                                <TransferStatus />
                            </Route>
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:contractAddress(0:[A-Fa-f0-9]{64})">
                                <TransferStatus />
                            </Route>
                            <Route path="/bridge">
                                <Bridge />
                            </Route>
                            {/*
                            <Route exact path="/airdrop">
                                <Airdrop />
                            </Route>
                            */}
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
                            <Route exact path="/governance">
                                <Overview />
                            </Route>
                            <Route exact path="/governance/proposals">
                                <Proposals />
                            </Route>
                            <Route exact path="/governance/proposals/create">
                                <ProposalCreate />
                            </Route>
                            <Route exact path="/governance/proposals/:id">
                                <Proposal />
                            </Route>
                        </Switch>
                    </div>
                    <Footer key="footer" />
                </div>
                <Observer>
                    {() => (
                        <>
                            {(evmWallet.hasProvider || tonWallet.hasProvider) && (
                                <NativeScrollArea className="wallets-scroll-area">
                                    <div className="wallets">
                                        <EvmWallet />
                                        <EverWallet />
                                    </div>
                                </NativeScrollArea>
                            )}

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
