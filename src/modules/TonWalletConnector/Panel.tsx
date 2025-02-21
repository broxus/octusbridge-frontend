import { observer } from 'mobx-react-lite'
import * as React from 'react'

import { useDebounce } from '@/hooks'
import { ConnectWallet } from '@/modules/TonWalletConnector/components/ConnectWallet'
import { Panel, type PanelProps } from '@/modules/TonWalletConnector/components/Panel'
import { useEverWallet } from '@/stores/EverWalletService'

type Props = {
    size?: PanelProps['size'];
    message?: string;
    children: React.ReactNode | React.ReactNodeArray;
}

export const WalletConnector = observer(({
    size,
    message,
    children,
}: Props): JSX.Element | null => {
    const wallet = useEverWallet()
    const isInitializing = useDebounce(wallet.isInitializing, 100)

    const onClickConnect = () => {
        wallet.connect()
    }

    if (isInitializing) {
        return null
    }

    if (!wallet.isConnected) {
        return (
            <Panel size={size}>
                <ConnectWallet
                    message={message}
                    disabled={wallet.isConnecting}
                    onClickConnect={onClickConnect}
                />
            </Panel>
        )
    }

    return (
        <>
            {children}
        </>
    )
})
