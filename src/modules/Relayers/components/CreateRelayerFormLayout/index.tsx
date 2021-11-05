import * as React from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { ContentLoader } from '@/components/common/ContentLoader'

import './index.scss'

type Props = {
    children: React.ReactNode | React.ReactNodeArray;
    submitLabel: string;
    submitEnabled?: boolean;
    submitVisible?: boolean;
    submitLink?: string;
    isLoading?: boolean;
    isConnected?: boolean;
    onSubmit?: () => void;
    onConnect?: () => void;
}

export function CreateRelayerFormLayout({
    children,
    submitLabel,
    submitEnabled,
    submitVisible,
    submitLink,
    isLoading,
    isConnected,
    onSubmit: onSubmitCallback,
    onConnect,
}: Props): JSX.Element {
    const intl = useIntl()

    const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (isConnected) {
            onSubmitCallback?.()
        }
        else {
            onConnect?.()
        }
    }

    const onSubmit = () => {
        if (isConnected) {
            onSubmitCallback?.()
        }
        else {
            onConnect?.()
        }
    }

    return (
        <form
            onSubmit={onSubmitForm}
            className="create-relayer-form-layout"
        >
            <div className="card card--flat card--small create-relayer-form-layout__content">
                {children}
            </div>

            {isConnected ? (
                <>
                    {submitVisible && (
                        <div className="create-relayer-form-layout__action">
                            {submitLink ? (
                                <Link
                                    to={submitLink}
                                    className="btn btn--primary btn--lg"
                                >
                                    {submitLabel}
                                </Link>
                            ) : (
                                <Button
                                    disabled={!submitEnabled}
                                    size="lg"
                                    type="primary"
                                    onClick={onSubmit}
                                >
                                    {
                                        isLoading
                                            ? <ContentLoader slim />
                                            : submitLabel
                                    }
                                </Button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="create-relayer-form-layout__action">
                    <Button
                        disabled={isLoading}
                        size="lg"
                        type="primary"
                        onClick={onSubmit}
                    >
                        {
                            isLoading
                                ? <ContentLoader slim />
                                : intl.formatMessage({
                                    id: 'RELAYERS_CONNECT',
                                })
                        }
                    </Button>
                </div>
            )}
        </form>
    )
}
