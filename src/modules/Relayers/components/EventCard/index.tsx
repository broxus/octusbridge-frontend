import * as React from 'react'

import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'
import { Badge } from '@/components/common/Badge'
import { UserAvatar } from '@/components/common/UserAvatar'

import './index.scss'

export function EventCard(): JSX.Element {
    return (
        <div className="event-card">
            <UserAvatar
                address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
            />

            <div>
                <h3 className="event-card__title">Token transfer EVER-ETH</h3>

                <div className="event-card__meta">
                    <TransactionExplorerLink
                        id="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                    />

                    <Badge status="success">Active</Badge>
                </div>
            </div>
        </div>
    )
}
