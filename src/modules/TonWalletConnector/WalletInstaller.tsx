import * as React from 'react'
import { observer } from 'mobx-react-lite'

import { ConnectInstall } from '@/modules/TonWalletConnector/components/ConnectInstall'
import { ContentLoader } from '@/components/common/ContentLoader'
import { useTonWallet } from '@/stores/TonWalletService'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

export const WalletInstaller = observer(({
    children,
}: Props): JSX.Element => {
    const wallet = useTonWallet()

    return (
        <>
            {wallet.isInitializing ? (
                <ContentLoader />
            ) : (
                <>
                    {!wallet.hasProvider ? (
                        <ConnectInstall />
                    ) : (
                        children
                    )}
                </>
            )}
        </>
    )
})
