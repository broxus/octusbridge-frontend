import * as React from 'react'
import { useIntl } from 'react-intl'

import { Breadcrumb, Item } from '@/components/common/Breadcrumb'
import { RELAYER_EXPLORER_LOCATION } from '@/modules/Relayers/constants'

type Props = {
    items: Item[],
}

export function ExplorerBreadcrumb({
    items,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <Breadcrumb
            items={[{
                title: intl.formatMessage({
                    id: 'RELAYERS_BREADCRUMB_EXPLORER',
                }),
                link: RELAYER_EXPLORER_LOCATION,
            }, ...items]}
        />
    )
}
