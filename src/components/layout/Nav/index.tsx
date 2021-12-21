import * as React from 'react'
import { useIntl } from 'react-intl'
import { NavLink, useLocation } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'


export function Nav(): JSX.Element {
    const intl = useIntl()
    const location = useLocation()
    const splitLocation = location.pathname.split('/')

    return (
        <nav className="main-nav">
            <ul>
                <li>
                    <NavLink
                        to="/bridge"
                        isActive={() => splitLocation[1] === 'bridge' || splitLocation[1] === 'transfers'}
                    >
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_BRIDGE',
                        })}

                        <Icon icon="arrowDown" className="main-nav__arrow" />
                    </NavLink>

                    <div className="main-nav__sub">
                        <ul>
                            <li>
                                <NavLink to="/bridge">
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_CREATE_TRANSFER',
                                    })}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/transfers/my">
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_MY_TRANSFERS',
                                    })}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <NavLink to="/staking">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_STAKING',
                        })}

                        <Icon icon="arrowDown" className="main-nav__arrow" />
                    </NavLink>

                    <div className="main-nav__sub">
                        <ul>
                            <li>
                                <NavLink to="/staking" exact>
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_STAKING_ACCOUNT',
                                    })}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/staking/explorer" exact>
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_STAKING_EXPLORER',
                                    })}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/staking/explorer/my">
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_MY_STAKING_MY',
                                    })}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <span
                        className={splitLocation[1] === 'governance' ? 'active' : undefined}
                    >
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_GOVERNANCE',
                        })}
                        <Icon icon="arrowDown" className="main-nav__arrow" />
                    </span>

                    <div className="main-nav__sub">
                        <ul>
                            <li>
                                <NavLink to="/governance/proposals" exact>
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_PROPOSALS',
                                    })}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/governance/proposals/create" exact>
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_PROPOSALS_CREATE',
                                    })}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <NavLink to="/relayers/create">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_RELAYERS',
                        })}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
