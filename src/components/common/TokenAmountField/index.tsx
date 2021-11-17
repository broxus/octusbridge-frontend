import * as React from 'react'

import { AmountField } from '@/components/common/AmountField'
import { TokenCache } from '@/stores/TokensCacheService'
import { TokenIcon } from '@/components/common/TokenIcon'

import './index.scss'


type Props = {
    decimals?: number;
    disabled?: boolean;
    isValid?: boolean;
    placeholder?: string;
    suffix?: React.ReactNode;
    token?: TokenCache;
    value?: string;
    onChange?: (value: string) => void;
}


export function TokenAmountField({ token, ...props }: Props): JSX.Element {
    return (
        <AmountField
            className="token-amount-field"
            suffix={(
                <div className="amount-field-suffix">
                    <TokenIcon
                        address={token?.root}
                        size="small"
                        uri={token?.icon}
                    />
                    <span>{token?.symbol}</span>
                </div>
            )}
            {...props}
            displayMaxButton={false}
        />
    )
}
