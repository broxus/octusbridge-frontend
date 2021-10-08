import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { NetworkShape } from '@/bridge'
import { networks } from '@/config'
import { RouteForm } from '@/modules/Bridge/components/RouteForm'
import { useBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import {
    AddressesFields,
    CrosschainBridgeStep,
    NetworkFields,
} from '@/modules/Bridge/types'
import { useEvmWallet } from '@/stores/EvmWalletService'
import { useTonWallet } from '@/stores/TonWalletService'
import { isSameNetwork, isTonMainNetwork } from '@/modules/Bridge/utils'


export function RouteStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const evmWallet = useEvmWallet()
    const tonWallet = useTonWallet()

    const changeAddress = <K extends keyof AddressesFields>(key: K) => (value: string) => {
        bridge.changeData(key, value)
    }

    const changeNetwork = <K extends keyof NetworkFields>(key: K) => (_: string, option: NetworkShape) => {
        bridge.changeNetwork(key, option)
    }

    const nextStep = () => {
        bridge.changeStep(CrosschainBridgeStep.SELECT_ASSET)
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
                {() => (
                    <RouteForm
                        address={bridge.leftAddress}
                        addressFieldDisabled
                        addressFieldLabel={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_SENDER_ADDRESS_LABEL',
                        })}
                        changeAddress={changeAddress('leftAddress')}
                        changeNetwork={changeNetwork('leftNetwork')}
                        label={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_FROM_LABEL',
                        })}
                        network={bridge.leftNetwork}
                        networks={networks}
                        shouldDisplayNetworkAlert={bridge.isEvmToTon
                            ? !isSameNetwork(bridge.leftNetwork?.chainId, evmWallet.chainId)
                            : false}
                        /* eslint-disable-next-line no-nested-ternary */
                        wallet={bridge.leftNetwork !== undefined
                            ? (bridge.isEvmToTon ? evmWallet : tonWallet)
                            : undefined}
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <RouteForm
                        address={bridge.rightAddress}
                        addressFieldDisabled={bridge.leftNetwork === undefined}
                        addressFieldLabel={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_RECEIVER_ADDRESS_LABEL',
                        })}
                        changeAddress={changeAddress('rightAddress')}
                        changeNetwork={changeNetwork('rightNetwork')}
                        label={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_TO_LABEL',
                        })}
                        network={bridge.rightNetwork}
                        networkFieldDisabled={!isTonMainNetwork(bridge.leftNetwork)}
                        networks={networks.filter(({ id }) => id !== bridge.leftNetwork?.id)}
                        shouldDisplayNetworkAlert={bridge.isTonToEvm
                            ? !isSameNetwork(bridge.rightNetwork?.chainId, evmWallet.chainId)
                            : false}
                        /* eslint-disable-next-line no-nested-ternary */
                        wallet={bridge.rightNetwork !== undefined
                            ? (bridge.isEvmToTon ? tonWallet : evmWallet)
                            : undefined}
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <footer className="crosschain-transfer__footer">
                        <button
                            type="button"
                            className="btn btn-lg btn--primary crosschain-transfer__btn-next"
                            disabled={(
                                (bridge.isEvmToTon
                                    ? !isSameNetwork(bridge.leftNetwork?.chainId, evmWallet.chainId)
                                    : !isSameNetwork(bridge.rightNetwork?.chainId, evmWallet.chainId)
                                ) || !bridge.isRouteValid
                            )}
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT',
                            })}
                        </button>
                    </footer>
                )}
            </Observer>
        </>
    )
}
