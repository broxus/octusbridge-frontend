import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { AmountField } from '@/components/common/AmountField'
import { Select } from '@/components/common/Select'
import { useBridge } from '@/modules/Bridge/providers'
import { useSummary } from '@/modules/Bridge/stores/TransferSummary'
import { debounce, formattedAmount, isGoodBignumber } from '@/utils'
import { TokenIcon } from '@/components/common/TokenIcon'


export function AssetForm(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const summary = useSummary()
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

    const changeAmountRecalculate = debounce(() => {
        (async () => {
            await bridge.onChangeAmount()
        })()
    }, 400)

    const onChangeAmount = (value: string) => {
        bridge.changeData('amount', value)
        if (bridge.isSwapEnabled) {
            changeAmountRecalculate()
        }
    }

    const onChangeToken = (value?: string) => {
        bridge.changeData('selectedToken', value)
    }

    const onClickMax = () => {
        let formattedBalance = new BigNumber(bridge.balance || 0)
        if (!isGoodBignumber(formattedBalance)) {
            return
        }
        if (bridge.decimals !== undefined) {
            formattedBalance = formattedBalance.shiftedBy(-bridge.decimals)
        }
        onChangeAmount(formattedBalance.toFixed())
    }

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_ASSET_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
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
                                optionLabelProp="displayLabel"
                                options={tokens.map(({ icon, root, symbol }) => ({
                                    label: (
                                        <div className="token-select-label">
                                            <TokenIcon
                                                address={root}
                                                uri={icon}
                                                size="xsmall"
                                            />
                                            <div>{symbol}</div>
                                        </div>
                                    ),
                                    value: root,
                                    displayLabel: (
                                        <div className="token-select-label">
                                            <TokenIcon
                                                address={root}
                                                uri={icon}
                                                size="xsmall"
                                            />
                                            <div>{symbol}</div>
                                            <div className="token-select-label__badge">
                                                <span>
                                                    {bridge.isEvmToTon ? 'ERC20' : 'TIP3'}
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                }))}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                                })}
                                value={bridge.token?.root}
                                onChange={onChangeToken}
                            />
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {summary.vaultBalance !== undefined
                                                ? intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_VAULT_BALANCE_HINT',
                                                }, {
                                                    symbol: summary.token?.symbol,
                                                    value: formattedAmount(
                                                        summary.vaultBalance || 0,
                                                        summary.vaultDecimals,
                                                    ),
                                                })
                                                : <>&nbsp;</>}
                                        </>
                                    )}
                                </Observer>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_LABEL',
                        })}
                    </legend>
                    <div className="crosschain-transfer__controls">
                        <Observer>
                            {() => (
                                <div className="crosschain-transfer__control">
                                    <AmountField
                                        decimals={bridge.decimals}
                                        disabled={bridge.token === undefined}
                                        displayMaxButton={bridge.balance !== undefined && bridge.balance !== '0'}
                                        isValid={bridge.isAmountValid}
                                        maxValue={bridge.balance}
                                        placeholder={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_PLACEHOLDER',
                                        })}
                                        value={bridge.amount}
                                        onClickMax={onClickMax}
                                        onChange={onChangeAmount}
                                    />
                                    <div className="crosschain-transfer__control-hint">
                                        <Observer>
                                            {() => (
                                                <>
                                                    {bridge.token !== undefined
                                                        ? intl.formatMessage({
                                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_BALANCE_HINT',
                                                        }, {
                                                            symbol: bridge.token?.symbol,
                                                            value: formattedAmount(
                                                                bridge.balance || 0,
                                                                bridge.decimals,
                                                            ),
                                                        })
                                                        : <>&nbsp;</>}
                                                </>
                                            )}
                                        </Observer>
                                    </div>
                                </div>
                            )}
                        </Observer>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
