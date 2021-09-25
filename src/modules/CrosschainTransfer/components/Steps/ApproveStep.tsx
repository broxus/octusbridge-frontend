import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { ApproveForm } from '@/modules/CrosschainTransfer/components/ApproveForm'
import { useCrosschainTransfer } from '@/modules/CrosschainTransfer/stores/CrosschainTransfer'
import { ApprovalStrategies, CrosschainTransferStep } from '@/modules/CrosschainTransfer/types'


export function ApproveStep(): JSX.Element {
    const intl = useIntl()
    const transfer = useCrosschainTransfer()

    const changeStrategy = (value: ApprovalStrategies) => {
        transfer.changeData('approvalStrategy', value)
    }

    const nextStep = async () => {
        await transfer.approve()
    }

    const prevStep = () => {
        transfer.changeStep(CrosschainTransferStep.SELECT_ASSET)
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
                        amount={transfer.amount}
                        strategy={transfer.approvalStrategy}
                        token={transfer.token}
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
                            disabled={transfer.isAwaitConfirmation}
                            onClick={nextStep}
                        >
                            {intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_CONFIRM_BTN_TEXT',
                            })}
                        </button>
                    </footer>
                )}
            </Observer>
        </>
    )
}
