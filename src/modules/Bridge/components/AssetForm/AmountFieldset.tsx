import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { AmountField } from '@/components/common/AmountField'
import { useBridge } from '@/modules/Bridge/providers'
import {
    debounce,
    formattedAmount,
    isGoodBignumber,
} from '@/utils'


export function AmountFieldset(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()

    const onChangeAmount = debounce(() => {
        (async () => {
            await bridge.onChangeAmount()
        })()
    }, 50)

    const onChange = (value: string) => {
        bridge.setData('amount', value)

        if (bridge.isSwapEnabled || bridge.isEvmToEvm) {
            onChangeAmount()
        }
    }

    const onClickMax = () => {
        const decimals = bridge.isFromEvm ? bridge.amountMinDecimals : bridge.decimals
        let formattedBalance = new BigNumber(bridge.balance || 0)
        if (!isGoodBignumber(formattedBalance)) {
            return
        }
        if (bridge.decimals !== undefined && decimals !== undefined) {
            formattedBalance = formattedBalance
                .shiftedBy(-bridge.decimals)
                .dp(decimals, BigNumber.ROUND_DOWN)
        }
        onChange(formattedBalance.toFixed())
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <AmountField
                                decimals={bridge.isFromEvm ? bridge.amountMinDecimals : bridge.decimals}
                                disabled={bridge.isFetching || bridge.isLocked || bridge.token === undefined}
                                displayMaxButton={bridge.balance !== undefined && bridge.balance !== '0'}
                                isValid={bridge.isAmountValid}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_PLACEHOLDER',
                                })}
                                size="md"
                                value={bridge.amount}
                                onChange={(bridge.isFetching || bridge.isLocked) ? undefined : onChange}
                                onClickMax={(bridge.isFetching || bridge.isLocked) ? undefined : onClickMax}
                            />
                        )}
                    </Observer>

                    <div className="crosschain-transfer__control-hint">
                        <Observer>
                            {() => {
                                switch (true) {
                                    case bridge.isEvmToEverscale && bridge.isAmountVaultLimitExceed:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_VAULT_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.vaultLimitNumber.toFixed(),
                                                        bridge.amountMinDecimals,
                                                        { preserve: true },
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case !bridge.isAmountMinValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.minAmount || 0,
                                                        bridge.amountMinDecimals,
                                                        { preserve: true },
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case !bridge.isAmountMaxValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: isGoodBignumber(bridge.balance || 0)
                                                        ? 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_AMOUNT_HINT'
                                                        : 'CROSSCHAIN_TRANSFER_ASSET_INVALID_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.balance,
                                                        bridge.decimals,
                                                        { preserve: true },
                                                    ),
                                                })}
                                            </span>
                                        )

                                    case bridge.token !== undefined:
                                        return (
                                            <>
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_BALANCE_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.balance,
                                                        bridge.decimals,
                                                        { preserve: true },
                                                    ),
                                                })}
                                            </>
                                        )

                                    default:
                                        return <>&nbsp;</>
                                }
                            }}
                        </Observer>
                    </div>

                    <Observer>
                        {() => (
                            <>
                                {(
                                    (
                                        !bridge.pipeline?.isMultiVault
                                        || bridge.vaultBalance !== undefined
                                        || bridge.pipeline.mergePoolAddress !== undefined
                                    )
                                    && bridge.isInsufficientVaultBalance
                                    && !bridge.isEverscaleBasedToken
                                    && !bridge.isLocked
                                    && bridge.pendingWithdrawals === undefined
                                    && (bridge.isFromEverscale || bridge.isEvmToEvm)
                                ) && (
                                    <Alert
                                        className="margin-top"
                                        text={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_EXCEED_VAULT_BALANCE_TEXT',
                                        })}
                                        title={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_EXCEED_VAULT_BALANCE_TITLE',
                                        }, {
                                            symbol: bridge.token?.symbol,
                                            value: formattedAmount(
                                                bridge.vaultBalance,
                                                bridge.vaultBalanceDecimals,
                                            ),
                                        }, {
                                            ignoreTag: true,
                                        })}
                                        type="warning"
                                    />
                                )}
                            </>
                        )}
                    </Observer>

                    {process.env.NODE_ENV !== 'production' && (
                        <>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Min value: '}
                                            {formattedAmount(
                                                bridge.minAmount || 0,
                                                bridge.isFromEvm ? bridge.amountMinDecimals : bridge.decimals,
                                                { preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Max value: '}
                                            {formattedAmount(
                                                bridge.balance || 0,
                                                bridge.decimals,
                                                { preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Pending withdrawals amount: '}
                                            {bridge.pendingWithdrawalsAmount && formattedAmount(
                                                bridge.pendingWithdrawalsAmount,
                                                bridge.decimals,
                                                { preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Pending withdrawals bounty: '}
                                            {bridge.pendingWithdrawalsBounty && formattedAmount(
                                                bridge.pendingWithdrawalsBounty,
                                                bridge.decimals,
                                                { preserve: true },
                                            )}
                                        </>
                                    )}
                                </Observer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </fieldset>
    )
}
