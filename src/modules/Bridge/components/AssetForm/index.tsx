import * as React from 'react'
import { useIntl } from 'react-intl'

import { AmountFieldset } from '@/modules/Bridge/components/AssetForm/AmountFieldset'
import { TokensAssetsFieldset } from '@/modules/Bridge/components/AssetForm/TokensAssetsFieldset'


export function AssetForm(): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_ASSET_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <TokensAssetsFieldset />

                <AmountFieldset />
            </form>
        </div>
    )
}
