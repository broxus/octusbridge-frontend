import * as React from 'react'
import { useIntl } from 'react-intl'

import { TextField } from '@/modules/Governance/components/ProposalForm/TextField'
import { TonAction } from '@/modules/Governance/types'
import { isEverscaleAddressValid, isGoodBignumber } from '@/utils'

import './index.scss'

type Props = {
    action?: TonAction;
    onChange: (action?: TonAction) => void;
}

export function ActionFormTon({
    action,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()
    const [localAction, setAction] = React.useState<Record<keyof TonAction, string>>({
        target: action?.target || '',
        payload: action?.payload || '',
        value: action?.value || '',
    })

    const targetIsValid = isEverscaleAddressValid(localAction.target)
    const valueIsValid = isGoodBignumber(localAction.value, false)
    // const payloadIsValid = localAction.payload.length > 0

    const changeField = (key: keyof typeof localAction) => (value: string) => {
        setAction(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    React.useEffect(() => {
        if (targetIsValid && valueIsValid) {
            onChange(localAction)
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
                // valid={payloadIsValid}
                value={localAction.payload}
                onChange={changeField('payload')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_PAYLOAD',
                })}
            />

            <TextField
                valid={valueIsValid}
                value={localAction.value}
                onChange={changeField('value')}
                label={intl.formatMessage({
                    id: 'ACTION_POPUP_ATTACHED_VALUE',
                })}
            />
        </>
    )
}
