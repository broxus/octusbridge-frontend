import * as React from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'

import './index.scss'

const STATUS_MAP = {
    yes: 'RELAYERS_STATUS_YES',
    no: 'RELAYERS_STATUS_NO',
    active: 'RELAYERS_STATUS_ACTIVE',
    skip: 'RELAYERS_STATUS_SKIP',
}

type Props = {
    state: 'success' | 'fail';
    status: 'yes' | 'no' | 'active' | 'skip';
}

export function Status({
    state,
    status,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div
            className={classNames('relayers-status', {
                [`relayers-status_${state}`]: Boolean(state),
            })}
        >
            {intl.formatMessage({
                id: STATUS_MAP[status],
            })}
        </div>
    )
}
