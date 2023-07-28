import classNames from 'classnames'
import * as React from 'react'

import { type TransferStatus } from '@/modules/Transfers/types'

import './index.scss'

type Props = {
    status?: TransferStatus;
}

export function Status({
    status,
}: Props): JSX.Element {
    return (
        <span
            className={classNames('transfers-table-status', {
                pending: status === 'Pending',
                rejected: status === 'Rejected',
                success: status === 'Confirmed',
            })}
        />
    )
}
