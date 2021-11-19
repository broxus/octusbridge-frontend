import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { ConnectWallet } from '@/modules/TonWalletConnector/components/ConnectWallet'
import { WalletInstaller } from '@/modules/TonWalletConnector/WalletInstaller'
import { useTonWallet } from '@/stores/TonWalletService'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
    message?: string;
}

export const WalletConnector = observer(({
    children,
    message,
}: Props): JSX.Element => {
    const wallet = useTonWallet()

    const onClickConnect = () => {
        wallet.connect()
    }

    return (
        <WalletInstaller>
            {wallet.isConnecting ? (
                <ContentLoader />
            ) : (
                <>
                    {!wallet.isConnected ? (
                        <ConnectWallet
                            onClickConnect={onClickConnect}
                            message={message}
                        />
                    ) : (
                        children
                    )}
                </>
            )}
        </WalletInstaller>
    )
})
