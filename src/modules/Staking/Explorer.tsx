import * as React from 'react'
import { useIntl } from 'react-intl'

import { Breadcrumb } from '@/components/common/Breadcrumb'
import { CommonStats } from '@/modules/Staking/components/CommonStats'
import { Stakeholders } from '@/modules/Staking/components/Stakeholders'
import { useScrollTop } from '@/hooks/useScrollTop'

export function Explorer(): JSX.Element {
    const intl = useIntl()

    useScrollTop()

    return (
        <>
            <Breadcrumb
                items={[{
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_ROOT',
                    }),
                    link: '/staking',
                }, {
                    title: intl.formatMessage({
                        id: 'STAKING_BREADCRUMB_EXPLORER',
                    }),
                }]}
            />
            <CommonStats />
            <Stakeholders />
        </>
    )
}
