import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { AssetForm } from '@/modules/CrosschainTransfer/components/AssetForm'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'
import { CrosschainTransferStep } from '@/modules/CrosschainTransfer/types'
import { useEvmTokensCache } from '@/stores/EvmTokensCacheService'
import { useTonTokensCache } from '@/stores/TonTokensCacheService'


export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const transfer = useCrosschainTransfer()
    const tonTokensCache = useTonTokensCache()
    const ethTokensCache = useEvmTokensCache()

    const changeAmount = (value: string) => {
        transfer.changeData('amount', value)
    }

    const changeToken = (value?: string) => {
        transfer.changeData('selectedToken', value)
    }

    const nextStep = async () => {
        await transfer.checkAllowance()
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
                        changeAmount={changeAmount}
                        changeToken={changeToken}
                        token={transfer.token}
                        tokens={
                            transfer.isEvmToTon
                                ? ethTokensCache.filterTokens(transfer.leftNetwork!.chainId)
                                : tonTokensCache.tokens
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
                            disabled={!transfer.isRouteValid}
                            onClick={prevStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_PREV_STEP_BTN_TEXT',
                            })}
                        </button>
                        <button
                            type="button"
                            className="btn btn-lg btn--primary crosschain-transfer__btn-next"
                            disabled={!transfer.isAssetValid}
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT',
                            })}
                        </button>
                    </footer>
                )}
            </Observer>
        </>
    )
}
