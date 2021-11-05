import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { ContentLoader } from '@/components/common/ContentLoader'

type Props = {
    isConnected: boolean;
    isLoading: boolean;
    amountIsValid: boolean;
    onClickConnect: () => void;
    onSubmit: () => void;
}

export function AccountSubmit({
    isConnected,
    isLoading,
    amountIsValid,
    onClickConnect,
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()

    return isConnected ? (
        <Button
            block
            size="lg"
            type="primary"
            disabled={isLoading || !amountIsValid}
            onClick={onSubmit}
        >
            {isLoading ? (
                <ContentLoader slim />
            ) : (
                intl.formatMessage({
                    id: 'STAKING_ACCOUNT_FORM_SUBMIT',
                })
            )}
        </Button>
    ) : (
        <Button
            block
            size="lg"
            type="primary"
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
        </Button>
    )
}
