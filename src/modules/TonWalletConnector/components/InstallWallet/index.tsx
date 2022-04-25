import * as React from 'react'
import { useIntl } from 'react-intl'

export function InstallWallet(): JSX.Element {
    const intl = useIntl()

    return (
        <>
            <div
                className="connect-panel-text"
                dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({ id: 'WALLET_INSTALLATION_NOTE' }),
                }}
            />
            <a
                className="btn btn--secondary btn--md"
                href="https://chrome.google.com/webstore/detail/ever-wallet/cgeeodpfagjceefieflmdfphplkenlfk"
                target="_blank"
                rel="nofollow noopener noreferrer"
            >
                {intl.formatMessage({ id: 'WALLET_INSTALLATION_LINK_TEXT' })}
            </a>
        </>
    )
}
