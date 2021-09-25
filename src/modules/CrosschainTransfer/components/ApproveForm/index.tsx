import * as React from 'react'
import { useIntl } from 'react-intl'

import { SimpleRadio } from '@/components/common/SimpleRadio'
import { ApprovalStrategies } from '@/modules/CrosschainTransfer/types'
import { TokenCache as EvmTokenCache } from '@/stores/EvmTokensCacheService'
import { TokenCache as TonTokenCache } from '@/stores/TonTokensCacheService'


type Props = {
    amount: string;
    strategy: ApprovalStrategies;
    token?: TonTokenCache | EvmTokenCache;
    onChange: (value: ApprovalStrategies) => void;
}


export function ApproveForm({
    amount,
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
                                annotation={(
                                    <>
                                        <p>
                                            Approve the infinite amount if you don’t want to pay the approval
                                            fee again next time.
                                        </p>
                                        <p>The Bridge will spend only the amount of transfer you have requested.</p>
                                    </>
                                )}
                                checked={strategy === 'infinity'}
                                label="The infinite amount"
                                name="infinity"
                                onChange={onChange}
                            />
                        </div>
                        <div className="crosschain-transfer__wallet" />
                    </div>
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <SimpleRadio
                                annotation="Approve only the amount of this transfer."
                                checked={strategy === 'fixed'}
                                label={`${amount} ${token?.symbol}`}
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
