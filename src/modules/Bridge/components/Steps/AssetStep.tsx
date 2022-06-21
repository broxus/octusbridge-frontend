import { reaction } from 'mobx'
import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { AssetForm } from '@/modules/Bridge/components/AssetForm'
import { SwapForm } from '@/modules/Bridge/components/SwapForm'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'


export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()

    const nextStep = async () => {
        if (
            bridge.isPendingAllowance
            || bridge.isFetching
            || bridge.isCalculating
            || bridge.isLocked
            || !bridge.isAssetValid
        ) {
            return
        }

        if (bridge.isFromEvm && (!bridge.isEverscaleBasedToken || !bridge.pipeline?.isNative)) {
            await bridge.checkAllowance()
        }
        else {
            bridge.setState('step', CrosschainBridgeStep.TRANSFER)
        }
    }

    const prevStep = () => {
        bridge.resetAsset()
        bridge.setData('selectedToken', undefined)
        bridge.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
    }

    React.useEffect(() => reaction(
        () => bridge.evmPendingWithdrawal,
        () => {
            if (bridge.evmPendingWithdrawal) {
                bridge.setData('selectedToken', bridge.evmPendingWithdrawal.evmTokenAddress)
            }
        },
        {
            fireImmediately: true,
        },
    ), [])

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
                        {(bridge.isEvmToEverscale && bridge.isCreditAvailable) && (
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
                            disabled={(
                                bridge.isPendingAllowance
                                || bridge.isFetching
                                || bridge.isCalculating
                                || bridge.isLocked
                                || !bridge.isAssetValid
                            )}
                            size="lg"
                            type="primary"
                            onClick={nextStep}
                        >
                            {(bridge.isPendingAllowance || bridge.isFetching || bridge.isCalculating) ? (
                                <Icon icon="loader" className="spin" />
                            ) : intl.formatMessage({
                                id: bridge.isEvmToEverscale
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
