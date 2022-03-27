import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { TokenBadge } from '@/components/common/TokenBadge'
import { TransactionExplorerLink } from '@/components/common/TransactionExplorerLink'

import './index.scss'

export function EventInformation(): JSX.Element {
    const intl = useIntl()

    return (
        <Section>
            <Title>Event information</Title>

            <div className="event-information">
                <div className="card card--flat card--small">
                    <h3 className="event-information__title">
                        {intl.formatMessage({
                            id: 'EVENT_INFORMATION_TRANSFER_TITLE',
                        })}
                    </h3>

                    <ul className="summary">
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TOKEN',
                                })}
                            </span>
                            <span>
                                <TokenBadge
                                    address="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37"
                                    symbol="USDT"
                                    size="xsmall"
                                />
                            </span>
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_VALUE',
                                })}
                            </span>
                            200 000.00
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TIME',
                                })}
                            </span>
                            Jun 07, 2021, 17:22
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_ROUND',
                                })}
                            </span>
                            123
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_CONFIRMATION',
                                })}
                            </span>
                            0/70
                        </li>
                    </ul>
                </div>

                <div className="card card--flat card--small">
                    <h3 className="event-information__title">
                        {intl.formatMessage({
                            id: 'EVENT_INFORMATION_ADDRESSES_TITLE',
                        })}
                    </h3>

                    <ul className="summary">
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_ORIGINAL_ADDRESS',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_ADDRESS',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_TON_TRANSACTION',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_ETH_TRANSACTION',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li>
                    </ul>
                </div>
            </div>
        </Section>
    )
}
