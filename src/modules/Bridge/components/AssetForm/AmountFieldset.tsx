import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { AmountField } from '@/components/common/AmountField'
import { OptionSwitcher } from '@/components/common/OptionSwitcher'
import { Skeleton } from '@/components/common/Skeleton'
import { useBridge } from '@/modules/Bridge/providers'
import { formattedAmount, formattedTokenAmount, isGoodBignumber } from '@/utils'

export const AmountFieldset = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()

    const onChange = (value: string): void => {
        bridge.setData('amount', value)
    }

    const onMaximize = (): void => {
        onChange(bridge.maxAmount)
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
                        onChange={bridge.isFetching || bridge.isLocked ? undefined : onChange}
                        onClickMax={bridge.isFetching || bridge.isLocked ? undefined : onMaximize}
                    />

                    <div className="crosschain-transfer__control-hint">
                        {(() => {
                            switch (true) {
                                case bridge.isEvmTvm && bridge.isAmountVaultLimitExceed:
                                    return (
                                        <span className="text-danger">
                                            {intl.formatMessage(
                                                {
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_VAULT_AMOUNT_HINT',
                                                },
                                                {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(
                                                        bridge.vaultLimitNumber.toFixed(),
                                                        bridge.amountMinDecimals,
                                                        { preserve: true },
                                                    ),
                                                },
                                            )}
                                        </span>
                                    )

                                case !bridge.isAmountMaxValueValid:
                                    return (
                                        <span className="text-danger">
                                            {intl.formatMessage(
                                                {
                                                    id: isGoodBignumber(bridge.maxAmount || 0)
                                                        ? 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MAX_AMOUNT_HINT'
                                                        : 'CROSSCHAIN_TRANSFER_ASSET_INVALID_AMOUNT_HINT',
                                                },
                                                {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(bridge.maxAmount, undefined, {
                                                        preserve: true,
                                                    }),
                                                },
                                            )}
                                        </span>
                                    )

                                case !bridge.isAmountMinValueValid:
                                    return (
                                        <span className="text-danger">
                                            {intl.formatMessage(
                                                {
                                                    id: isGoodBignumber(bridge.minAmount || 0)
                                                        ? 'CROSSCHAIN_TRANSFER_ASSET_INVALID_MIN_AMOUNT_HINT'
                                                        : 'CROSSCHAIN_TRANSFER_ASSET_INVALID_AMOUNT_HINT',
                                                },
                                                {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(bridge.minAmount, undefined, {
                                                        preserve: true,
                                                    }),
                                                },
                                            )}
                                        </span>
                                    )

                                case bridge.token !== undefined:
                                    return (
                                        <>
                                            {intl.formatMessage(
                                                {
                                                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_BALANCE_HINT',
                                                },
                                                {
                                                    symbol: bridge.token?.symbol,
                                                    value: formattedAmount(bridge.balance, bridge.decimals, {
                                                        preserve: true,
                                                    }),
                                                },
                                            )}
                                        </>
                                    )

                                default:
                                    return <>&nbsp;</>
                            }
                        })()}
                    </div>

                    {bridge.isEvmEvm && bridge.token && (
                        <OptionSwitcher
                            annotation={(
                                <>
                                    <div className="text-sm">
                                        <span className="text-muted">Transaction cost</span>
                                        &nbsp;
                                        &nbsp;
                                        <span>
                                            {(bridge.isFetching || bridge.isCalculating) ? (
                                                <Skeleton width={60} />
                                            ) : `~${formattedTokenAmount(
                                                bridge.evmTvmCost,
                                                bridge.evmWallet.coin.decimals,
                                            )} ${bridge.evmWallet.coin.symbol}`}
                                        </span>
                                    </div>
                                    {!bridge.isEnoughEvmBalance && (
                                        <span className="text-danger text-sm">
                                            {`Insufficient ${bridge.evmWallet.coin.symbol} balance. Current is ${formattedTokenAmount(
                                                bridge.evmWallet.balance,
                                                bridge.evmWallet.coin.decimals,
                                            )} ${bridge.evmWallet.coin.symbol}`}
                                        </span>
                                    )}
                                </>
                            )}
                            checked={bridge.isSwapEnabled}
                            className="margin-top"
                            disabled={bridge.isFetching}
                            showTrigger={false}
                            label={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_MULTIVAULT_SWAP_OPTION_LABEL',
                            }, {
                                symbol: bridge.leftNetwork?.currencySymbol,
                            })}
                        />
                    )}

                    {(
                        bridge.vaultBalance
                        || bridge.pipeline?.mergePoolAddress
                        || bridge.secondPipeline?.mergePoolAddress
                    )
                        && bridge.isInsufficientVaultBalance
                        && !bridge.isTvmBasedToken
                        && !bridge.isLocked
                        && !bridge.pendingWithdrawals
                        && (bridge.isTvmEvm || bridge.isTvmSolana || bridge.isEvmEvm)
                        && !bridge.isNativeTvmCurrency
                        && (
                            (bridge.isNativeEvmCurrency && !bridge.secondPipeline?.isNative)
                            || !bridge.isNativeEvmCurrency
                        ) && (
                            <Alert
                                className="margin-top"
                                text={bridge.isTvmSolana
                                    ? undefined
                                    : intl.formatMessage({
                                          id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_EXCEED_VAULT_BALANCE_TEXT',
                                      })}
                                title={intl.formatMessage(
                                    {
                                        id: 'CROSSCHAIN_TRANSFER_ASSET_AMOUNT_EXCEED_VAULT_BALANCE_TITLE',
                                    },
                                    {
                                        symbol: bridge.token?.symbol,
                                        value: formattedAmount(bridge.vaultBalance, bridge.vaultBalanceDecimals),
                                    },
                                )}
                                type="warning"
                            />
                        )}

                    {process.env.NODE_ENV !== 'production' && (
                        <div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Max value: ${formattedAmount(
                                    bridge.maxAmount || 0,
                                    undefined,
                                    { preserve: true },
                                )}`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Min value: ${formattedAmount(
                                    bridge.minAmount || 0,
                                    undefined,
                                    { preserve: true },
                                )}`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Pending withdrawals amount: ${formattedAmount(
                                    bridge.pendingWithdrawalsAmount || 0,
                                    bridge.decimals,
                                    { preserve: true },
                                )}`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Pending withdrawals bounty: ${formattedAmount(
                                    bridge.pendingWithdrawalsBounty || 0,
                                    bridge.decimals,
                                    { preserve: true },
                                )}`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Tx cost: ${formattedAmount(
                                        bridge.evmTvmCost,
                                        undefined,
                                        { preserve: true },
                                    )} ${bridge.leftNetwork?.currencySymbol}, ${formattedAmount(
                                        bridge.tvmEvmCost,
                                        undefined,
                                        { preserve: true },
                                    )} EVER`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> Rate: 1 ${bridge.evmWallet.coin.symbol} = ${formattedAmount(
                                    // @ts-ignore just for dev
                                    bridge.data.rate ?? 0,
                                    undefined,
                                    { preserve: true },
                                )} ${bridge.tvmWallet.coin.symbol}`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`> EVM gas price: ${formattedAmount(
                                    // @ts-ignore just for dev
                                    bridge.data.evmGas ?? 0,
                                    9,
                                    { preserve: true },
                                )} GWEI`}
                            </div>
                            <div className="crosschain-transfer__control-hint">
                                {`>Gas usage: ${formattedAmount(
                                    // @ts-ignore just for dev
                                    bridge.data.gasUsage ?? 0,
                                    undefined,
                                    { preserve: true },
                                )}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </fieldset>
    )
})
