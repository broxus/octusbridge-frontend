import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { RelayerCard } from '@/modules/Relayers/components/RelayerCard'
import { ExternalLink, HeaderAction, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'
import { RelayerStoreContext } from '@/modules/Relayers/providers/RelayerStoreProvider'
import { STAKING_LOCATION } from '@/modules/Staking/constants'

export function RelayerHeader(): JSX.Element | null {
    const intl = useIntl()
    const relayer = React.useContext(RelayerStoreContext)

    if (!relayer || !relayer.address) {
        return null
    }

    return (
        <HeaderLayout>
            <RelayerCard
                rank={relayer.rank}
                address={relayer.address}
                status={relayer.status}
            />

            <HeaderAction>
                {relayer.explorerLink && (
                    <ExternalLink link={relayer.explorerLink} />
                )}

                {relayer.isAdmin && (
                    <Button
                        type="secondary"
                        size="md"
                    >
                        {intl.formatMessage({
                            id: 'RELAYER_HEADER_SETTINGS',
                        })}
                    </Button>
                )}

                <Button
                    link={STAKING_LOCATION}
                    type="primary"
                    size="md"
                >
                    {intl.formatMessage({
                        id: 'RELAYER_HEADER_UP_STAKE',
                    })}
                </Button>
            </HeaderAction>
        </HeaderLayout>
    )
}
