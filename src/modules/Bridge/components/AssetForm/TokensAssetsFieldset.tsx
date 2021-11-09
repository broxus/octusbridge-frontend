import * as React from 'react'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { TokenIcon } from '@/components/common/TokenIcon'
import { useBridge } from '@/modules/Bridge/providers'


export function TokensAssetsFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const tokensCache = bridge.useTokensCache

    const tokens = React.useMemo(() => {
        if (bridge.isEvmToTon && bridge.leftNetwork?.chainId !== undefined) {
            return tokensCache.filterTokensByChainId(bridge.leftNetwork.chainId)
        }

        if (bridge.isTonToEvm && bridge.rightNetwork?.chainId !== undefined) {
            return tokensCache.filterTokensByChainId(bridge.rightNetwork.chainId)
        }

        return []
    }, [bridge.leftNetwork?.chainId, bridge.rightNetwork?.chainId])

    const onChangeToken = (value?: string) => {
        bridge.changeData('selectedToken', value)
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Select
                        className="rc-select--lg"
                        options={tokens.map(({ icon, root, symbol }) => ({
                            label: (
                                <div className="token-select-label">
                                    <TokenIcon
                                        address={root}
                                        uri={icon}
                                        size="xsmall"
                                    />
                                    <div className="token-select-label__symbol text-truncate">
                                        {symbol}
                                    </div>
                                    {bridge.leftNetwork?.tokenType !== undefined && (
                                        <div className="token-select-label__badge">
                                            <span>
                                                {bridge.leftNetwork?.tokenType}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ),
                            value: root,
                        }))}
                        placeholder={intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                        })}
                        value={bridge.token?.root}
                        onChange={onChangeToken}
                    />
                </div>
            </div>
        </fieldset>
    )
}
