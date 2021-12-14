import * as React from 'react'
import { useIntl } from 'react-intl'

import { Pagination } from '@/components/common/Pagination'
import { RoundCard } from '@/modules/Relayers/components/RoundCard'
import { HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'

import './index.scss'

type Props = {
    title: string;
    type: 'validation' | 'bidding';
}

export function RoundHeader({
    title,
    type,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <HeaderLayout>
            <RoundCard
                title={title}
                address="0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1"
                startTime={new Date().getTime()}
                endTime={new Date().getTime() + 880000000}
                size="lg"
            />

            <Pagination
                current={123}
                limit={124}
                label={intl.formatMessage({
                    id: type === 'bidding'
                        ? 'BIDDING_ROUND_HEADER_PAGINATION'
                        : 'VALIDATION_ROUND_HEADER_PAGINATION',
                })}
                size="lg"
                onSubmit={() => {}}
            />
        </HeaderLayout>
    )
}
