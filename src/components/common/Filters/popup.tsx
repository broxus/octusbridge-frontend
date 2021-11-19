import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'

import './index.scss'

type Props = {
    applyEnabled: boolean;
    clearEnabled: boolean;
    onApply?: () => void;
    onClear?: () => void;
    children: React.ReactNode;
}

export function Popup({
    applyEnabled,
    clearEnabled,
    onApply,
    onClear,
    children,
}: Props): JSX.Element {
    const intl = useIntl()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onApply?.()
    }

    return (
        <form className="filters-popup" onSubmit={onSubmit}>
            {children}

            <input type="submit" hidden />

            <div className="filters-popup__actions">
                <Button
                    type="secondary"
                    disabled={!clearEnabled}
                    onClick={onClear}
                >
                    {intl.formatMessage({
                        id: 'FILTERS_CLEAR',
                    })}
                </Button>

                <Button
                    type="primary"
                    disabled={!applyEnabled}
                    onClick={onApply}
                >
                    {intl.formatMessage({
                        id: 'FILTERS_APPLY',
                    })}
                </Button>
            </div>
        </form>
    )
}
