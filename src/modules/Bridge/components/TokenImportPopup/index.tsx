import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { TokenIcon } from '@/components/common/TokenIcon'
import { BridgeAsset } from '@/stores/BridgeAssetsService'


type Props = {
    token: BridgeAsset;
    ocConfirm: () => void;
    onClose: () => void;
}


export function TokenImportPopup({ token, ocConfirm, onClose }: Props): JSX.Element {
    const intl = useIntl()

    return ReactDOM.createPortal(
        <div className="popup">
            <div className="popup-overlay" onClick={onClose} />
            <div className="popup__wrap">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-icon popup-close"
                >
                    <Icon icon="close" />
                </button>
                <h2 className="popup-title">
                    {intl.formatMessage({
                        id: 'TOKENS_POPUP_IMPORT_TOKEN_TITLE',
                    })}
                </h2>

                <div className="popup-main warning">
                    <div className="popup-main__ava">
                        <TokenIcon
                            address={token.root}
                            name={token.name}
                            uri={token.icon}
                        />
                    </div>
                    <div className="popup-main__name">
                        {token.symbol}
                        {' '}
                        <span className="text-muted">{token.name}</span>
                    </div>
                </div>

                <div
                    className="popup-txt"
                    dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                            id: 'TOKENS_POPUP_IMPORT_TOKEN_WARNING',
                        }),
                    }}
                />

                <Button
                    block
                    size="md"
                    type="primary"
                    onClick={ocConfirm}
                >
                    {intl.formatMessage({
                        id: 'TOKENS_POPUP_CONFIRM_BTN_TEXT',
                    })}
                </Button>
            </div>
        </div>,
        document.body,
    )
}
