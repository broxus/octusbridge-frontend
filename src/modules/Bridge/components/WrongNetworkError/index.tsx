import * as React from 'react'
import { useIntl } from 'react-intl'

import { useEvmWallet } from '@/stores/EvmWalletService'
import { NetworkShape } from '@/bridge'


type Props = {
    network: NetworkShape;
}


export function WrongNetworkError({ network }: Props): JSX.Element {
    const intl = useIntl()
    const wallet = useEvmWallet()

    const onChangeNetwork = async () => {
        await wallet.changeNetwork?.(network!.chainId)
    }

    return (
        <div className="alert alert--danger">
            <span className="text-sm">
                {intl.formatMessage({
                    id: 'EVM_WALLET_WRONG_NETWORK_NOTE',
                }, {
                    networkName: network.name || '',
                })}
            </span>

            <button
                type="button"
                className="btn btn-s btn--empty"
                onClick={onChangeNetwork}
            >
                {intl.formatMessage({
                    id: 'EVM_WALLET_WRONG_NETWORK_BTN_TEXT',
                })}
            </button>
        </div>
    )
}
