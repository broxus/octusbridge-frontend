import * as React from 'react'

import { Logo } from '@/components/layout/Logo'
import { Nav } from '@/components/layout/Nav'

import './index.scss'

export function Header(): JSX.Element {
    return (
        <header className="header">
            <a href="https://octusbridge.io" className="logo">
                <Logo />
            </a>
            <Nav />
        </header>
    )
}
