import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { Logo } from '@/components/layout/Logo'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

/* eslint-disable jsx-a11y/anchor-is-valid */
export function Footer(): JSX.Element {
    const intl = useIntl()
    const tonWallet = useEverWallet()

    const toolbar = (
        <Observer>
            {() => (
                <div className="toolbar">
                    {!tonWallet.hasProvider && (
                        <a
                            href="https://l1.broxus.com/everscale/wallet"
                            className="btn btn--tertiary btn--md footer-tool"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {intl.formatMessage({
                                id: 'WALLET_INSTALLATION_LINK_TEXT',
                            })}
                        </a>
                    )}
                </div>
            )}
        </Observer>
    )

    return (
        <footer className="footer">
            <div className="container container--large">
                <div className="footer__wrapper">
                    <div className="footer__left">
                        <Link to="/" className="footer-logo">
                            <Logo />
                        </Link>
                        {toolbar}
                    </div>
                    <nav className="footer-nav">
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_PRODUCT',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <Link to="/bridge">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_NEW_TRANSFER_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/transfers">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_HISTORY_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_STAKING',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <Link to="/staking/my">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_MY_STAKE_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/staking">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_EXPLORER_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_GOVERNANCE',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <Link to="/governance">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_OVERVIEW_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/governance/proposals">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_PROPOSALS_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/governance/proposals/create">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_CREATE_PROPOSAL_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_RELAYERS',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <Link to="/relayers/create">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_CREATE_NEW_RELAYER_LINK_TEXT',
                                        })}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_DOCS',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <a
                                        href="https://github.com/broxus/octusbridge-relay"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_RELAYER_NODE_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/NilFoundation/everscale.nil.foundation/raw/master/report.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_SECURITY_AUDIT_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/broxus"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_GITHUB_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/broxus/octusbridge-contracts"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_BRIDGE_CONTRACTS_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/broxus/ton-eth-bridge-token-contracts"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_TOKEN_CONTRACTS_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_OUR_PRODUCTS',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <a href="https://flatqube.io" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_FLATQUBE_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://everscan.io" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_EVER_SCAN_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://wrappedever.io" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_WEVER_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://l1.broxus.com/everscale/wallet"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_EVER_WALLET_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://everpools.io" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_EVER_POOLS_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-nav__col">
                            <div className="footer-nav__col-title">
                                {intl.formatMessage({
                                    id: 'FOOTER_NAV_HEADER_FAQ',
                                })}
                            </div>
                            <ul className="footer-nav__list">
                                <li>
                                    <a href="https://docs.octusbridge.io/" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_GITBOOK_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://docs.everwallet.net/" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_EVER_WALLET_MANUAL_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://docs.everwallet.net/concepts/ever-and-wever" target="_blank" rel="noopener noreferrer">
                                        {intl.formatMessage({
                                            id: 'FOOTER_NAV_WHAT_IS_WEVER_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="footer__right">
                        {toolbar}
                    </div>
                </div>
                <div className="footer__bottom">
                    <ul className="footer-soc">
                        <li>
                            <a
                                href="https://discord.gg/6dryaZQNmC"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Discord"
                            >
                                <Icon icon="discord" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://t.me/OctusBridge"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Telegram"
                            >
                                <Icon icon="telegram" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://twitter.com/OctusBridge"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Twitter"
                            >
                                <Icon icon="twitter" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://octusbridge.medium.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Medium"
                            >
                                <Icon icon="medium" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/broxus"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub"
                            >
                                <Icon icon="github" />
                            </a>
                        </li>
                    </ul>
                    <div className="footer__sub">
                        <p
                            className="footer-copyright"
                            dangerouslySetInnerHTML={{
                                __html: intl.formatMessage({
                                    id: 'FOOTER_COPYRIGHTS',
                                }, {
                                    year: new Date().getFullYear(),
                                }, {
                                    ignoreTag: true,
                                }),
                            }}
                        />
                        <nav className="footer-subnav">
                            <ul>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/terms_of_use.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_TERMS_OF_USE_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/privacy_policy.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_PRIVACY_POLICY_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://broxus.com/wp-content/uploads/2021/08/cookie_policy.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {intl.formatMessage({
                                            id: 'FOOTER_COOKIES_TERMS_LINK_TEXT',
                                        })}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    )
}
