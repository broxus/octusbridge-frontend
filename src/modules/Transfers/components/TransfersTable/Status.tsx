import * as React from 'react'
import classNames from 'classnames'

import { TransferStatus } from '@/modules/Transfers/types'

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
                success: status === 'Confirmed',
                pending: status === 'Pending',
                rejected: status === 'Rejected',
            })}
        />
    )
}
