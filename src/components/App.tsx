import * as React from 'react'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { CrystalWallet, Web3Wallet } from '@/modules/Accounts'
import messages from '@/lang/en'
import { noop } from '@/utils'

import './App.scss'


export function App(): JSX.Element {
    return (
        <IntlProvider
            key="intl"
            locale="en"
            defaultLocale="en"
            messages={messages}
            onError={noop}
        >
            <Router>
                <div className="wrapper">
                    <Header key="header" />
                    <main className="main">
                        <Switch>
                            <Route exact path="/">
                                <Redirect exact to="/bridge" />
                            </Route>
                        </Switch>
                    </main>
                    <div className="wallets">
                        <Web3Wallet />
                        <CrystalWallet />
                    </div>
                </div>
            </Router>
        </IntlProvider>
    )
}
