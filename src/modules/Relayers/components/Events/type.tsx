import * as React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { Icon } from '@/components/common/Icon'
import { RelayersEventsTransferKind } from '@/modules/Relayers/types'
import { getEventFromName, getEventToName } from '@/modules/Relayers/utils'

import './index.scss'

type Props = {
    chainId: number;
    transferKind: RelayersEventsTransferKind;
    contractAddress: string;
}

function getWalletIcon(chainId: number): string | undefined {
    return `evm${chainId}BlockchainIcon`
}

function getIconFrom(transferKind: RelayersEventsTransferKind, chainId: number): string | undefined {
    if (transferKind === 'tontoeth') {
        return 'everCoinIcon'
    }
    if (transferKind === 'ethtoton' || transferKind === 'creditethtoton') {
        return getWalletIcon(chainId)
    }
    return undefined
}

function getIconTo(transferKind: RelayersEventsTransferKind, chainId: number): string | undefined {
    if (transferKind === 'ethtoton' || transferKind === 'creditethtoton') {
        return 'everCoinIcon'
    }
    if (transferKind === 'tontoeth') {
        return getWalletIcon(chainId)
    }
    return undefined
}

export function EventType({
    chainId,
    transferKind,
    contractAddress,
}: Props): JSX.Element {
    const intl = useIntl()
    const iconFrom = getIconFrom(transferKind, chainId)
    const iconTo = getIconTo(transferKind, chainId)
    const fromName = getEventFromName(transferKind, chainId)
    const toName = getEventToName(transferKind, chainId)

    return (
        <div className="events-type">
            <div className="events-type-icons">
                <div className="events-type-icons__item">
                    {iconFrom && (
                        <Icon icon={iconFrom} ratio={1.25} />
                    )}
                </div>
                <div className="events-type-icons__item">
                    {iconTo && (
                        <Icon icon={iconTo} ratio={1.25} />
                    )}
                </div>
            </div>

            <div className="events-type__main">
                <div className="events-type__type">
                    <Link to={`/relayers/event/${contractAddress}`}>
                        {intl.formatMessage({
                            id: 'EVENTS_TYPE_TRANSFER',
                        })}
                    </Link>
                </div>

                <div className="events-type__info">
                    {intl.formatMessage({
                        id: 'EVENTS_TYPE_INFO',
                    }, {
                        left: fromName || intl.formatMessage({
                            id: 'NA',
                        }),
                        right: toName || intl.formatMessage({
                            id: 'NA',
                        }),
                    })}
                </div>
            </div>

            {/* {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="events-type__link"
                >
                    <Icon icon="externalLink" ratio={0.7} />
                </a>
            )} */}
        </div>
    )
}
