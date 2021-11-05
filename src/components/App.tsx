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
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import messages from '@/lang/en'
import { EvmWallet, TonWallet } from '@/modules/Accounts'
import Bridge from '@/pages/bridge'
import TransferStatus from '@/pages/transfer'
import StakingAccount from '@/pages/staking/account'
import RelayersStatus from '@/pages/relayers/create'
import RelayersKeys from '@/pages/relayers/create/keys'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { noop } from '@/utils'

import './App.scss'


export function App(): JSX.Element {
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

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
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:txHash(0x[A-Da-f0-9]{64})/credit">
                                <TransferStatus direction="evm-ton" depositType="credit" />
                            </Route>
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:txHash(0x[A-Da-f0-9]{64})/:depositType?">
                                <TransferStatus direction="evm-ton" depositType="default" />
                            </Route>
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:contractAddress(0:[A-Da-f0-9]{64})">
                                <TransferStatus direction="ton-evm" />
                            </Route>
                            <Route path="/bridge">
                                <Bridge />
                            </Route>
                            <Route exact path="/staking">
                                <StakingAccount />
                            </Route>
                            <Route exact path="/staking/redeem">
                                <StakingAccount />
                            </Route>
                            <Route exact path="/relayers/create">
                                <RelayersStatus />
                            </Route>
                            <Route exact path="/relayers/create/keys">
                                <RelayersKeys />
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
                                        <TonWallet />
                                    </div>
                                </NativeScrollArea>
                            )}
                        </>
                    )}
                </Observer>
            </Router>
        </IntlProvider>
    )
}
