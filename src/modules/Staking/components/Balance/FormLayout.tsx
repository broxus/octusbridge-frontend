import * as React from 'react'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Button } from '@/components/common/Button'

import './index.scss'

type Props = {
    error?: string;
    action: string;
    disabled?: boolean;
    hint?: string;
    loading?: boolean;
    onSubmit?: () => void;
    children?: React.ReactNode;
}

export function FormLayout({
    error,
    action,
    disabled,
    hint,
    loading,
    onSubmit,
    children,
}: Props): JSX.Element {
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit?.()
    }

    return (
        <form className="staking-form-layout" onSubmit={submit}>
            <div className="staking-form-layout__field">
                <div className="staking-form-layout__input">
                    {children}
                </div>
                <div className="staking-form-layout__action">
                    <Button
                        submit
                        type="primary"
                        disabled={disabled}
                        className="staking-form-layout__button"
                    >
                        {action}
                        {loading && (
                            <ContentLoader slim />
                        )}
                    </Button>
                </div>
            </div>
            {error ? (
                <div className="staking-form-layout__hint staking-form-layout__hint_error">
                    {error}
                </div>
            ) : (
                <>
                    {hint && (
                        <div className="staking-form-layout__hint">
                            {hint}
                        </div>
                    )}
                </>
            )}
        </form>
    )
}
