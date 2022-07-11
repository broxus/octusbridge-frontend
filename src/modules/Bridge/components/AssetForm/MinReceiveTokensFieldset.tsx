import * as React from 'react'
import { useIntl } from 'react-intl'
import { Observer } from 'mobx-react-lite'

import { TokenAmountField } from '@/components/common/TokenAmountField'
import { useBridge } from '@/modules/Bridge/providers'


export function MinReceiveTokensFieldset(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()

    return (
        <fieldset className="form-fieldset">
            <legend
                className="form-legend"
                dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                        id: 'CROSSCHAIN_TRANSFER_ASSET_MIN_RECEIVE_TOKENS_LABEL',
                    }, {
                        abbr: parts => `<abbr title="${bridge.rightNetwork?.label}">${parts.join('')}</abbr>`,
                        network: bridge.rightNetwork?.name,
                    }),
                }}
            />
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <TokenAmountField
                                disabled
                                displayMaxButton={false}
                                isValid
                                placeholder={!bridge.amount ? intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_ENTER_AMOUNT_FIRST_PLACEHOLDER',
                                }) : '0'}
                                token={bridge.token}
                                size="md"
                                readOnly
                                value={bridge.tokenAmount || ''}
                            />
                        )}
                    </Observer>
                </div>
            </div>
        </fieldset>
    )
}
