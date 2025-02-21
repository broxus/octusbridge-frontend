import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button, type ButtonProps } from '@/components/common/Button'
import { useMounted } from '@/hooks'
import { useEverWallet } from '@/stores/EverWalletService'

type Props = {
    block?: boolean;
    size?: ButtonProps['size'];
    children: React.ReactNode | React.ReactNodeArray;
}

export const TonButtonConnector = observer(({
    block = true,
    size,
    children,
}: Props): JSX.Element | null => {
    const intl = useIntl()
    const wallet = useEverWallet()
    const mounted = useMounted()

    if (!mounted) {
        return null
    }

    const connect = () => {
        wallet.connect()
    }

    if (wallet.isInitializing) {
        return null
    }

    if (!wallet.isConnected) {
        return (
            <Button
                block={block}
                size={size}
                type="secondary"
                onClick={connect}
                disabled={wallet.isConnecting}
            >
                {intl.formatMessage({ id: 'EVER_WALLET_CONNECT_BTN_TEXT' })}
            </Button>
        )
    }

    return (
        <>
            {children}
        </>
    )
})
