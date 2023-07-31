import BigNumber from 'bignumber.js'
import { reaction } from 'mobx'
import { Observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { AssetForm } from '@/modules/Bridge/components/AssetForm'
import { SwapForm } from '@/modules/Bridge/components/SwapForm'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'
import { isGoodBignumber } from '@/utils'

export function AssetStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const nextStep = async (): Promise<void> => {
        if (
            bridge.isPendingAllowance
            || bridge.isFetching
            || bridge.isCalculating
            || bridge.isLocked
            || !bridge.isAssetValid
        ) {
            return
        }

        const isNativeCurrency = bridge.isNativeEvmCurrency || bridge.isNativeTvmCurrency
        const isNative = bridge.pipeline?.tokenBase === 'tvm' || bridge.pipeline?.isNative

        if (bridge.isFromEvm && (isNativeCurrency || isNative)) {
            bridge.setState('step', CrosschainBridgeStep.TRANSFER)
        }
        else if (bridge.isFromEvm && !isNative) {
            await bridge.checkAllowance()
        }
        else {
            bridge.setState('step', CrosschainBridgeStep.TRANSFER)
        }
    }

    const prevStep: VoidFunction = () => {
        bridge.resetAsset()
        bridge.setData('selectedToken', undefined)
        bridge.setState('step', CrosschainBridgeStep.SELECT_ROUTE)
    }

    React.useEffect(() => reaction(
        () => bridge.evmPendingWithdrawal,
        async () => {
            if (bridge.evmPendingWithdrawal) {
                await bridge.changeToken(bridge.evmPendingWithdrawal.evmTokenAddress)
                const amount = new BigNumber(bridge.pendingWithdrawalsAmount ?? 0)
                if (isGoodBignumber(amount)) {
                    bridge.setData('amount', amount.shiftedBy(-(bridge.decimals ?? 0)).toFixed())
                }
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
                {() => {
                    switch (true) {
                        case bridge.isEvmTvm:
                        case bridge.isTvmEvm:
                            return bridge.pipeline !== undefined ? <SwapForm /> : null

                        default:
                            return null
                    }
                }}
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
                                id: bridge.isEvmTvm
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
