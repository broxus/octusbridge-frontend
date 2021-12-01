import * as React from 'react'

import { Popup } from '@/components/common/Popup'
import { ActionNetwork, EthAction, TonAction } from '@/modules/Governance/types'
import { ActionForm } from '@/modules/Governance/components/ProposalForm/ActionForm'
import { ActionFormEth } from '@/modules/Governance/components/ProposalForm/ActionFormEth'
import { ActionFormTon } from '@/modules/Governance/components/ProposalForm/ActionFormTon'

import './index.scss'

export type Action = {
    network: ActionNetwork.ETH;
    data: EthAction;
} | {
    network: ActionNetwork.TON;
    data: TonAction;
}

type Props = {
    action?: Action;
    onDismiss: () => void;
    onSubmit: (action: Action) => void;
}

export function ActionPopup({
    action,
    onDismiss,
    onSubmit,
}: Props): JSX.Element {
    const [network, setNetwork] = React.useState<ActionNetwork>(action?.network || ActionNetwork.TON)
    const [localAction, setLocalAction] = React.useState<Action>()

    const changeNetwork = (value: ActionNetwork) => {
        setNetwork(value)
        setLocalAction(undefined)
    }

    const changeTonAction = (data?: TonAction) => {
        setLocalAction(data ? {
            data,
            network: ActionNetwork.TON,
        } : undefined)
    }

    const changeEthAction = (data?: EthAction) => {
        setLocalAction(data ? {
            data,
            network: ActionNetwork.ETH,
        } : undefined)
    }

    const submit = () => {
        if (localAction) {
            onSubmit(localAction)
        }
    }

    return (
        <Popup
            onDismiss={onDismiss}
            className="proposal-action-popup"
        >
            <ActionForm
                network={network}
                disabled={localAction === undefined}
                onChangeNetwork={changeNetwork}
                onDismiss={onDismiss}
                onSubmit={submit}
            >
                {network === ActionNetwork.TON && (
                    <ActionFormTon
                        action={action?.data as TonAction}
                        onChange={changeTonAction}
                    />
                )}

                {network === ActionNetwork.ETH && (
                    <ActionFormEth
                        action={action?.data as EthAction}
                        onChange={changeEthAction}
                    />
                )}
            </ActionForm>
        </Popup>
    )
}
