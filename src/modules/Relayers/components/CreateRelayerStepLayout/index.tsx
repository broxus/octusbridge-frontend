import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'
import './index.scss'

type Props = {
    step: string;
    title: string;
    hint: string;
    isLoading?: boolean;
    children: React.ReactNode;
}

export function CreateRelayerStepLayout({
    step,
    title,
    hint,
    isLoading,
    children,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="create-relayer-step-layout">
            {isLoading ? (
                <div className="create-relayer-step-layout__loader">
                    <ContentLoader slim />
                </div>
            ) : (
                <>
                    <div className="create-relayer-step-layout__header">
                        <h2 className="section-title">
                            <div className="small">
                                {intl.formatMessage({
                                    id: 'RELAYERS_CREATE_STEP',
                                }, {
                                    value: step,
                                })}
                            </div>

                            {title}
                        </h2>

                        <p>{hint}</p>
                    </div>

                    {children}
                </>
            )}
        </div>
    )
}
