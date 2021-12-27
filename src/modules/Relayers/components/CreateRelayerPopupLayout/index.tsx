import * as React from 'react'

import { Popup } from '@/components/common/Popup'

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
    return (
        <Popup
            disabled={!dismissEnabled}
            onDismiss={onDismiss}
            className="create-relayer-popup-layout"
        >
            <h2 className="create-relayer-popup-layout__title">{title}</h2>
            {children}
        </Popup>
    )
}
