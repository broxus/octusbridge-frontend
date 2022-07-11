import * as React from 'react'

import { AmountField } from '@/components/common/AmountField'
import { TokenIcon } from '@/components/common/TokenIcon'
import { BridgeAsset } from '@/stores/BridgeAssetsService'

import './index.scss'


type Props = {
    decimals?: number;
    disabled?: boolean;
    displayMaxButton?: boolean;
    isValid?: boolean;
    maxButtonLabel?: string;
    maxValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    suffix?: React.ReactNode;
    token?: BridgeAsset;
    size?: 'sm' | 'md' | 'lg';
    value?: string;
    onClickMax?: () => void;
    onChange?: (value: string) => void;
}


export function TokenAmountField({ token, ...props }: Props): JSX.Element {
    return (
        <AmountField
            className="token-amount-field"
            suffix={token !== undefined ? (
                <div className="amount-field-suffix">
                    <TokenIcon
                        address={token?.root}
                        size="small"
                        uri={token?.icon}
                    />
                    <span>{token?.symbol}</span>
                </div>
            ) : undefined}
            {...props}
        />
    )
}
