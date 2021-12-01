import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'

type Props = {
    className?: string;
    disabled?: boolean;
    onDismiss: () => void;
    children: React.ReactNode | React.ReactNodeArray;
}

export function Popup({
    className,
    disabled,
    onDismiss,
    children,
}: Props): JSX.Element {
    return ReactDOM.createPortal(
        <div className="popup">
            <div
                className="popup-overlay"
                onClick={disabled ? undefined : onDismiss}
            />

            <div className={`popup__wrap ${className}`}>
                <Button
                    type="icon"
                    className="popup-close"
                    onClick={onDismiss}
                    disabled={disabled}
                >
                    <Icon icon="close" />
                </Button>

                {children}
            </div>
        </div>,
        document.body,
    )
}
