import * as React from 'react'
import { useIntl } from 'react-intl'

import { TonButtonConnector } from '@/modules/TonWalletConnector/Button'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
}

export function Layout({
    children,
}: Props): JSX.Element | null {
    const intl = useIntl()

    return (
        <div className="proposal-management">
            <h3 className="proposal-management__title">
                {intl.formatMessage({
                    id: 'PROPOSAL_MANAGEMENT_TITLE',
                })}
            </h3>

            <TonButtonConnector size="md">
                {children}
            </TonButtonConnector>
        </div>
    )
}
