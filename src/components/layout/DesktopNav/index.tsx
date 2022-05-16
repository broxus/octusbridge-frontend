import * as React from 'react'
import { useIntl } from 'react-intl'
import { NavLink, useLocation } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { Nav } from '@/components/common/Nav'
import { Navbar } from '@/components/common/Navbar'
import type { NavClickEventHandler } from '@/components/common/Nav/types'

import './index.scss'


export function DesktopNav(): JSX.Element {
    const intl = useIntl()
    const location = useLocation()

    const [selectedKey, selectActiveKey] = React.useState<string | undefined>(
        () => location.pathname.split('/')[1],
    )

    const expandIcon = React.useMemo(() => <Icon icon="arrowDown" className="nav__arrow" />, [])

    const selectKey: NavClickEventHandler = e => {
        selectActiveKey(e?.key)
    }

    return (
        <Navbar.Nav
            className="desktop-nav flex-wrap width-expand"
            selectedKeys={selectedKey ? [selectedKey] : undefined}
            onClick={selectKey}
        >
            <Nav.Sub
                expandIcon={expandIcon}
                title={intl.formatMessage({
                    id: 'NAV_LINK_TEXT_BRIDGE',
                })}
                key="bridge"
            >
                <Nav.Item key="bridge-create">
                    <NavLink exact to="/bridge">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_NEW_TRANSFER',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="liquidity-requests">
                    <NavLink exact to="/bridge/liquidity-requests">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_LIQUIDITY_REQUESTS',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="bridge-history">
                    <NavLink exact to="/transfers">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_HISTORY',
                        })}
                    </NavLink>
                </Nav.Item>
            </Nav.Sub>
            <Nav.Sub
                expandIcon={expandIcon}
                title={intl.formatMessage({
                    id: 'NAV_LINK_TEXT_STAKING',
                })}
                key="staking"
            >
                <Nav.Item key="staking-my">
                    <NavLink exact to="/staking/my">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_MY_STAKING_MY',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="staking-overview">
                    <NavLink exact to="/staking">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_STAKING_EXPLORER',
                        })}
                    </NavLink>
                </Nav.Item>
            </Nav.Sub>
            <Nav.Sub
                expandIcon={expandIcon}
                title={intl.formatMessage({
                    id: 'NAV_LINK_TEXT_GOVERNANCE',
                })}
                key="governance"
            >
                <Nav.Item key="governance-overview">
                    <NavLink exact to="/governance">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_GOVERNANCE_OVERVIEW',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="governance-proposals">
                    <NavLink exact to="/governance/proposals">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_PROPOSALS',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="governance-proposals-create">
                    <NavLink exact to="/governance/proposals/create">
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_PROPOSALS_CREATE',
                        })}
                    </NavLink>
                </Nav.Item>
            </Nav.Sub>
            <Nav.Sub
                expandIcon={expandIcon}
                title={intl.formatMessage({
                    id: 'NAV_LINK_TEXT_RELAYERS',
                })}
                key="relayers"
            >
                <Nav.Item key="relayers-create">
                    <NavLink
                        to="/relayers/create"
                    >
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_RELAYERS_CREATE',
                        })}
                    </NavLink>
                </Nav.Item>
                <Nav.Item key="relayers-explorer">
                    <NavLink
                        to="/relayers"
                        isActive={(_, location) => (
                            !location.pathname.startsWith('/relayers/create')
                            && location.pathname.startsWith('/relayers')
                        )}
                    >
                        {intl.formatMessage({
                            id: 'NAV_LINK_TEXT_RELAYERS_EXPLORER',
                        })}
                    </NavLink>
                </Nav.Item>
            </Nav.Sub>
            {/*
            <Nav.Item key="airdrop">
                <NavLink exact to="/airdrop">
                    {intl.formatMessage({
                        id: 'NAV_LINK_TEXT_AIRDROP',
                    })}
                </NavLink>
            </Nav.Item>
            */}
        </Navbar.Nav>
    )
}
