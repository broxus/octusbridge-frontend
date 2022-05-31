import * as React from 'react'
import { useIntl } from 'react-intl'

import { Copy } from '@/components/common/Copy'
import { UserAvatar } from '@/components/common/UserAvatar'
import { RelayerStatus } from '@/modules/Relayers/components/RelayerStatus'
import { Status } from '@/modules/Relayers/types'
import { Icon } from '@/components/common/Icon'
import { sliceAddress } from '@/utils'

import './index.scss'

type Props = {
    address?: string;
    status?: Status;
    rank?: number;
}

export function RelayerCard({
    address,
    status,
    rank,
}: Props): JSX.Element | null {
    const intl = useIntl()
    const shortAddress = address ? sliceAddress(address) : undefined

    return (
        <div className="relayer-card">
            {address && (
                <div className="relayer-card__main">
                    <UserAvatar
                        size="large"
                        address={address}
                    />
                </div>
            )}

            <div className="relayer-card__side">
                {shortAddress && (
                    <div className="relayer-card__title">
                        <div className="relayer-card__name">
                            {intl.formatMessage({
                                id: 'RELAYER_HEADER_NAME',
                            }, {
                                address: shortAddress,
                            })}
                        </div>
                        {address && (
                            <Copy
                                text={address}
                                id={`copy-${address}`}
                                className="text-muted"
                            >
                                <Icon icon="copy" ratio={1.25} />
                            </Copy>
                        )}
                    </div>
                )}

                <div className="relayer-card__meta">
                    {status && (
                        <div className="relayer-card__status">
                            <RelayerStatus status={status} />
                        </div>
                    )}

                    {rank !== undefined && (
                        <div className="relayer-card__rank text-muted">
                            {intl.formatMessage({
                                id: 'RELAYER_RANK',
                            }, {
                                rank,
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
