import * as React from 'react'
import { IntlProvider } from 'react-intl'
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import messages from '@/lang/en'
import { CrystalWallet, EvmWallet } from '@/modules/Accounts'
import Bridge from '@/pages/bridge'
import Status from '@/pages/bridge/status'
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
                    <div className="main">
                        <Switch>
                            <Route exact path="/">
                                <Redirect exact to="/bridge" />
                            </Route>
                            <Route path="/bridge/:fromType-:fromId/:toType-:toId/:txHash">
                                <Status />
                            </Route>
                            <Route path="/bridge">
                                <Bridge />
                            </Route>
                        </Switch>
                    </div>
                    <div className="wallets">
                        <EvmWallet />
                        <CrystalWallet />
                    </div>
                </div>
            </Router>
        </IntlProvider>
    )
}
