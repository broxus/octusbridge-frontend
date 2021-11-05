import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { AssetForm } from '@/modules/Bridge/components/AssetForm'
import { SwapForm } from '@/modules/Bridge/components/SwapForm'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'


export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const nextStep = async () => {
        if (bridge.isPendingAllowance || !bridge.isAssetValid) {
            return
        }

        if (bridge.isEvmToTon) {
            await bridge.checkAllowance()
        }
        else {
            bridge.changeState('step', CrosschainBridgeStep.TRANSFER)
        }
    }

    const prevStep = () => {
        bridge.resetAsset()
        bridge.changeData('selectedToken', undefined)
        bridge.changeState('step', CrosschainBridgeStep.SELECT_ROUTE)
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

            <AssetForm />

            <Observer>
                {() => (
                    <>
                        {(bridge.isEvmToTon && bridge.isCreditAvailable) && (
                            <SwapForm />
                        )}
                    </>
                )}
            </Observer>

            <footer className="crosschain-transfer__footer">
                <Button
                    className="crosschain-transfer__btn-prev"
                    size="lg"
                    type="link"
                    onClick={prevStep}
                >
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_PREV_STEP_BTN_TEXT',
                    })}
                </Button>
                <Observer>
                    {() => (
                        <Button
                            className="crosschain-transfer__btn-next"
                            disabled={bridge.isPendingAllowance || !bridge.isAssetValid}
                            size="lg"
                            type="primary"
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: bridge.isEvmToTon
                                    ? 'CROSSCHAIN_TRANSFER_NEXT_STEP_BTN_TEXT'
                                    : 'CROSSCHAIN_TRANSFER_TRANSFER_BTN_TEXT',
                            })}
                        </Button>
                    )}
                </Observer>
            </footer>
        </>
    )
}
