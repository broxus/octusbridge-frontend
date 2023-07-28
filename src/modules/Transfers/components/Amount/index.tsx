import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { TokenAmount } from '@/components/common/TokenAmount'
import { BridgeUtils, TokenWallet } from '@/misc'
import { type Transfer } from '@/modules/Transfers/types'
import {
    getAmount,
    getCurrencyAddress,
    getFromNetwork,
    getTransitNetwork,
} from '@/modules/Transfers/utils'
import { type BridgeAsset, useBridgeAssets } from '@/stores/BridgeAssetsService'
import { resolveEverscaleAddress } from '@/utils'

type Props = {
    transfer: Transfer
}

export function AmountInner({ transfer }: Props): JSX.Element {
    const intl = useIntl()
    const bridgeAssets = useBridgeAssets()

    const [symbol, setSymbol] = React.useState<string>()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const amount = getAmount(transfer)
    const fromNetwork = getFromNetwork(transfer)
    const targetNetwork = getTransitNetwork(transfer)
    const currencyAddress = getCurrencyAddress(transfer)

    let asset: BridgeAsset | undefined

    if (fromNetwork?.type === 'evm') {
        asset = bridgeAssets.get(
                fromNetwork?.type ?? '',
                fromNetwork?.chainId ?? '',
                transfer.ethTonEthTokenAddress ?? transfer.tonEthEthTokenAddress ?? '',
            )
            ?? bridgeAssets.get(
                targetNetwork?.type ?? '',
                targetNetwork?.chainId ?? '',
                transfer.ethTonTonTokenAddress ?? transfer.tonEthTonTokenAddress ?? '',
            )
    }
    else if (fromNetwork?.type === 'tvm') {
        asset = bridgeAssets.get(
                fromNetwork?.type ?? '',
                fromNetwork?.chainId ?? '',
                transfer.tonEthTonTokenAddress ?? '',
            )
            ?? bridgeAssets.get(
                targetNetwork?.type ?? '',
                targetNetwork?.chainId ?? '',
                transfer.tonEthEthTokenAddress ?? '',
            )
    }

    React.useEffect(() => {
        if (asset === undefined) {
            if (
                [
                    'AlienEthToEth',
                    'AlienEthToTon',
                    'NativeEthToEth',
                    'NativeEthToTon',
                ].includes(transfer.transferKind)
                && fromNetwork?.type === 'evm'
            ) {
                if (transfer.ethTonEthTokenAddress) {
                    (async () => {
                        setSymbol(
                            await BridgeUtils.getEvmTokenSymbol(
                                transfer.ethTonEthTokenAddress as string,
                                fromNetwork.rpcUrl,
                            ),
                        )
                    })()
                }

                if (transfer.ethTonTonTokenAddress && symbol === undefined) {
                    (async () => {
                        setSymbol(
                            await TokenWallet.getSymbol(
                                resolveEverscaleAddress(transfer.ethTonTonTokenAddress as string),
                            ),
                        )
                    })()
                }
            }
            else if (['AlienTonToEth', 'NativeTonToEth'].includes(transfer.transferKind) && targetNetwork?.type === 'evm') {
                if (transfer.tonEthTonTokenAddress) {
                    (async () => {
                        setSymbol(
                            await TokenWallet.getSymbol(
                                resolveEverscaleAddress(transfer.tonEthTonTokenAddress as string),
                            ),
                        )
                    })()
                }

                if (transfer.tonEthEthTokenAddress && symbol === undefined) {
                    (async () => {
                        setSymbol(
                            await BridgeUtils.getEvmTokenSymbol(
                                transfer.tonEthEthTokenAddress as string,
                                targetNetwork?.rpcUrl,
                            ),
                        )
                    })()
                }
            }
        }
    }, [])

    console.log(transfer, asset)

    return currencyAddress && amount ? (
        <TokenAmount
            address={currencyAddress}
            uri={asset?.icon}
            symbol={asset?.symbol ?? symbol}
            amount={amount}
        />
    ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{noValue}</>
    )
}

export const Amount = observer(AmountInner)
