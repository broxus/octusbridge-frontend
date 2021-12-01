import * as React from 'react'
import { useIntl } from 'react-intl'

import { TextField } from '@/modules/Governance/components/ProposalForm/TextField'
import { EthAction } from '@/modules/Governance/types'
import { isEvmAddressValid, isGoodBignumber } from '@/utils'

import './index.scss'

type Props = {
    action?: EthAction;
    onChange: (action?: EthAction) => void;
}

export function ActionFormEth({
    action,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()

    const [localAction, setAction] = React.useState<Record<keyof EthAction, string>>({
        target: action?.target || '',
        value: action?.value || '',
        callData: action?.callData || '',
        signature: action?.signature || '',
        chainId: action?.chainId ? `${action.chainId}` : '',
    })

    const callDataIsValid = localAction.callData.length > 0
    const chainIdIsValid = !Number.isNaN(parseInt(localAction.chainId, 10))
    const signatureIsValid = localAction.signature.length > 0
    const targetIsValid = isEvmAddressValid(localAction.target)
    const valueIsValid = isGoodBignumber(localAction.value)

    const changeField = (key: keyof typeof localAction) => (value: string) => {
        setAction(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    React.useEffect(() => {
        if (callDataIsValid && chainIdIsValid && signatureIsValid && targetIsValid && valueIsValid) {
            onChange({
                ...localAction,
                chainId: parseInt(localAction.chainId, 10),
            })
        }
        else {
            onChange(undefined)
        }
    }, [localAction])

    return (
        <>
            <TextField
                valid={targetIsValid}
                value={localAction.target}
                onChange={changeField('target')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_TARGET_ADDRESS',
                })}
            />

            <TextField
                valid={callDataIsValid}
                value={localAction.callData}
                onChange={changeField('callData')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_CALL_DATA',
                })}
            />

            <TextField
                valid={chainIdIsValid}
                value={localAction.chainId}
                onChange={changeField('chainId')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_CHAIN_ID',
                })}
            />

            <TextField
                valid={signatureIsValid}
                value={localAction.signature}
                onChange={changeField('signature')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_SIGNATURE',
                })}
            />

            <TextField
                valid={valueIsValid}
                value={localAction.value}
                onChange={changeField('value')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_VALUE',
                })}
            />
        </>
    )
}
