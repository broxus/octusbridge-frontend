import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
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
                                className="rc-select-assets rc-select--md"
                                // filterSort={(a, b) => a.search.localeCompare(b.search)}
                                optionFilterProp="search"
                                options={bridge.tokens.map(({
                                    icon,
                                    name,
                                    root,
                                    symbol,
                                }) => ({
                                    label: (
                                        <div className="token-select-label">
                                            <TokenIcon
                                                address={root}
                                                size="xsmall"
                                                uri={icon}
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
                                    search: `${symbol} ${name}`,
                                    value: root,
                                }))}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                                })}
                                value={bridge.token?.root}
                                showSearch
                                virtual
                                onChange={onChangeToken}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <>
                                {bridge.pipeline?.isBlacklisted && (
                                    <Alert
                                        className="margin-top"
                                        text={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TEXT',
                                        }, {
                                            blockchain: bridge.rightNetwork?.label,
                                            symbol: bridge.token?.symbol,
                                        }, { ignoreTag: true })}
                                        title={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TITLE',
                                        })}
                                        type="danger"
                                    />
                                )}
                            </>
                        )}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
