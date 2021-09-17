import * as React from 'react'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

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
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/staking"
                    >
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_STAKING',
                        })}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/governance">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_GOVERNANCE',
                        })}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/relayers">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_RELAYERS',
                        })}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
