import * as React from 'react'
import { useIntl } from 'react-intl'

import { SimpleRadio } from '@/components/common/SimpleRadio'
import { ApprovalStrategies } from '@/modules/Bridge/types'
import { TokenCache } from '@/stores/TokensCacheService'


type Props = {
    amount: string;
    disabled?: boolean;
    strategy: ApprovalStrategies;
    token?: TokenCache;
    onChange: (value: ApprovalStrategies) => void;
}


export function ApproveForm({
    amount,
    disabled,
    strategy,
    token,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="card card--flat card--small crosschain-transfer">
            <div className="crosschain-transfer__label">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_ASSET_LABEL',
                })}
            </div>
            <form className="form crosschain-transfer__form">
                <fieldset className="form-fieldset">
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <SimpleRadio
                                annotation={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_APPROVE_INFINITY_CHECKBOX_NOTE',
                                })}
                                checked={strategy === 'infinity'}
                                disabled={disabled}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_APPROVE_INFINITY_CHECKBOX_LABEL',
                                })}
                                name="infinity"
                                onChange={onChange}
                            />
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <SimpleRadio
                                annotation={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_APPROVE_FIXED_CHECKBOX_NOTE',
                                })}
                                checked={strategy === 'fixed'}
                                disabled={disabled}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_APPROVE_FIXED_CHECKBOX_LABEL',
                                }, {
                                    amount,
                                    symbol: token?.symbol || '',
                                })}
                                name="fixed"
                                onChange={onChange}
                            />
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
