import * as React from 'react'
import { useIntl } from 'react-intl'

import './index.scss'

type Props = {
    isLoading?: boolean;
    onConnect?: () => void;
}

export function CreateRelayerConnect({
    isLoading,
    onConnect,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--flat card--small create-relayer-connect">
            <p className="text-muted">
                {intl.formatMessage({
                    id: 'RELAYERS_CONNECT_TEXT',
                })}
            </p>

            <button
                type="button"
                className="btn btn-lg btn--primary"
                onClick={onConnect}
                disabled={isLoading}
            >
                {intl.formatMessage({
                    id: 'RELAYERS_CONNECT',
                })}
            </button>
        </div>
    )
}
