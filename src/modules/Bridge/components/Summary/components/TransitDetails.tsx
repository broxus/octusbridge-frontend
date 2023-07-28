import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useSummary } from '@/modules/Bridge/providers'

export function TransitDetails(): JSX.Element {
    const intl = useIntl()
    const summary = useSummary()

    return (
        <Observer>
            {() => (
                <React.Fragment key="transit">
                    {(summary.isEvmEvm && summary.tvmAddress !== undefined) && (
                        <li key="everscale-address">
                            <div className="text-muted">
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_SUMMARY_EVERSCALE_ADDRESS',
                                })}
                            </div>
                            <div className="text-truncate">
                                <EverscanAccountLink
                                    key="everscale-address"
                                    address={summary.tvmAddress}
                                    copy
                                />
                            </div>
                        </li>
                    )}
                </React.Fragment>
            )}
        </Observer>
    )
}
