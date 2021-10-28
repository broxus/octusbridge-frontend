import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { CreateRelayerPopupLayout } from '@/modules/Relayers/components/CreateRelayerPopupLayout'

import './index.scss'

type Props = {
    relayLink?: string;
}

export function CreateRelayerSuccess({
    relayLink,
}: Props): JSX.Element | null {
    const intl = useIntl()
    const [closed, setClosed] = React.useState(false)
    const close = () => setClosed(true)

    if (closed) {
        return null
    }

    return (
        <CreateRelayerPopupLayout
            onDismiss={close}
            title={intl.formatMessage({
                id: 'RELAYERS_CREATE_SUCCESS_TITLE',
            })}
        >
            <div
                dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                        id: 'RELAYERS_CREATE_SUCCESS_TEXT',
                    }),
                }}
            />

            {relayLink && (
                <div className="create-relayer-popup-actions">
                    <Link
                        to={relayLink}
                        className="btn btn--tertiary btn-block"
                    >
                        {intl.formatMessage({
                            id: 'RELAYERS_CREATE_SUCCESS_BTN',
                        })}
                    </Link>
                </div>
            )}
        </CreateRelayerPopupLayout>
    )
}
