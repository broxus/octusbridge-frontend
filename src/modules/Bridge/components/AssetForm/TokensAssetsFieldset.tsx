import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Select } from '@/components/common/Select'
import { TokenIcon } from '@/components/common/TokenIcon'
import { useBridge } from '@/modules/Bridge/providers'


export function TokensAssetsFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const onChangeToken = (value?: string) => {
        bridge.setData('selectedToken', value)
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
                    <Observer>
                        {() => (
                            <Select
                                className="rc-select--md"
                                options={bridge.tokens.map(({ icon, root, symbol }) => ({
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
                        )}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
