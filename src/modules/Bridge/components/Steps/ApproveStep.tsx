import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { ApproveForm } from '@/modules/Bridge/components/ApproveForm'
import { useBridge } from '@/modules/Bridge/stores/CrosschainBridge'
import { ApprovalStrategies, CrosschainBridgeStep } from '@/modules/Bridge/types'
import { Icon } from '@/components/common/Icon'


export function ApproveStep(): JSX.Element {
    const intl = useIntl()
    const bridge = useBridge()

    const [isPendingApprove, setPendingApprove] = React.useState(false)

    const changeStrategy = (value: ApprovalStrategies) => {
        bridge.changeState('approvalStrategy', value)
    }

    const nextStep = async () => {
        try {
            setPendingApprove(true)
            await bridge.approve(() => {
                setPendingApprove(false)
            })
        }
        catch (e) {
            setPendingApprove(false)
        }
    }

    const prevStep = () => {
        bridge.changeStep(CrosschainBridgeStep.SELECT_ASSET)
    }

    return (
        <>
            <header className="section__header">
                <h2 className="section-title">
                    <div className="small">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STEP_3_HINT',
                        })}
                    </div>
                    {intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_STEP_3_TITLE',
                    })}
                    <div className="section-subtitle">
                        {intl.formatMessage({
                            id: 'CROSSCHAIN_TRANSFER_STEP_3_SUBTITLE',
                        })}
                    </div>
                </h2>
            </header>

            <Observer>
                {() => (
                    <ApproveForm
                        amount={bridge.amount}
                        disabled={isPendingApprove}
                        strategy={bridge.approvalStrategy}
                        token={bridge.token}
                        onChange={changeStrategy}
                    />
                )}
            </Observer>

            <Observer>
                {() => (
                    <footer className="crosschain-transfer__footer">
                        <button
                            type="button"
                            className="btn btn-lg btn-link crosschain-transfer__btn-prev"
                            disabled={isPendingApprove}
                            onClick={prevStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_PREV_STEP_BTN_TEXT',
                            })}
                        </button>
                        <button
                            type="button"
                            className="btn btn-lg btn--primary crosschain-transfer__btn-next"
                            disabled={isPendingApprove}
                            onClick={nextStep}
                        >
                            {isPendingApprove ? (
                                <Icon icon="loader" className="spin" />
                            ) : intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_CONFIRM_BTN_TEXT',
                            })}
                        </button>
                    </footer>
                )}
            </Observer>
        </>
    )
}
