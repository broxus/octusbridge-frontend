import * as React from 'react'
import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { TonWalletService } from '@/stores/TonWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { NetworkShape } from '@/types'
import { isEvmAddressValid, isTonAddressValid } from '@/utils'


type Props = {
    address?: string;
    addressFieldDisabled?: boolean;
    addressFieldLabel: string;
    changeAddress: (value: string) => void;
    changeNetwork: (value: string, option: any) => void;
    label: React.ReactNode;
    network?: NetworkShape;
    networkFieldDisabled?: boolean;
    networks: {
        label: string;
        value: string;
    }[];
    shouldDisplayNetworkAlert?: boolean;
    wallet?: TonWalletService | EvmWalletService;
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
    shouldDisplayNetworkAlert,
    wallet,
}: Props): JSX.Element {
    const intl = useIntl()

    const onChangeAddress: React.ChangeEventHandler<HTMLInputElement> = event => {
        changeAddress(event.target.value)
    }

    const isAddressValid = () => {
        if (address !== undefined) {
            if (network?.type === 'evm') {
                return isEvmAddressValid(address)
            }

            if (network?.type === 'ton') {
                return isTonAddressValid(address)
            }
        }

        return true
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
                            <Select
                                className="rc-select--lg"
                                disabled={networkFieldDisabled}
                                options={networks}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ROUTE_SELECT_NETWORK_PLACEHOLDER',
                                })}
                                value={network?.id}
                                onChange={changeNetwork}
                            />
                        </div>

                        <Observer>
                            {() => (
                                <>
                                    {(wallet !== undefined && !wallet.isConnected) && (
                                        <div className="crosschain-transfer__wallet">
                                            <Button
                                                disabled={wallet.isConnecting}
                                                size="md"
                                                type="primary"
                                                onClick={wallet.connect}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_WALLET_CONNECT_BTN_TEXT',
                                                })}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </Observer>
                    </div>

                    <Observer>
                        {() => (
                            <>
                                {(
                                    wallet !== undefined
                                    && wallet.isConnected
                                    && network !== undefined
                                    && shouldDisplayNetworkAlert
                                ) && (
                                    <WrongNetworkError
                                        key="alert"
                                        network={network}
                                        wallet={wallet as EvmWalletService}
                                    />
                                )}
                            </>
                        )}
                    </Observer>
                </fieldset>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">{addressFieldLabel}</legend>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <input
                                        className={classNames('form-input', 'form-input--lg', {
                                            invalid: !isAddressValid(),
                                        })}
                                        disabled={!wallet?.isConnected || addressFieldDisabled}
                                        type="text"
                                        value={address}
                                        onChange={onChangeAddress}
                                    />
                                )}
                            </Observer>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
