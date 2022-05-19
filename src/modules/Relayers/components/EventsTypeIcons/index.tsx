import * as React from 'react'
import classNames from 'classnames'

import { Icon } from '@/components/common/Icon'
import { RelayersEventsTransferKind } from '@/modules/Relayers/types'

import './index.scss'

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

type Props = {
    size?: 'lg';
    chainId?: number;
    transferKind?: RelayersEventsTransferKind;
}

export function EventsTypeIcons({
    size,
    chainId,
    transferKind,
}: Props): JSX.Element {
    const iconFrom = transferKind && chainId
        ? getIconFrom(transferKind, chainId)
        : undefined
    const iconTo = transferKind && chainId
        ? getIconTo(transferKind, chainId)
        : undefined

    return (
        <div
            className={classNames('events-type-icons', {
                [`events-type-icons_size_${size}`]: size !== undefined,
            })}
        >
            <div className="events-type-icons__item">
                {iconFrom ? (
                    <Icon
                        icon={iconFrom}
                        ratio={1.25}
                    />
                ) : (
                    <span className="events-type-icons__blank" />
                )}
            </div>
            <div className="events-type-icons__item">
                {iconTo ? (
                    <Icon
                        icon={iconTo}
                        ratio={1.25}
                    />
                ) : (
                    <span className="events-type-icons__blank" />
                )}
            </div>
        </div>
    )
}
