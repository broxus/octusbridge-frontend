import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { ActionNetwork } from '@/modules/Governance/types'

import './index.scss'

type Props = {
    network: ActionNetwork;
    disabled?: boolean;
    children?: React.ReactNode | React.ReactNodeArray;
    onSubmit: () => void;
    onDismiss: () => void;
    onChangeNetwork: (type: ActionNetwork) => void;
}

export function ActionForm({
    network,
    disabled,
    children,
    onSubmit,
    onDismiss,
    onChangeNetwork,
}: Props): JSX.Element {
    const intl = useIntl()

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={submit}>
            <input type="submit" hidden />

            <div className="proposal-form-popup__title">
                {intl.formatMessage({
                    id: 'ACTION_POPUP_TITLE',
                })}
            </div>

            <div className="proposal-form-popup__field">
                <legend className="form-legend">
                    {intl.formatMessage({
                        id: 'ACTION_POPUP_NETWORK',
                    })}
                </legend>

                <Select
                    value={network}
                    onChange={onChangeNetwork}
                    options={[{
                        label: intl.formatMessage({
                            id: 'ACTION_POPUP_NETWORK_TON',
                        }),
                        value: ActionNetwork.TON,
                    // TODO: First do encode callData in proposalCreate store
                    // }, {
                    //     label: intl.formatMessage({
                    //         id: 'ACTION_POPUP_NETWORK_ETH',
                    //     }),
                    //     value: ActionNetwork.ETH,
                    }]}
                />
            </div>

            {children}

            <div className="proposal-form-popup__footer">
                <Button
                    block
                    size="md"
                    type="secondary"
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'ACTION_POPUP_CANCEL',
                    })}
                </Button>
                <Button
                    block
                    size="md"
                    type="primary"
                    disabled={disabled}
                    onClick={onSubmit}
                >
                    {intl.formatMessage({
                        id: 'ACTION_POPUP_SUBMIT',
                    })}
                </Button>
            </div>
        </form>
    )
}
