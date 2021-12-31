import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { AirdropField } from '@/modules/Airdrop/components/AirdropField'
import { useAirdropStore } from '@/modules/Airdrop/stores/AirdropStore'
import { AirdropSubmitButton } from '@/modules/Airdrop/components/AirdropSubmitButton'

import './index.scss'


export function Airdrop(): JSX.Element {
    const intl = useIntl()
    const airdrop = useAirdropStore()

    return (
        <div className="container container--small">
            <div className="card">
                <div className="card__header">
                    <h2 className="card-title">
                        {intl.formatMessage({
                            id: 'AIRDROP_FORM_TITLE',
                        })}
                    </h2>
                </div>
                <div className="form form-airdrop">
                    <Observer>
                        {() => (
                            <AirdropField
                                disabled
                                label="Amount to claim"
                                readOnly
                                token={airdrop.token}
                                value={airdrop.amount}
                            />
                        )}
                    </Observer>

                    <AirdropSubmitButton />
                </div>
            </div>
        </div>
    )
}
