import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Button } from '@/components/common/Button'
import { Popup } from '@/components/common/Popup'
import { Textarea } from '@/components/common/Textarea'

import './index.scss'

type Props = {
    support: boolean;
    loading?: boolean;
    disabled?: boolean;
    onDismiss: () => void;
    onSubmit: (reason?: string) => void;
}

export function VotingForm({
    support,
    disabled,
    loading,
    onDismiss,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const [reason, setReason] = React.useState<string | undefined>(undefined)

    const submit = () => {
        onSubmit(reason)
    }

    return (
        <Popup
            onDismiss={onDismiss}
            disabled={disabled}
            className="voting-form"
        >
            <h2 className="voting-form__title">
                {intl.formatMessage({
                    id: support ? 'VOTING_FORM_TITLE_1' : 'VOTING_FORM_TITLE_0',
                })}
            </h2>

            <div className="form-legend">
                {intl.formatMessage({
                    id: 'VOTING_FORM_REASON',
                })}
            </div>

            <Textarea
                value={reason || ''}
                maxLength={512}
                disabled={disabled}
                onChange={setReason}
            />

            <div className="voting-form__actions">
                <Button
                    block
                    type="secondary"
                    disabled={disabled}
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'VOTING_FORM_CANCEL',
                    })}
                </Button>

                <Button
                    block
                    type="primary"
                    disabled={disabled || loading}
                    onClick={submit}
                >
                    {loading ? (
                        <ContentLoader slim transparent />
                    ) : (
                        intl.formatMessage({
                            id: 'VOTING_FORM_SUBMIT',
                        })
                    )}
                </Button>
            </div>
        </Popup>
    )
}
