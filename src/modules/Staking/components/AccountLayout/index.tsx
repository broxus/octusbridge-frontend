import * as React from 'react'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { STAKING_LOCATION, STAKING_REDEEM_LOCATION } from '@/modules/Staking/constants'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNode[];
}

export function AccountLayout({
    children,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="container container--large">
            <div className="card staking-account">
                <h1 className="staking-account__title">
                    {intl.formatMessage({
                        id: 'STAKING_ACCOUNT_FORM_TITLE',
                    })}
                </h1>

                <div className="staking-account__tabs">
                    <NavLink exact to={STAKING_LOCATION}>
                        {intl.formatMessage({
                            id: 'STAKING_ACCOUNT_FORM_TAB_STAKE',
                        })}
                    </NavLink>

                    <NavLink exact to={STAKING_REDEEM_LOCATION}>
                        {intl.formatMessage({
                            id: 'STAKING_ACCOUNT_FORM_TAB_REDEEM',
                        })}
                    </NavLink>
                </div>

                {children}
            </div>
        </div>
    )
}
