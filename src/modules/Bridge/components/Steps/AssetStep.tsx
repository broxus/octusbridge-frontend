import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { useBalanceValidation } from '@/hooks/useBalanceValidation'
import { AssetForm } from '@/modules/Bridge/components/AssetForm'
import { useBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'
import { useTokensCache } from '@/stores/TokensCacheService'
import { amount } from '@/utils'


export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()
    const tokensCache = useTokensCache()

    const changeAmount = (value: string) => {
        bridge.changeData('amount', value)
    }

    const changeToken = (value?: string) => {
        bridge.changeData('selectedToken', value)
    }

    const nextStep = async () => {
        if (bridge.isEvmToTon) {
            await bridge.checkAllowance()
        }
        else {
            bridge.changeStep(CrosschainBridgeStep.TRANSFER)
        }
    }

    const prevStep = () => {
        bridge.changeStep(CrosschainBridgeStep.SELECT_ROUTE)
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
                        amount={bridge.amount}
                        balance={amount(bridge.balance, bridge.decimals)}
                        isAmountValid={useBalanceValidation(bridge.balance, bridge.amount, bridge.decimals)}
                        token={bridge.token}
                        tokens={(
                            // fixme to memo
                            // eslint-disable-next-line no-nested-ternary
                            bridge.isEvmToTon
                                ? bridge.leftNetwork?.chainId
                                    ? tokensCache.filterTokensByChainId(bridge.leftNetwork.chainId)
                                    : []
                                : bridge.rightNetwork?.chainId
                                    ? tokensCache.filterTokensByChainId(bridge.rightNetwork.chainId)
                                    : []
                        )}
                        onChangeAmount={changeAmount}
                        onChangeToken={changeToken}
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
                            disabled={!(
                                bridge.isAssetValid
                                && useBalanceValidation(bridge.balance, bridge.amount, bridge.decimals)
                            )}
                            data-balance={bridge.balance}
                            data-decimals={bridge.decimals}
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: bridge.isEvmToTon
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
