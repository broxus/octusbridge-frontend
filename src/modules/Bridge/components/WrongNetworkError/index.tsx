import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type NetworkShape } from '@/types'


type Props = {
    className?: string;
    network: NetworkShape;
    wallet: EvmWalletService;
}


export function WrongNetworkError({ className, network, wallet }: Props): JSX.Element {
    const intl = useIntl()

    const onChangeNetwork = async () => {
        await wallet.changeNetwork?.(network.chainId)
    }

    return (
        <Observer>
            {() => (
                <Alert
                    className={className}
                    actions={wallet.isMetaMask ? (
                        <Button
                            size="md"
                            type="tertiary"
                            onClick={onChangeNetwork}
                        >
                            {intl.formatMessage({
                                id: 'EVM_WALLET_WRONG_NETWORK_BTN_TEXT',
                            })}
                        </Button>
                    ) : undefined}
                    text={wallet.isMetaMask ? intl.formatMessage({
                        id: 'EVM_WALLET_WRONG_NETWORK_NOTE',
                    }, {
                        network: network.name || '',
                    }) : intl.formatMessage({
                        id: 'EVM_WALLET_WRONG_NETWORK_NOTE_APP',
                    }, {
                        network: network.name || '',
                    })}
                    type="danger"
                />

            )}
        </Observer>
    )
}
