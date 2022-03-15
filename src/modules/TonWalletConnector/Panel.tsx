import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { InstallWallet } from '@/modules/TonWalletConnector/components/InstallWallet'
import { ConnectWallet } from '@/modules/TonWalletConnector/components/ConnectWallet'
import { Panel, PanelProps } from '@/modules/TonWalletConnector/components/Panel'
import { useDebounce } from '@/hooks'
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

    if (!wallet.hasProvider) {
        return (
            <Panel size={size}>
                <InstallWallet />
            </Panel>
        )
    }

    if (wallet.isConnecting || !wallet.isConnected) {
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
