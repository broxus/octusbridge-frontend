import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { TokenAmountField } from '@/components/common/TokenAmountField'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useEvmEvmPipelineContext } from '@/modules/Bridge/providers'

export const RewardForm = observer(() => {
    const intl = useIntl()
    const transfer = useEvmEvmPipelineContext()
    const { evmWallet } = transfer

    const wrongNetwork = evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && transfer.rightNetwork.chainId !== evmWallet.chainId
    const isClosed = transfer.pendingWithdrawalStatus === 'Close'
    const disabled = (
        wrongNetwork
        || isClosed
        || transfer.releaseState?.isSettingWithdrawBounty
        || transfer.releaseState?.isPendingClosing
    )
    const isOwner = transfer.leftAddress
        ? transfer.leftAddress.toLowerCase() === transfer.evmWallet.address?.toLowerCase()
        : false

    const [localBounty, setLocalBounty] = React.useState<string>('')

    // eslint-disable-next-line max-len
    const maxValueValid = transfer.token && transfer.amount ? BigNumber(transfer.amount).gte(localBounty || 0) : undefined

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        if (transfer.secondPipeline?.evmTokenDecimals !== undefined) {
            await transfer.changeBounty(
                BigNumber(localBounty)
                .shiftedBy(transfer.secondPipeline.evmTokenDecimals)
                .dp(0, BigNumber.ROUND_DOWN).toFixed(),
            )
        }
    }

    React.useEffect(() => {
        if (transfer.secondPipeline?.evmTokenDecimals !== undefined) {
            setLocalBounty(
                transfer.bounty ? BigNumber(transfer.bounty).shiftedBy(-transfer.secondPipeline.evmTokenDecimals).toFixed() : '',
            )
        }
    }, [transfer.bounty, transfer.secondPipeline?.evmTokenDecimals])

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
                            {intl.formatMessage(
                                {
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_LIMIT_ERROR',
                                },
                                {
                                    symbol: transfer.token?.symbol,
                                    value: transfer.amount,
                                },
                            )}
                        </span>
                    </div>
                )}
            </fieldset>

            {isOwner && (
                <React.Fragment key="owner">
                    {wrongNetwork ? (
                        <WrongNetworkError className="margin-top" network={transfer.rightNetwork} wallet={evmWallet} />
                    ) : (
                        <fieldset className="form-fieldset">
                            <Button submit type="primary" disabled={!localBounty || !maxValueValid || disabled}>
                                {intl.formatMessage({
                                    id: transfer.pendingWithdrawalId
                                        ? 'CROSSCHAIN_TRANSFER_BOUNTY_CHANGE'
                                        : 'CROSSCHAIN_TRANSFER_BOUNTY_TRANSFER',
                                })}
                            </Button>
                        </fieldset>
                    )}
                </React.Fragment>
            )}
        </form>
    )
})
