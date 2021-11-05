import * as React from 'react'
import classNames from 'classnames'

import { UserAvatar } from '@/components/common/UserAvatar'
import { isTonAddressValid } from '@/utils'

import './index.scss'


export type TokenIconProps = {
    address?: string;
    name?: string;
    className?: string;
    size?: 'small' | 'xsmall';
    uri?: string;
}


export function TokenIcon({
    address,
    className,
    name,
    size,
    uri,
}: TokenIconProps): JSX.Element | null {
    if (uri) {
        return (
            <img
                alt={name}
                className={classNames('token-icon', {
                    [`token-icon__size-${size}`]: Boolean(size),
                }, className)}
                src={uri}
            />
        )
    }

    return (address && isTonAddressValid(address)) ? (
        <UserAvatar address={address} size={size} />
    ) : null
}
