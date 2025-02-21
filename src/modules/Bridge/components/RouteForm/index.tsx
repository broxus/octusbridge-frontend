import classNames from 'classnames'
import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { Select } from '@/components/common/Select'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type SolanaWalletService } from '@/stores/SolanaWalletService'
import { type NetworkShape } from '@/types'
import { isEverscaleAddressValid, isEvmAddressValid, isSolanaAddressValid } from '@/utils'

import './index.scss'

type Props = {
    address?: string;
    addressFieldDisabled?: boolean;
    addressFieldLabel: string;
    changeAddress: (value: string) => void;
    changeNetwork: (value: string, option: any) => void;
    clearable?: boolean
    label: React.ReactNode;
    network?: NetworkShape;
    networkFieldDisabled?: boolean;
    networks: NetworkShape[];
    shouldDisplayNetworkAlert?: boolean;
    wallet?: EverWalletService | EvmWalletService | SolanaWalletService;
}

function isAddressValid(addr?: string, type?: NetworkShape['type']): boolean {
    if (type === 'tvm') {
        return isEverscaleAddressValid(addr)
    }

    if (type === 'evm') {
        return isEvmAddressValid(addr)
    }

    if (type === 'solana') {
        return isSolanaAddressValid(addr)
    }

    return true
}

export function RouteForm({
    address,
    addressFieldLabel,
    addressFieldDisabled,
    changeAddress,
    changeNetwork,
    clearable,
    label,
    network,
    networkFieldDisabled,
    networks,
    shouldDisplayNetworkAlert,
    wallet,
}: Props): JSX.Element {
    const intl = useIntl()

    const onChangeAddress: React.ChangeEventHandler<HTMLInputElement> = event => {
        changeAddress(event.target.value.trim())
    }

    const clear: VoidFunction = () => {
        changeAddress('')
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
                                className="network-select rc-select--md"
                                disabled={networkFieldDisabled}
                                options={networks.map(item => ({
                                    disabled: item.disabled,
                                    label: (
                                        <div className="network-select-label">
                                            <div className="network-select-label-inner">
                                                <div>
                                                    <Icon icon={`${item.type.toLowerCase()}${item.chainId}BlockchainIcon`} />
                                                </div>
                                                <div>
                                                    {item.name}
                                                </div>
                                            </div>
                                            {item.badge !== undefined && (
                                                <div className="network-select-label-badge">
                                                    {item.badge}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    value: item.id,
                                }))}
                                listHeight={460}
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
                                    {(() => {
                                        switch (true) {
                                            case network?.type === 'evm':
                                                return null

                                            default:
                                                if (wallet === undefined || wallet.isConnected) {
                                                    return null
                                                }
                                                return (
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
                                                )
                                        }
                                    })()}
                                </>
                            )}
                        </Observer>
                    </div>

                    <Observer>
                        {() => (
                            <React.Fragment key="wrong-network-error">
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
                            </React.Fragment>
                        )}
                    </Observer>
                </fieldset>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">{addressFieldLabel}</legend>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <div className="form-input-address">
                                        <input
                                            className={classNames('form-input', 'form-input--md', {
                                                invalid: !isAddressValid(address, network?.type),
                                            })}
                                            disabled={addressFieldDisabled}
                                            type="text"
                                            value={address}
                                            onChange={onChangeAddress}
                                        />
                                        {clearable && (address?.length ?? 0) > 0 && (
                                            <button
                                                className="clear-address-input clear-input"
                                                type="button"
                                                onClick={clear}
                                                tabIndex={-1}
                                            >
                                                <Icon icon="remove" ratio={0.6} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </Observer>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
