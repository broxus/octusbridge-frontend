import * as React from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

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
    onSubmit,
    onConnect,
}: Props): JSX.Element {
    const intl = useIntl()

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isConnected) {
            onSubmit?.()
        }
        else {
            onConnect?.()
        }
    }

    return (
        <form
            onSubmit={submit}
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
                                    className="btn btn-lg btn--primary"
                                >
                                    {submitLabel}
                                </Link>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn btn-lg btn--primary"
                                    disabled={!submitEnabled}
                                >
                                    {
                                        isLoading
                                            ? <ContentLoader slim />
                                            : submitLabel
                                    }
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="create-relayer-form-layout__action">
                    <button
                        type="submit"
                        className="btn btn-lg btn--primary"
                        disabled={isLoading}
                    >
                        {
                            isLoading
                                ? <ContentLoader slim />
                                : intl.formatMessage({
                                    id: 'RELAYERS_CONNECT',
                                })
                        }
                    </button>
                </div>
            )}
        </form>
    )
}
