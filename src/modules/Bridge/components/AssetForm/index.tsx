import * as React from 'react'
import { useIntl } from 'react-intl'

import { AmountFieldset } from '@/modules/Bridge/components/AssetForm/AmountFieldset'
import { MinReceiveTokensFieldset } from '@/modules/Bridge/components/AssetForm/MinReceiveTokensFieldset'
import { TokensAssetsFieldset } from '@/modules/Bridge/components/AssetForm/TokensAssetsFieldset'
import { useBridge } from '@/modules/Bridge/providers'


export function AssetForm(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

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

                {bridge.isEvmToEvm && (
                    <MinReceiveTokensFieldset />
                )}
            </form>
        </div>
    )
}
