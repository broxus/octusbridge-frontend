import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { TokenAmount } from '@/components/common/TokenAmount'
import { Transfer } from '@/modules/Transfers/types'
import { getAmount, getCurrencyAddress } from '@/modules/Transfers/utils'
import { useTokensCache } from '@/stores/TokensCacheService'

type Props = {
    transfer: Transfer;
}

export function AmountInner({
    transfer,
}: Props): JSX.Element {
    const intl = useIntl()
    const tokensCache = useTokensCache()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    const amount = getAmount(transfer)
    const currencyAddress = getCurrencyAddress(transfer)

    return (
        <>
            {currencyAddress && amount ? (
                <TokenAmount
                    address={currencyAddress}
                    uri={tokensCache.get(currencyAddress)?.icon}
                    symbol={tokensCache.get(currencyAddress)?.symbol}
                    amount={amount}
                />
            ) : (
                noValue
            )}
        </>
    )
}

export const Amount = observer(AmountInner)
