import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Button } from '@/components/common/Button'
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
                <Button
                    className="popup-close"
                    disabled={!dismissEnabled}
                    type="icon"
                    onClick={onDismiss}
                >
                    <Icon icon="close" />
                </Button>

                <h2 className="create-relayer-popup-layout__title">{title}</h2>

                {children}
            </div>
        </div>,
        document.body,
    )
}
