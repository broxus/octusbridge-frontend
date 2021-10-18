import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { Logo } from '@/components/layout/Logo'
import { useTonWallet } from '@/stores/TonWalletService'

import './index.scss'


export function Footer(): JSX.Element {
    const tonWallet = useTonWallet()

    return (
        <footer className="footer">
            <div className="container container--large">
                <div className="footer__top">
                    <Link to="/" className="footer-logo">
                        <Logo />
                    </Link>
                    <Observer>
                        {() => (
                            <div className="toolbar">
                                {/*
                                <a
                                    href="#"
                                    className="btn btn--xl btn--secondary footer-tool"
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                >
                                    Bridge app
                                </a>
                                */}
                                {(!tonWallet.isInitialized && !tonWallet.isInitializing) && (
                                    <a
                                        href="https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk"
                                        className="btn btn--xl btn--empty footer-tool"
                                        target="_blank"
                                        rel="nofollow noopener noreferrer"
                                    >
                                        Install Crystal Wallet
                                    </a>
                                )}
                            </div>
                        )}
                    </Observer>
                </div>
                <nav className="footer-nav">
                    <div className="footer-nav__col">
                        <div className="footer-nav__col-title">Bridge</div>
                        <ul className="footer-nav__list">
                            <li><Link to="/bridge">ETH to TON</Link></li>
                            <li><Link to="/bridge">TON to ETH</Link></li>
                            <li><a>Search</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav__col">
                        <div className="footer-nav__col-title">Staking</div>
                        <ul className="footer-nav__list">
                            <li><a>Stake / Redeem</a></li>
                            <li><a>My stake</a></li>
                            <li><a>Staking explorer</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav__col">
                        <div className="footer-nav__col-title">Guides</div>
                        <ul className="footer-nav__list">
                            <li><a>Bridge</a></li>
                            <li><a>Staking</a></li>
                            <li><a>Governance</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav__col">
                        <div className="footer-nav__col-title">Governance</div>
                        <ul className="footer-nav__list">
                            <li><a>Overview</a></li>
                            <li><a>Proposals</a></li>
                            <li><a>Leaderboard</a></li>
                            <li><a>BRIDGE distribution</a></li>
                        </ul>
                    </div>
                    <div className="footer-nav__col">
                        <div className="footer-nav__col-title">DeFi Products</div>
                        <ul className="footer-nav__list">
                            <li>
                                <a href="https://tonswap.io" target="_blank" rel="nofollow noopener noreferrer">
                                    TON Swap
                                </a>
                            </li>
                            <li>
                                <a href="https://tonscan.io" target="_blank" rel="nofollow noopener noreferrer">
                                    TON Scan
                                </a>
                            </li>
                            <li>
                                <a href="https://wton.io" target="_blank" rel="nofollow noopener noreferrer">
                                    WTON
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk"
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                >
                                    Crystal Wallet
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="footer__bottom">
                    <ul className="footer-soc">
                        <li>
                            <a
                                href="https://t.me/tonbridge_official"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="Telegram"
                            >
                                <Icon icon="telegram" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/Broxus"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="Twitter"
                            >
                                <Icon icon="twitter" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/broxus"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="GitHub"
                            >
                                <Icon icon="github" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://broxus.medium.com/"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="Medium"
                            >
                                <Icon icon="medium" />
                            </a>
                        </li>
                    </ul>
                    <div className="footer__sub">
                        <nav className="footer-subnav">
                            <ul>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/terms_of_use.pdf"
                                        target="_blank"
                                        rel="nofollow noopener noreferrer"
                                    >
                                        Terms of use
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/privacy_policy.pdf"
                                        target="_blank"
                                        rel="nofollow noopener noreferrer"
                                    >
                                        Privacy policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/cookie_policy.pdf"
                                        target="_blank"
                                        rel="nofollow noopener noreferrer"
                                    >
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <p className="footer-copyright">
                            &copy; Broxus,
                            {' '}
                            {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
