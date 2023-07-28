import isEqual from 'lodash.isequal'
import { Observer, observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'

import { SimpleRadio } from '@/components/common/SimpleRadio'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'
import { useBridge } from '@/modules/Bridge/providers'
import { type ApprovalStrategies } from '@/modules/Bridge/types'
import { formattedAmount } from '@/utils'

export const ApproveForm = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()

    const onChangeStrategy = (value: ApprovalStrategies): void => {
        bridge.setState('approvalStrategy', value)
    }

    const wrongNetwork = bridge.evmWallet.isReady
        && bridge.leftNetwork !== undefined
        && !isEqual(bridge.leftNetwork.chainId, bridge.evmWallet.chainId)

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_APPROVE_AMOUNT_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <fieldset className="form-fieldset">
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <SimpleRadio
                                        annotation={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_APPROVE_INFINITY_CHECKBOX_NOTE',
                                        })}
                                        checked={bridge.approvalStrategy === 'infinity'}
                                        disabled={bridge.isPendingApproval}
                                        label={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_APPROVE_INFINITY_CHECKBOX_LABEL',
                                        })}
                                        name="infinity"
                                        onChange={onChangeStrategy}
                                    />
                                )}
                            </Observer>
                        </div>
                    </div>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <Observer>
                                {() => (
                                    <SimpleRadio
                                        annotation={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_APPROVE_FIXED_CHECKBOX_NOTE',
                                        })}
                                        checked={bridge.approvalStrategy === 'fixed'}
                                        disabled={bridge.isPendingApproval}
                                        label={intl.formatMessage(
                                            {
                                                id: 'CROSSCHAIN_TRANSFER_APPROVE_FIXED_CHECKBOX_LABEL',
                                            },
                                            {
                                                amount: formattedAmount(bridge.amount, undefined, { preserve: true }),
                                                symbol: bridge.token?.symbol || '',
                                            },
                                        )}
                                        name="fixed"
                                        onChange={onChangeStrategy}
                                    />
                                )}
                            </Observer>
                        </div>
                    </div>
                </fieldset>

                {wrongNetwork && (
                    <WrongNetworkError
                        className="margin-top"
                        network={bridge.leftNetwork}
                        wallet={bridge.evmWallet}
                    />
                )}
            </form>
        </div>
    )
})
