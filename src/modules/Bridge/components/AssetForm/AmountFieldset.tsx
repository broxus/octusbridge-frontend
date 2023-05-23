import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { AmountField } from '@/components/common/AmountField'
import { EverSafeAmount } from '@/config'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount, isGoodBignumber } from '@/utils'


export function AmountFieldset(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const everWallet = bridge.useEverWallet

    const onChange = (value: string): void => {
        bridge.setData('amount', value)
    }

    const getMaxValue = (): string => {
        if (bridge.isFromEverscale && bridge.isNativeEverscaleCurrency) {
            const value = new BigNumber(bridge.token?.balance || 0)
                .plus(everWallet.balance || 0)
                .minus(bridge.isSwapEnabled
                    ? (bridge.minEversAmount ?? EverSafeAmount)
                    : EverSafeAmount)
                .shiftedBy(-everWallet.coin.decimals)
                .toFixed()
            return isGoodBignumber(value) ? value : '0'
        }
        const decimals = bridge.isFromEvm ? bridge.amountMinDecimals : bridge.decimals
        const value = new BigNumber(bridge.balance || 0)
        if (!isGoodBignumber(value)) {
            return '0'
        }
        if (bridge.decimals !== undefined && decimals !== undefined) {
            return value
                .shiftedBy(-bridge.decimals)
                .dp(decimals, BigNumber.ROUND_DOWN)
                .toFixed()
        }
        return '0'
    }

    const onMaximize = (): void => {
        onChange(getMaxValue())
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
                                onClickMax={(bridge.isFetching || bridge.isLocked) ? undefined : onMaximize}
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

                                    case !bridge.isAmountMaxValueValid:
                                        return (
                                            <span className="text-danger">
                                                {intl.formatMessage({
                                                    id: isGoodBignumber(getMaxValue() || 0)
                                                        ? 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_AMOUNT_HINT'
                                                        : 'CROSSCHAIN_TRANSFER_ASSET_INVALID_AMOUNT_HINT',
                                                }, {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        getMaxValue(),
                                                        undefined,
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
                            <React.Fragment key="amount-exceed-vault-balance">
                                {(
                                    (
                                        bridge.vaultBalance !== undefined
                                        || bridge.pipeline?.mergePoolAddress !== undefined
                                    )
                                    && bridge.isInsufficientVaultBalance
                                    && !bridge.isEverscaleBasedToken
                                    && !bridge.isLocked
                                    && bridge.pendingWithdrawals === undefined
                                    && (bridge.isEverscaleToEvm || bridge.isEverscaleToSolana || bridge.isEvmToEvm)
                                ) && (
                                    <Alert
                                        className="margin-top"
                                        text={bridge.isEverscaleToSolana ? undefined : intl.formatMessage({
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
                                        })}
                                        type="warning"
                                    />
                                )}
                            </React.Fragment>
                        )}
                    </Observer>

                    {process.env.NODE_ENV !== 'production' && (
                        <>
                            <div className="crosschain-transfer__control-hint">
                                <Observer>
                                    {() => (
                                        <>
                                            {'> Max value: '}
                                            {formattedAmount(
                                                getMaxValue() || 0,
                                                undefined,
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
