import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBalanceValidation } from '@/hooks/useBalanceValidation'
import { AssetForm } from '@/modules/CrosschainTransfer/components/AssetForm'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'
import { CrosschainTransferStep } from '@/modules/CrosschainTransfer/types'
import { useTokensCache } from '@/stores/TokensCacheService'
import { formatBalance } from '@/utils'


export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const transfer = useCrosschainTransfer()
    const tokensCache = useTokensCache()

    const changeAmount = (value: string) => {
        transfer.changeData('amount', value)
    }

    const changeToken = (value?: string) => {
        transfer.changeData('selectedToken', value)
    }

    const nextStep = async () => {
        if (transfer.isEvmToTon) {
            await transfer.checkAllowance()
        }
        else {
            transfer.changeStep(CrosschainTransferStep.TRANSFER)
        }
    }

    const prevStep = () => {
        transfer.changeStep(CrosschainTransferStep.SELECT_ROUTE)
    }

    return (
        <>
            <header className="section__header">
                <h2 className="section-title">
                    <div className="small">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STEP_2_HINT',
                        })}
                    </div>
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STEP_2_TITLE',
                    })}
                </h2>
            </header>

            <Observer>
                {() => (
                    <AssetForm
                        amount={transfer.amount}
                        balance={formatBalance(
                            transfer.balance || '0',
                            transfer.decimals,
                        )}
                        changeAmount={changeAmount}
                        changeToken={changeToken}
                        isAmountValid={useBalanceValidation(transfer.balance, transfer.amount, transfer.decimals)}
                        token={transfer.token}
                        tokens={
                            // fixme to memo
                            transfer.isEvmToTon
                                ? tokensCache.filterTokensByChainId(transfer.leftNetwork!.chainId)
                                : tokensCache.filterTokensByChainId(transfer.rightNetwork!.chainId)
                        }
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <footer className="crosschain-transfer__footer">
                        <button
                            type="button"
                            className="btn btn-lg btn-link crosschain-transfer__btn-prev"
                            onClick={prevStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_PREV_STEP_BTN_TEXT',
                            })}
                        </button>
                        <button
                            type="button"
                            className="btn btn-lg btn--primary crosschain-transfer__btn-next"
                            disabled={
                                !transfer.isAssetValid
                                || !useBalanceValidation(transfer.balance, transfer.amount, transfer.decimals)
                            }
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: transfer.isEvmToTon
                                    ? 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT'
                                    : 'CROSSCHAIN_TRANSFER_TRANSFER_BTN_TEXT',
                            })}
                        </button>
                    </footer>
                )}
            </Observer>
        </>
    )
}
