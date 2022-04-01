import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { ApproveForm } from '@/modules/Bridge/components/ApproveForm'
import { useBridge } from '@/modules/Bridge/providers'
import { CrosschainBridgeStep } from '@/modules/Bridge/types'


export function ApproveStep(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()

    const nextStep = async () => {
        await bridge.approveAmount()
    }

    const prevStep = () => {
        bridge.setState('step', CrosschainBridgeStep.SELECT_ASSET)
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

            <ApproveForm />

            <footer className="crosschain-transfer__footer">
                <Observer>
                    {() => (
                        <>
                            <Button
                                className="crosschain-transfer__btn-prev"
                                disabled={bridge.isPendingApproval}
                                size="lg"
                                type="link"
                                onClick={prevStep}
                            >
                                {intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_PREV_STEP_BTN_TEXT',
                                })}
                            </Button>
                            <Button
                                className="crosschain-transfer__btn-next"
                                disabled={bridge.isPendingApproval}
                                size="lg"
                                type="primary"
                                onClick={nextStep}
                            >
                                {bridge.isPendingApproval ? (
                                    <Icon icon="loader" className="spin" />
                                ) : intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_CONFIRM_BTN_TEXT',
                                })}
                            </Button>
                        </>
                    )}
                </Observer>
            </footer>
        </>
    )
}
