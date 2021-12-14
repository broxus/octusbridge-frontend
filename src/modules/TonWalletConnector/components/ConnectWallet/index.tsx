import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'

type Props = {
    onClickConnect: () => void;
    message?: string;
}

export function ConnectWallet({
    onClickConnect,
    message,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--small card--flat connect-install">
            {message && (
                <div className="connect-install-text">
                    <p>{message}</p>
                </div>
            )}

            <Button
                type="secondary"
                size="md"
                onClick={onClickConnect}
            >
                {intl.formatMessage({ id: 'CRYSTAL_WALLET_CONNECT_BTN_TEXT' })}
            </Button>
        </div>
    )
}
