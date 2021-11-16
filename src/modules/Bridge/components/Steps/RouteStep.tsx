import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { networks } from '@/config'
import { RouteForm } from '@/modules/Bridge/components/RouteForm'
import { useBridge } from '@/modules/Bridge/providers'
import {
    AddressesFields,
    CrosschainBridgeStep,
    NetworkFields,
} from '@/modules/Bridge/types'
import { isSameNetwork, isTonMainNetwork } from '@/modules/Bridge/utils'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { TonWalletService } from '@/stores/TonWalletService'


export function RouteStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const evmWallet = bridge.useEvmWallet
    const tonWallet = bridge.useTonWallet

    const onChangeAddress = <K extends keyof AddressesFields>(key: K) => (value: string) => {
        bridge.changeData(key, value)
    }

    const onChangeNetwork = <K extends keyof NetworkFields>(key: K) => (value: string) => {
        const network = networks.find(({ id }) => id === value)
        bridge.changeNetwork(key, network)
    }

    const nextStep = () => {
        bridge.changeState('step', CrosschainBridgeStep.SELECT_ASSET)
    }

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
                    let wallet: TonWalletService | EvmWalletService | undefined

                    if (bridge.leftNetwork !== undefined) {
                        if (bridge.leftNetwork.type === 'evm') {
                            wallet = evmWallet
                        }
                        else if (bridge.leftNetwork.type === 'ton') {
                            wallet = tonWallet
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
                            networks={networks.map(network => ({ label: network.label, value: network.id }))}
                            shouldDisplayNetworkAlert={bridge.isFromEvm
                                ? !isSameNetwork(bridge.leftNetwork?.chainId, evmWallet.chainId)
                                : false}
                            wallet={wallet}
                        />
                    )
                }}
            </Observer>

            <Observer>
                {() => {
                    let wallet: TonWalletService | EvmWalletService | undefined

                    if (bridge.rightNetwork !== undefined) {
                        if (bridge.rightNetwork.type === 'evm') {
                            wallet = evmWallet
                        }
                        else if (bridge.rightNetwork.type === 'ton') {
                            wallet = tonWallet
                        }
                    }

                    return (
                        <RouteForm
                            address={bridge.rightAddress}
                            addressFieldDisabled={bridge.leftNetwork === undefined}
                            addressFieldLabel={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_RECEIVER_ADDRESS_LABEL',
                            })}
                            changeAddress={onChangeAddress('rightAddress')}
                            changeNetwork={onChangeNetwork('rightNetwork')}
                            label={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ROUTE_TO_LABEL',
                            })}
                            network={bridge.rightNetwork}
                            networkFieldDisabled={!isTonMainNetwork(bridge.leftNetwork)}
                            networks={networks.filter(
                                ({ id }) => id !== bridge.leftNetwork?.id,
                            ).map(network => ({ label: network.label, value: network.id }))}
                            shouldDisplayNetworkAlert={bridge.isTonToEvm
                                ? !isSameNetwork(bridge.rightNetwork?.chainId, evmWallet.chainId)
                                : false}
                            wallet={wallet}
                        />
                    )
                }}
            </Observer>

            <footer className="crosschain-transfer__footer">
                <Observer>
                    {() => (
                        <Button
                            className="crosschain-transfer__btn-next"
                            disabled={(
                                (bridge.isEvmToTon
                                    ? !isSameNetwork(bridge.leftNetwork?.chainId, evmWallet.chainId)
                                    : !isSameNetwork(bridge.rightNetwork?.chainId, evmWallet.chainId)
                                ) || !bridge.isRouteValid
                            )}
                            size="lg"
                            type="primary"
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT',
                            })}
                        </Button>
                    )}
                </Observer>
            </footer>
        </>
    )
}
