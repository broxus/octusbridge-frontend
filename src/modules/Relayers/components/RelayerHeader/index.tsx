import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/common/Button'
import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { RelayerCard } from '@/modules/Relayers/components/RelayerCard'
import { ExternalLinkIcon, HeaderAction, HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'
import { useUserDataContext } from '@/modules/Relayers/providers'

export function RelayerHeader(): JSX.Element {
    const intl = useIntl()
    const params = useParams<any>()
    const userData = useUserDataContext()

    return (
        <HeaderLayout>
            <Observer>
                {() => (
                    <RelayerCard
                        address={params.address}
                    />
                )}
            </Observer>

            <HeaderAction>
                <EverscanAccountLink address={params.address}>
                    <ExternalLinkIcon />
                </EverscanAccountLink>

                <Observer>
                    {() => (
                        <>
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
                        </>
                    )}
                </Observer>
            </HeaderAction>
        </HeaderLayout>
    )
}
