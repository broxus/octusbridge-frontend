import * as React from 'react'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import messages from '@/lang/en'
import { EvmWallet, TonWallet } from '@/modules/Accounts'
import Bridge from '@/pages/bridge'
import EvmTransferStatus from '@/pages/bridge/evm-transfer-status'
import TonTransferStatus from '@/pages/bridge/ton-transfer-status'
import StakingAccount from '@/pages/staking/account'
import { noop } from '@/utils'

import './App.scss'


export function App(): JSX.Element {
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
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:txHash(0x[A-Da-f0-9]{64})">
                                <EvmTransferStatus />
                            </Route>
                            <Route path="/transfer/:fromType-:fromId/:toType-:toId/:contractAddress(0:[A-Da-f0-9]{64})">
                                <TonTransferStatus />
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
                        </Switch>
                    </div>
                    <Footer key="footer" />
                </div>
                <div className="wallets">
                    <EvmWallet />
                    <TonWallet />
                </div>
            </Router>
        </IntlProvider>
    )
}
