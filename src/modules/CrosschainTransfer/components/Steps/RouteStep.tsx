import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { RouteForm } from '@/modules/CrosschainTransfer/components/RouteForm'
import { networks } from '@/modules/CrosschainTransfer/constants'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'
import {
    AddressesFields,
    CrosschainTransferStep,
    NetworkFields,
    NetworkShape,
} from '@/modules/CrosschainTransfer/types'
import { useTonWallet } from '@/stores/TonWalletService'
import { useEvmWallet } from '@/stores/EvmWalletService'


export function RouteStep(): JSX.Element {
    const intl = useIntl()
    const transfer = useCrosschainTransfer()
    const crystalWallet = useTonWallet()
    const evmWallet = useEvmWallet()

    const changeAddress = <K extends keyof AddressesFields>(key: K) => (value: string) => {
        transfer.changeData(key, value)
    }

    const changeNetwork = <K extends keyof NetworkFields>(key: K) => (_: string, option: NetworkShape) => {
        transfer.changeNetwork(key, option)
    }

    const nextStep = () => {
        transfer.changeStep(CrosschainTransferStep.SELECT_ASSET)
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
                        address={transfer.leftAddress}
                        addressFieldLabel={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_SENDER_ADDRESS_LABEL',
                        })}
                        addressFieldDisabled
                        changeAddress={changeAddress('leftAddress')}
                        changeNetwork={changeNetwork('leftNetwork')}
                        label={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_FROM_LABEL',
                        })}
                        network={transfer.leftNetwork}
                        networks={networks}
                        shouldDisplayNetworkAlert={transfer.isEvmToTon && (
                            transfer.leftNetwork?.chainId !== undefined
                            && evmWallet.chainId !== parseInt(transfer.leftNetwork.chainId, 10)
                        )}
                        wallet={evmWallet}
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <RouteForm
                        address={transfer.rightAddress}
                        addressFieldLabel={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_RECEIVER_ADDRESS_LABEL',
                        })}
                        addressFieldDisabled={transfer.leftNetwork === undefined}
                        changeAddress={changeAddress('rightAddress')}
                        changeNetwork={changeNetwork('rightNetwork')}
                        label={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_TO_LABEL',
                        })}
                        network={transfer.rightNetwork}
                        networkFieldDisabled={
                            transfer.leftNetwork === undefined
                            || (transfer.leftNetwork.chainId !== '1' && transfer.leftNetwork.type !== 'ton')
                        }
                        networks={networks.filter(({ chainId }) => chainId !== transfer.leftNetwork?.chainId)}
                        shouldDisplayNetworkAlert={transfer.isTonToEvm && (
                            transfer.rightNetwork?.chainId !== undefined
                            && evmWallet.chainId !== parseInt(transfer.rightNetwork.chainId, 10)
                        )}
                        wallet={crystalWallet}
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <footer className="crosschain-transfer__footer">
                        <button
                            type="button"
                            className="btn btn-lg btn--primary crosschain-transfer__btn-next"
                            disabled={!transfer.isRouteValid}
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
