import * as React from 'react'
import { useIntl } from 'react-intl'

import { ContentLoader } from '@/components/common/ContentLoader'

type Props = {
    isConnected: boolean;
    isLoading: boolean;
    amountIsValid: boolean;
    onClickConnect: () => void;
}

export function AccountSubmit({
    isConnected,
    isLoading,
    amountIsValid,
    onClickConnect,
}: Props): JSX.Element {
    const intl = useIntl()

    return isConnected ? (
        <button
            type="submit"
            className="btn btn--primary btn-lg btn-block"
            disabled={isLoading || !amountIsValid}
        >
            {isLoading ? (
                <ContentLoader slim />
            ) : (
                intl.formatMessage({
                    id: 'STAKING_ACCOUNT_FORM_SUBMIT',
                })
            )}
        </button>
    ) : (
        <button
            type="button"
            className="btn btn--primary btn-lg btn-block"
            disabled={isLoading}
            onClick={onClickConnect}
        >
            {isLoading ? (
                <ContentLoader slim />
            ) : (
                intl.formatMessage({
                    id: 'STAKING_ACCOUNT_FORM_CONNECT',
                })
            )}
        </button>
    )
}
