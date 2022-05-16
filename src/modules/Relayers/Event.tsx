import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Relayers } from '@/modules/Relayers/components/Relayers'
import { ContentLoader } from '@/components/common/ContentLoader'
import { Container } from '@/components/common/Section'
import { EventInformation } from '@/modules/Relayers/components/EventInformation'
import { ExplorerBreadcrumb } from '@/modules/Relayers/components/ExplorerBreadcrumb'
import { EventHeader } from '@/modules/Relayers/components/EventHeader'
import { RelayersProvider, useTransferEventContext } from '@/modules/Relayers/providers'
import { sliceAddress } from '@/utils'

type Params = {
    contractAddress: string;
}

export function EventInner(): JSX.Element {
    const intl = useIntl()
    const params = useParams<Params>()
    const transferEvent = useTransferEventContext()
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        transferEvent.fetch(params.contractAddress)
    }, [params.contractAddress])

    React.useEffect(() => {
        if (transferEvent.isLoading !== undefined) {
            setLoading(transferEvent.isLoading)
        }
    }, [transferEvent.isLoading])

    if (loading) {
        return (
            <ContentLoader transparent />
        )
    }

    return (
        <Container size="lg">
            <ExplorerBreadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'EVENT_PAGE_TITLE',
                    }, {
                        contract: sliceAddress(params.contractAddress),
                    }),
                }]}
            />

            <EventHeader />

            <EventInformation />

            <RelayersProvider>
                <Relayers
                    transferContractAddress={params.contractAddress}
                />
            </RelayersProvider>
        </Container>
    )
}

export const Event = observer(EventInner)
