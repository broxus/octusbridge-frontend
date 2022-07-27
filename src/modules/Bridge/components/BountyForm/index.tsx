import * as React from 'react'
import { useIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import isEqual from 'lodash.isequal'

import { Button } from '@/components/common/Button'
import { SimpleRadio } from '@/components/common/SimpleRadio'
import { useEverscaleTransfer } from '@/modules/Bridge/providers'
import { RewardForm } from '@/modules/Bridge/components/BountyForm/RewardForm'
import { WrongNetworkError } from '@/modules/Bridge/components/WrongNetworkError'

enum BountyKind {
    Default = 'Default',
    Bounty = 'Bounty',
}

export function BountyFormInner(): JSX.Element {
    const intl = useIntl()
    const transfer = useEverscaleTransfer()
    const evmWallet = transfer.useEvmWallet

    const isClosed = transfer.pendingWithdrawalStatus === 'Close'
    const disabled = (
        isClosed
        || transfer.releaseState?.isSettingWithdrawBounty
        || transfer.releaseState?.isPendingClosing
    )
    const isOwner = transfer.leftAddress
        ? transfer.leftAddress === transfer.useEverWallet.address
        : false

    const [bountyKind, setBountyKind] = React.useState<BountyKind>(BountyKind.Default)

    const onChangeKind = (val: BountyKind) => {
        setBountyKind(val)
    }

    const onForceWithdraw = async () => {
        await transfer.forceClose()
    }

    React.useEffect(() => {
        setBountyKind(transfer.bounty === undefined || new BigNumber(transfer.bounty).isZero()
            ? BountyKind.Default
            : BountyKind.Bounty)
    }, [transfer.bounty])

    const wrongNetwork = (
        evmWallet.isReady
        && transfer.rightNetwork !== undefined
        && !isEqual(transfer.rightNetwork.chainId, evmWallet.chainId)
    )

    return (
        <div className="form crosschain-transfer__form">
            <fieldset className="form-fieldset">
                {(isOwner || bountyKind === BountyKind.Default) && (
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control width-expand">
                            <SimpleRadio
                                name={BountyKind.Default}
                                checked={bountyKind === BountyKind.Default || bountyKind === undefined}
                                disabled={disabled}
                                onChange={onChangeKind}
                                label={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_DEFAULT',
                                })}
                                annotation={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_DEFAULT_TEXT',
                                }, {
                                    network: transfer.rightNetwork?.label ?? '',
                                }, { ignoreTag: true })}
                            >
                                {isOwner && bountyKind === BountyKind.Default && (
                                    <>
                                        {wrongNetwork ? (
                                            <WrongNetworkError
                                                network={transfer.rightNetwork}
                                                wallet={evmWallet}
                                            />
                                        ) : (
                                            <Button
                                                type="primary"
                                                className="crosschain-transfer__btn-field"
                                                disabled={isClosed || (
                                                    !isClosed && transfer.isInsufficientVaultBalance
                                                )}
                                                onClick={onForceWithdraw}
                                            >
                                                {intl.formatMessage({
                                                    id: 'CROSSCHAIN_TRANSFER_BOUNTY_TRANSFER',
                                                })}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </SimpleRadio>
                        </div>
                    </div>
                )}

                {(isOwner || bountyKind === BountyKind.Bounty) && (
                    <div className="crosschain-transfer__controls">
                        <div className="crosschain-transfer__control width-expand">
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
                                    <RewardForm />
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
