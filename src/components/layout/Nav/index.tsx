import * as React from 'react'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'


export function Nav(): JSX.Element {
    const intl = useIntl()

    return (
        <nav className="main-nav">
            <ul>
                <li>
                    <NavLink to="/bridge">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_BRIDGE',
                        })}

                        <Icon icon="arrowDown" className="main-nav__arrow" />
                    </NavLink>

                    <div className="main-nav__sub">
                        <ul>
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
                                <NavLink to="/staking/explorer" exact>
                                    {intl.formatMessage({
                                        id: 'NAV_LINK_TEXT_MY_STAKING_EXPLORER',
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
                    <span>
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_GOVERNANCE',
                        })}
                        {' '}
                        <sup>
                            {intl.formatMessage({
                                id: 'NAV_LINK_SOON_HINT',
                            })}
                        </sup>
                    </span>
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
