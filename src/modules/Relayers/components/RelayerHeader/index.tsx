import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { RelayerCard } from '@/modules/Relayers/components/RelayerCard'
import { ExternalLinkIcon, HeaderAction, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'
import { useRelayInfoContext, useUserDataContext } from '@/modules/Relayers/providers'

export function RelayerHeader(): JSX.Element {
    const intl = useIntl()
    const relayInfo = useRelayInfoContext()
    const userData = useUserDataContext()

    return (
        <HeaderLayout>
            <RelayerCard
                address={relayInfo.address}
            />

            <HeaderAction>
                {relayInfo.address && (
                    <EverscanAccountLink address={relayInfo.address}>
                        <ExternalLinkIcon />
                    </EverscanAccountLink>
                )}

                {userData.isRelay && (
                    <Button
                        link="/staking/my"
                        type="primary"
                        size="md"
                    >
                        {intl.formatMessage({
                            id: 'RELAYER_HEADER_UP_STAKE',
                        })}
                    </Button>
                )}
            </HeaderAction>
        </HeaderLayout>
    )
}
