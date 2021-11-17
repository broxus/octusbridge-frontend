import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { reaction } from 'mobx'

import { TonToEvmTransfer } from '@/modules/Bridge/stores/TonToEvmTransfer'
import { useSummary } from '@/modules/Bridge/stores/TransferSummary'
import { TonTransferQueryParams } from '@/modules/Bridge/types'
import { EvmWalletService, useEvmWallet } from '@/stores/EvmWalletService'
import { TonWalletService, useTonWallet } from '@/stores/TonWalletService'
import { TokensCacheService, useTokensCache } from '@/stores/TokensCacheService'
import { isTonAddressValid } from '@/utils/is-ton-address-valid'


export const TonTransferContext = React.createContext<TonToEvmTransfer>(
    new TonToEvmTransfer(
        useTonWallet(),
        useEvmWallet(),
        useTokensCache(),
    ),
)

export function useTonTransfer(): TonToEvmTransfer {
    return React.useContext(TonTransferContext)
}

type Props = {
    children: React.ReactNode;
    evmWallet: EvmWalletService,
    tonWallet: TonWalletService,
    tokensCache: TokensCacheService,
}

export function TonTransferStoreProvider({ children, ...props }: Props): JSX.Element {
    const params = useParams<TonTransferQueryParams>()

    if (!isTonAddressValid(params.contractAddress)) {
        return <Redirect to="/bridge" />
    }

    const transfer = React.useMemo(() => new TonToEvmTransfer(
        props.tonWallet,
        props.evmWallet,
        props.tokensCache,
        params,
    ), [params])

    React.useEffect(() => {
        (async () => {
            try {
                await transfer.init()
            }
            catch (e) {}
        })()
        return () => transfer.dispose()
    }, [params])

    React.useEffect(() => {
        const summary = useSummary()
        const summaryDisposer = reaction(
            () => ({
                amount: transfer.amountNumber.toFixed(),
                decimals: transfer.token?.decimals,
                leftAddress: transfer.leftAddress,
                leftNetwork: transfer.leftNetwork,
                rightAddress: transfer.rightAddress,
                rightNetwork: transfer.rightNetwork,
                token: transfer.token,
            }),
            data => {
                summary.update(data)
            },
        )
        return () => {
            summaryDisposer()
        }
    }, [])

    return (
        <TonTransferContext.Provider value={transfer}>
            {children}
        </TonTransferContext.Provider>
    )
}
