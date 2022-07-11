import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Section, Title } from '@/components/common/Section'
import { TokenBadge } from '@/components/common/TokenBadge'
import { FromAddress } from '@/modules/Relayers/components/Events/FromAddress'
import { ToAddress } from '@/modules/Relayers/components/Events/ToAddress'
import { useTransferEventContext } from '@/modules/Relayers/providers'
import { useTokensCache } from '@/stores/TokensCacheService'
import { dateFormat, formattedTokenAmount } from '@/utils'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'

import './index.scss'

function EventInformationInner(): JSX.Element {
    const intl = useIntl()
    const tokensCache = useTokensCache()
    const { event } = useTransferEventContext()
    const token = event ? tokensCache.get(event?.tokenAddress) : undefined

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <Section>
            <Title>
                {intl.formatMessage({
                    id: 'EVENT_INFO_TITLE',
                })}
            </Title>

            <div className="tiles tiles_twice event-information">
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
                                {token ? (
                                    <TokenBadge
                                        size="xsmall"
                                        address={token.root}
                                        symbol={token?.symbol}
                                        uri={token.icon}
                                    />
                                ) : noValue}
                            </span>
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_VALUE',
                                })}
                            </span>

                            {event ? formattedTokenAmount(event.amount) : noValue}
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TIME',
                                })}
                            </span>

                            {event ? dateFormat(event.timestamp) : noValue}
                        </li>
                        {/* <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_ROUND',
                                })}
                            </span>
                            <span className="event-information__soon">
                                {soon}
                            </span>
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_CONFIRMATION',
                                })}
                            </span>
                            <span className="event-information__soon">
                                {soon}
                            </span>
                        </li> */}
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
                                    id: 'EVENT_INFORMATION_CONTRACT_ADDRESS',
                                })}
                            </span>
                            {event?.contractAddress ? (
                                <EverscanAccountLink
                                    copy
                                    address={event.contractAddress}
                                />
                            ) : (
                                noValue
                            )}
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_FROM',
                                })}
                            </span>
                            {event ? (
                                <FromAddress item={event} />
                            ) : (
                                noValue
                            )}
                        </li>
                        <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TO',
                                })}
                            </span>
                            {event ? (
                                <ToAddress item={event} />
                            ) : (
                                noValue
                            )}
                        </li>
                        {/* <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_ADDRESS',
                                })}
                            </span>
                            <span className="event-information__soon">{soon}</span>
                        </li> */}
                        {/* <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_TON_TRANSACTION',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li> */}
                        {/* <li>
                            <span className="text-muted">
                                {intl.formatMessage({
                                    id: 'EVENT_INFORMATION_TARGET_ETH_TRANSACTION',
                                })}
                            </span>
                            <TransactionExplorerLink id="0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37" />
                        </li> */}
                    </ul>
                </div>
            </div>
        </Section>
    )
}

export const EventInformation = observer(EventInformationInner)
