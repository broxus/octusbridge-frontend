import * as React from 'react'

import { UserAvatar } from '@/components/common/UserAvatar'
import { sliceAddress } from '@/utils'

import './index.scss'

type Props = {
    name?: string;
    address: string;
}

export function UserCard({
    name,
    address,
}: Props): JSX.Element {
    return (
        <div className="user-card">
            <UserAvatar
                size="small"
                address={address}
            />

            {name ? (
                <div>
                    <div className="user-card__name">{name}</div>
                    <div className="user-card__address">{sliceAddress(address)}</div>
                </div>
            ) : (
                sliceAddress(address)
            )}
        </div>
    )
}
