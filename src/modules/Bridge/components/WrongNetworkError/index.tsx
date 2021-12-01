import * as React from 'react'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { NetworkShape } from '@/types'


type Props = {
    network: NetworkShape;
    wallet: EvmWalletService;
}


export function WrongNetworkError({ network, wallet }: Props): JSX.Element {
    const intl = useIntl()

    const onChangeNetwork = async () => {
        await wallet.changeNetwork?.(network.chainId)
    }

    return (
        <Alert
            actions={(
                <Button
                    size="md"
                    type="tertiary"
                    onClick={onChangeNetwork}
                >
                    {intl.formatMessage({
                        id: 'EVM_WALLET_WRONG_NETWORK_BTN_TEXT',
                    })}
                </Button>
            )}
            text={intl.formatMessage({
                id: 'EVM_WALLET_WRONG_NETWORK_NOTE',
            }, {
                network: network.name || '',
            })}
            type="danger"
        />
    )
}
