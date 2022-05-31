import * as React from 'react'

import { Pagination } from '@/components/common/Pagination'
import { RoundCard } from '@/modules/Relayers/components/RoundCard'
import { HeaderLayout } from '@/modules/Relayers/components/HeaderLayout'

import './index.scss'

type Props = {
    title: string;
    paginationLabel: string;
    address?: string;
    startTime?: number;
    endTime?: number;
    roundNum?: number;
    totalPages?: number;
    onSubmitRound: (roundNum: number) => void;
}

export function RoundHeader({
    title,
    paginationLabel,
    address,
    startTime,
    endTime,
    roundNum,
    totalPages,
    onSubmitRound,
}: Props): JSX.Element {
    return (
        <HeaderLayout>
            <RoundCard
                title={title}
                address={address}
                startTime={startTime}
                endTime={endTime}
                size="lg"
            />

            {roundNum !== undefined && (
                <Pagination
                    size="md"
                    label={paginationLabel}
                    page={roundNum}
                    totalPages={totalPages}
                    onSubmit={onSubmitRound}
                    className="round-header__pagination"
                />
            )}

        </HeaderLayout>
    )
}
