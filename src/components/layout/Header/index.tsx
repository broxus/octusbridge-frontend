import * as React from 'react'
import Media from 'react-media'
import { Link } from 'react-router-dom'

import { Navbar } from '@/components/common/Navbar'
import { Logo } from '@/components/layout/Logo'
import { DesktopNav } from '@/components/layout/DesktopNav'
import { HeaderDrawer } from '@/components/layout/Header/HeaderDrawer'
import { LangSwitcher } from '@/components/layout/LangSwitcher'
import { Wallets } from '@/components/layout/Wallets'

import './index.scss'

export function Header(): JSX.Element {
    return (
        <header className="header">
            <Navbar className="width-expand">
                <Media query={{ minWidth: 768 }}>
                    {match => match && (
                        <>
                            <Navbar.Item>
                                <Link to="/" className="logo">
                                    <Logo />
                                </Link>
                            </Navbar.Item>
                            <DesktopNav />
                            <Navbar.Right className="header-switchers" component={Navbar.Item}>
                                <LangSwitcher />
                                <Wallets />
                            </Navbar.Right>
                        </>
                    )}
                </Media>

                <Media query={{ maxWidth: 767 }}>
                    {match => match && (
                        <>
                            <Navbar.Item>
                                <Link to="/" className="logo">
                                    <Logo ratio={0.9} />
                                </Link>
                            </Navbar.Item>
                            <Navbar.Item
                                style={{
                                    justifyContent: 'space-between',
                                    paddingRight: 0,
                                    width: '100%',
                                }}
                            >
                                <Wallets />
                                <Navbar.Toggle icon>
                                    <HeaderDrawer />
                                </Navbar.Toggle>
                            </Navbar.Item>
                        </>
                    )}
                </Media>
            </Navbar>
        </header>
    )
}
