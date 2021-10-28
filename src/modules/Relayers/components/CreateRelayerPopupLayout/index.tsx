import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Icon } from '@/components/common/Icon'

import './index.scss'

type Props = {
    title: string;
    children: React.ReactNode | React.ReactNodeArray;
    dismissEnabled?: boolean;
    onDismiss: () => void;
}

export function CreateRelayerPopupLayout({
    title,
    children,
    dismissEnabled = true,
    onDismiss,
}: Props): JSX.Element {
    return ReactDOM.createPortal(
        <div className="popup">
            <div
                className="popup-overlay"
                onClick={dismissEnabled ? onDismiss : undefined}
            />
            <div className="popup__wrap create-relayer-popup-layout">
                <button
                    type="button"
                    className="btn btn-icon popup-close"
                    onClick={onDismiss}
                    disabled={!dismissEnabled}
                >
                    <Icon icon="close" />
                </button>

                <h2 className="create-relayer-popup-layout__title">{title}</h2>

                {children}
            </div>
        </div>,
        document.body,
    )
}
