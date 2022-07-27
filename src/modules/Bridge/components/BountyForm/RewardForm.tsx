import * as React from 'react'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import isEqual from 'lodash.isequal'

import { Button } from '@/components/common/Button'
import { TokenAmountField } from '@/components/common/TokenAmountField'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEverscaleTransfer } from '@/modules/Bridge/providers'

export function RewardFormInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEverscaleTransfer()
    const evmWallet = transfer.useEvmWallet

    const isClosed = transfer.pendingWithdrawalStatus === 'Close'
    const disabled = (
        isClosed
        || transfer.releaseState?.isSettingWithdrawBounty
        || transfer.releaseState?.isPendingClosing
    )
    const isOwner = transfer.leftAddress
        ? transfer.leftAddress === transfer.useEverWallet.address
        : false

    const [localBounty, setLocalBounty] = React.useState<string>('')

    const maxValueValid = transfer.token && transfer.amount
        ? new BigNumber(transfer.amount)
            .shiftedBy(-transfer.token.decimals)
            .gte(localBounty || 0)
        : undefined

    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
    )

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (transfer.evmTokenDecimals !== undefined) {
            await transfer.changeBounty(new BigNumber(localBounty)
                .shiftedBy(transfer.evmTokenDecimals)
                .dp(0, BigNumber.ROUND_DOWN)
                .toFixed())
        }
    }

    React.useEffect(() => {
        if (transfer.evmTokenDecimals !== undefined) {
            setLocalBounty(transfer.bounty
                ? new BigNumber(transfer.bounty)
                    .shiftedBy(-transfer.evmTokenDecimals)
                    .toFixed()
                : '')
        }
    }, [transfer.bounty, transfer.evmTokenDecimals])

    return (
        <form onSubmit={onSubmit}>
            <fieldset className="form-fieldset">
                <legend className="form-legend">
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_BOUNTY_REQUEST_AMOUNT',
                    })}
                </legend>

                <TokenAmountField
                    size="md"
                    displayMaxButton={false}
                    token={transfer.token}
                    value={localBounty}
                    onChange={setLocalBounty}
                    disabled={disabled || !isOwner}
                    placeholder={intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_BOUNTY_REQUEST_PLACEHOLDER',
                    })}
                />

                {maxValueValid === false && (
                    <div className="crosschain-transfer__control-hint">
                        <span className="text-danger">
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_BOUNTY_LIMIT_ERROR',
                            }, {
                                symbol: transfer.token?.symbol,
                                value: new BigNumber(transfer.amount)
                                    .shiftedBy(-(transfer.token?.decimals ?? 0))
                                    .toFixed(),
                            })}
                        </span>
                    </div>
                )}
            </fieldset>

            {isOwner && (
                <>
                    {wrongNetwork ? (
                        <WrongNetworkError
                            className="margin-top"
                            network={transfer.rightNetwork}
                            wallet={evmWallet}
                        />
                    ) : (
                        <fieldset className="form-fieldset">
                            <Button
                                submit
                                type="primary"
                                disabled={!localBounty || !maxValueValid || disabled}
                            >
                                {intl.formatMessage({
                                    id: transfer.pendingWithdrawalId
                                        ? 'CROSSCHAIN_TRANSFER_BOUNTY_CHANGE'
                                        : 'CROSSCHAIN_TRANSFER_BOUNTY_TRANSFER',
                                })}
                            </Button>
                        </fieldset>
                    )}
                </>
            )}
        </form>
    )
}

export const RewardForm = observer(RewardFormInner)
