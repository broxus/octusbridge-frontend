import * as React from 'react'
import { reaction } from 'mobx'
import isEqual from 'lodash.isequal'
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
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { Icon } from '@/components/common/Icon'


export function RouteStep(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()
    const evmWallet = bridge.useEvmWallet
    const everWallet = bridge.useEverWallet
    const bridgeAssets = bridge.useBridgeAssets

    const onChangeAddress = <K extends keyof AddressesFields>(key: K) => (value: string) => {
        bridge.setData(key, value)
    }

    const onChangeNetwork = <K extends keyof NetworkFields>(key: K) => (value: string) => {
        const network = networks.find(({ id }) => id === value)
        bridge.changeNetwork(key, network)
    }

    const nextStep = () => {
        bridge.setState('step', CrosschainBridgeStep.SELECT_ASSET)
    }

    React.useEffect(() => reaction(
        () => bridge.evmPendingWithdrawal,
        () => {
            if (bridge.evmPendingWithdrawal) {
                const { chainId } = bridge.evmPendingWithdrawal
                const evmNetwork = networks.find(({ id }) => id === `evm-${chainId}`)
                const everNetwork = networks.find(({ id }) => id === 'everscale-1')
                bridge.changeNetwork('leftNetwork', evmNetwork)
                bridge.changeNetwork('rightNetwork', everNetwork)
            }
        },
        {
            fireImmediately: true,
        },
    ), [])

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
                    let wallet: EverWalletService | EvmWalletService | undefined

                    if (bridge.leftNetwork !== undefined) {
                        if (bridge.leftNetwork.type === 'evm') {
                            wallet = evmWallet
                        }
                        else if (bridge.leftNetwork.type === 'everscale') {
                            wallet = everWallet
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
                            shouldDisplayNetworkAlert={bridge.isFromEvm
                                ? !isEqual(bridge.leftNetwork?.chainId, evmWallet.chainId)
                                : false}
                            wallet={wallet}
                            networkFieldDisabled={bridge.evmPendingWithdrawal !== undefined}
                        />
                    )
                }}
            </Observer>

            <Observer>
                {() => {
                    let wallet: EverWalletService | EvmWalletService | undefined

                    if (bridge.rightNetwork !== undefined) {
                        if (bridge.rightNetwork.type === 'evm') {
                            wallet = evmWallet
                        }
                        else if (bridge.rightNetwork.type === 'everscale') {
                            wallet = everWallet
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
                            networks={bridge.rightNetworks}
                            shouldDisplayNetworkAlert={bridge.isEverscaleToEvm
                                ? !isEqual(bridge.rightNetwork?.chainId, evmWallet.chainId)
                                : false}
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
                            disabled={bridgeAssets.isFetching || !bridge.isRouteValid}
                            size="lg"
                            type="primary"
                            onClick={nextStep}
                        >
                            {bridgeAssets.isFetching ? (
                                <Icon icon="loader" className="spin" />
                            ) : intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT',
                            })}
                        </Button>
                    )}
                </Observer>
            </footer>
        </>
    )
}
