import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'
import BigNumber from 'bignumber.js'

import { Button } from '@/components/common/Button'
import { SimpleRadio } from '@/components/common/SimpleRadio'
import { useEverscaleTransfer } from '@/modules/Bridge/providers'
import { RewardForm } from '@/modules/Bridge/components/BountyForm/RewardForm'

enum BountyKind {
    Default = 'Default',
    Bounty = 'Bounty',
}

type Props = {
    onSubmit: (amount: string) => void;
}

export function BountyFormInner({
    onSubmit,
}: Props): JSX.Element {
    const intl = useIntl()
    const transfer = useEverscaleTransfer()

    const isClosed = transfer.pendingWithdrawalStatus === 'Close'
    const disabled = isClosed || transfer.isSubmitBountyLoading
    const hideForm = transfer.pendingWithdrawalOwner
        ? transfer.pendingWithdrawalOwner !== transfer.useEverWallet.address
        : false

    const [bountyKind, setBountyKind] = React.useState<BountyKind>(BountyKind.Default)

    const onChangeKind = (val: BountyKind) => {
        setBountyKind(val)
    }

    const onSubmitDefault = () => {
        onSubmit('0')
    }

    React.useEffect(() => {
        setBountyKind(transfer.bounty === undefined || new BigNumber(transfer.bounty).isZero()
            ? BountyKind.Default
            : BountyKind.Bounty)
    }, [transfer.bounty])

    return (
        <div className="form crosschain-transfer__form">
            <fieldset className="form-fieldset">
                {(!hideForm || bountyKind === BountyKind.Default) && (
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <SimpleRadio
                                name={BountyKind.Default}
                                checked={bountyKind === BountyKind.Default}
                                disabled={disabled}
                                onChange={onChangeKind}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_DEFAULT',
                                })}
                                annotation={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_DEFAULT_TEXT',
                                })}
                            >
                                {!hideForm && bountyKind === BountyKind.Default && (
                                    <Button
                                        type="primary"
                                        className="crosschain-transfer__btn-field"
                                        onClick={onSubmitDefault}
                                        disabled={disabled}
                                    >
                                        {intl.formatMessage({
                                            id: transfer.pendingWithdrawalId
                                                ? 'CROSSCHAIN_TRANSFER_BOUNTY_CHANGE'
                                                : 'CROSSCHAIN_TRANSFER_BOUNTY_TRANSFER',
                                        })}
                                    </Button>
                                )}
                            </SimpleRadio>
                        </div>
                    </div>
                )}

                {(!hideForm || bountyKind === BountyKind.Bounty) && (
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control">
                            <SimpleRadio
                                name={BountyKind.Bounty}
                                checked={bountyKind === BountyKind.Bounty}
                                disabled={disabled}
                                onChange={onChangeKind}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_REQUEST',
                                })}
                                annotation={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_REQUEST_TEXT',
                                })}
                            >
                                {bountyKind === BountyKind.Bounty && (
                                    <RewardForm
                                        onSubmit={onSubmit}
                                    />
                                )}
                            </SimpleRadio>
                        </div>
                    </div>
                )}
            </fieldset>
        </div>
    )
}

export const BountyForm = observer(BountyFormInner)
