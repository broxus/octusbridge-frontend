import * as React from 'react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/layout/Logo'
import { Nav } from '@/components/layout/Nav'

import './index.scss'


export function Header(): JSX.Element {
    return (
        <header className="header">
            <Link to="/" className="logo">
                <Logo />
            </Link>
            <Nav />
        </header>
    )
}
