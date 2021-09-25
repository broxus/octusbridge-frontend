import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { CrystalWalletService } from '@/stores/CrystalWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { NetworkShape } from '@/modules/CrosschainTransfer/types'


type Props = {
    address?: string;
    addressFieldLabel: string;
    addressFieldDisabled?: boolean;
    changeAddress: (value: string) => void;
    changeNetwork: (value: string, option: NetworkShape) => void;
    label: React.ReactNode;
    network?: NetworkShape;
    networkFieldDisabled?: boolean;
    networks: NetworkShape[];
    wallet: CrystalWalletService | EvmWalletService;
}


export function RouteForm({
    address,
    addressFieldLabel,
    addressFieldDisabled,
    changeAddress,
    changeNetwork,
    label,
    network,
    networkFieldDisabled,
    networks,
    wallet,
}: Props): JSX.Element {
    const intl = useIntl()

    const onChangeAddress: React.ChangeEventHandler<HTMLInputElement> = event => {
        changeAddress(event.target.value)
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {label}
            </div>
            <form className="form crosschain-transfer__form">
                <fieldset className="form-fieldset">
                    <legend className="form-legend">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ROUTE_NETWORK_LABEL',
                        })}
                    </legend>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <Select
                                        className="rc-select--lg"
                                        fieldNames={{
                                            value: 'chainId',
                                        }}
                                        disabled={!wallet.isConnected || networkFieldDisabled}
                                        // @ts-ignore
                                        options={networks}
                                        placeholder={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ROUTE_SELECT_NETWORK_PLACEHOLDER',
                                        })}
                                        value={network?.chainId}
                                        // @ts-ignore
                                        onChange={changeNetwork}
                                    />
                                )}
                            </Observer>
                        </div>

                        <Observer>
                            {() => (
                                <div className="crosschain-transfer__wallet">
                                    {!wallet.isConnected && (
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={wallet.connect}
                                        >
                                            {intl.formatMessage({
                                                id: 'CROSSCHAIN_TRANSFER_WALLET_CONNECT_BTN_TEXT',
                                            })}
                                        </button>
                                    )}
                                </div>
                            )}
                        </Observer>
                    </div>
                </fieldset>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">{addressFieldLabel}</legend>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <input
                                        className="form-input form-input--lg"
                                        disabled={!wallet.isConnected || addressFieldDisabled}
                                        type="text"
                                        value={address}
                                        onChange={onChangeAddress}
                                    />
                                )}
                            </Observer>
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
