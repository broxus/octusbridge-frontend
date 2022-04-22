import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'

type Props = {
    disabled?: boolean;
    message?: string;
    onClickConnect: () => void;
}

export function ConnectWallet({
    disabled,
    message,
    onClickConnect,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <>
            {message && (
                <div className="connect-panel-text">
                    <p>{message}</p>
                </div>
            )}

            <Button
                size="md"
                type="secondary"
                disabled={disabled}
                onClick={onClickConnect}
            >
                {intl.formatMessage({ id: 'EVER_WALLET_CONNECT_BTN_TEXT' })}
            </Button>
        </>
    )
}
