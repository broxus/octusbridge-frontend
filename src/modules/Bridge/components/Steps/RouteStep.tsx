import isEqual from 'lodash.isequal'
import { reaction } from 'mobx'
import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { networks } from '@/config'
import { RouteForm } from '@/modules/Bridge/components/RouteForm'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'
import { type AddressesFields, type NetworkFields } from '@/modules/Bridge/types'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type SolanaWalletService } from '@/stores/SolanaWalletService'
import { findNetwork, getEverscaleMainNetwork } from '@/utils'

export function RouteStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const onChangeAddress = <K extends keyof AddressesFields>(key: K) => (value: string) => {
        bridge.setData(key, value)
    }

    const onChangeNetwork = <K extends keyof NetworkFields>(key: K) => (value: string) => {
        const network = networks.find(({ id }) => id === value)
        if (network !== undefined) {
            bridge.changeNetwork(key, network)
        }
    }

    const nextStep: VoidFunction = () => {
        bridge.setState('step', CrosschainBridgeStep.SELECT_ASSET)
    }

    React.useEffect(
        () => reaction(
            () => bridge.evmPendingWithdrawal,
            () => {
                if (bridge.evmPendingWithdrawal) {
                    const { chainId } = bridge.evmPendingWithdrawal
                    bridge.changeNetwork('leftNetwork', findNetwork(chainId, 'evm'))
                    bridge.changeNetwork('rightNetwork', getEverscaleMainNetwork())
                }
            },
            { fireImmediately: true },
        ),
        [],
    )

    return (
        <>
            <header className="section__header">
                <h2 className="section-title">
                    <div className="small">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STEP_1_HINT',
                        })}
                    </div>
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STEP_1_TITLE',
                    })}
                </h2>
            </header>

            <Observer>
                {() => {
                    let wallet: EverWalletService | EvmWalletService | SolanaWalletService | undefined

                    if (bridge.leftNetwork !== undefined) {
                        if (bridge.leftNetwork.type === 'evm') {
                            wallet = bridge.evmWallet
                        }
                        else if (bridge.leftNetwork.type === 'tvm') {
                            wallet = bridge.tvmWallet
                        }
                        else if (bridge.leftNetwork.type === 'solana') {
                            wallet = bridge.solanaWallet
                        }
                    }

                    return (
                        <RouteForm
                            address={bridge.leftAddress}
                            addressFieldDisabled
                            addressFieldLabel={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_SENDER_ADDRESS_LABEL',
                            })}
                            changeAddress={onChangeAddress('leftAddress')}
                            changeNetwork={onChangeNetwork('leftNetwork')}
                            label={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_FROM_LABEL',
                            })}
                            network={bridge.leftNetwork}
                            networks={networks}
                            shouldDisplayNetworkAlert={
                                bridge.isFromEvm
                                    ? !isEqual(bridge.leftNetwork?.chainId, bridge.evmWallet.chainId)
                                    : false
                            }
                            wallet={wallet}
                            networkFieldDisabled={bridge.evmPendingWithdrawal !== undefined}
                        />
                    )
                }}
            </Observer>

            <Observer>
                {() => {
                    let wallet: EverWalletService | EvmWalletService | SolanaWalletService | undefined

                    if (bridge.rightNetwork !== undefined) {
                        if (bridge.rightNetwork.type === 'evm') {
                            wallet = bridge.evmWallet
                        }
                        else if (bridge.rightNetwork.type === 'tvm') {
                            wallet = bridge.tvmWallet
                        }
                        else if (bridge.rightNetwork.type === 'solana') {
                            wallet = bridge.solanaWallet
                        }
                    }

                    return (
                        <RouteForm
                            address={bridge.rightAddress}
                            addressFieldLabel={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_RECEIVER_ADDRESS_LABEL',
                            })}
                            changeAddress={onChangeAddress('rightAddress')}
                            changeNetwork={onChangeNetwork('rightNetwork')}
                            clearable
                            label={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_TO_LABEL',
                            })}
                            network={bridge.rightNetwork}
                            networks={bridge.rightNetworks}
                            shouldDisplayNetworkAlert={
                                bridge.isTvmEvm
                                    ? !isEqual(bridge.rightNetwork?.chainId, bridge.evmWallet.chainId)
                                    : false
                            }
                            wallet={wallet}
                            networkFieldDisabled={bridge.evmPendingWithdrawal !== undefined}
                        />
                    )
                }}
            </Observer>

            <footer className="crosschain-transfer__footer">
                <Observer>
                    {() => (
                        <Button
                            className="crosschain-transfer__btn-next"
                            disabled={bridge.bridgeAssets.isFetching || !bridge.isRouteValid}
                            size="lg"
                            type="primary"
                            onClick={nextStep}
                        >
                            {bridge.bridgeAssets.isFetching ? (
                                <Icon icon="loader" className="spin" />
                            ) : (
                                intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT',
                                })
                            )}
                        </Button>
                    )}
                </Observer>
            </footer>
        </>
    )
}
