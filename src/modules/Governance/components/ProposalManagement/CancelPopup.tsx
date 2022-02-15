import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Button } from '@/components/common/Button'
import { Popup } from '@/components/common/Popup'

import './index.scss'

type Props = {
    loading?: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
}

export function CancelPopup({
    loading,
    onDismiss,
    onConfirm,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Popup
            disabled={loading}
            onDismiss={onDismiss}
            className="cancel-popup"
        >
            <h2 className="cancel-popup__title">
                {intl.formatMessage({
                    id: 'PROPOSAL_CANCEL_POPUP_TITLE',
                })}
            </h2>

            <p className="cancel-popup__text">
                {intl.formatMessage({
                    id: 'PROPOSAL_CANCEL_POPUP_TEXT',
                })}
            </p>

            <div className="cancel-popup__actions">
                <Button
                    type="secondary"
                    disabled={loading}
                    onClick={onDismiss}
                >
                    {intl.formatMessage({
                        id: 'PROPOSAL_CANCEL_POPUP_BACK',
                    })}
                </Button>
                <Button
                    type="danger"
                    disabled={loading}
                    onClick={onConfirm}
                    className="cancel-popup__submit"
                >
                    {intl.formatMessage({
                        id: 'PROPOSAL_CANCEL_POPUP_CONFIRM',
                    })}
                    {loading && (
                        <ContentLoader slim iconRatio={0.7} />
                    )}
                </Button>
            </div>
        </Popup>
    )
}
