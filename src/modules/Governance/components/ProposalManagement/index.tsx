import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/common/Button'
import { CancelPopup } from '@/modules/Governance/components/ProposalManagement/CancelPopup'
import { useProposalContext } from '@/modules/Governance/providers'
import { useTonWallet } from '@/stores/TonWalletService'
import { TonButtonConnector } from '@/modules/TonWalletConnector/Button'
import { error } from '@/utils'

import './index.scss'

// TODO: Execute proposal
export function ProposalManagementInner(): JSX.Element | null {
    const proposal = useProposalContext()

    if (proposal.state !== 'Executed') {
        return null
    }

    const intl = useIntl()
    const tonWallet = useTonWallet()
    const [cancelPopupVisible, setCancelPopupVisible] = React.useState(false)

    const showCancelPopup = () => setCancelPopupVisible(true)
    const hideCancelPopup = () => setCancelPopupVisible(false)

    const cancelProposal = async () => {
        if (!proposal.contractAddress) {
            return
        }
        try {
            await proposal.cancel()
        }
        catch (e) {
            error(e)
        }
    }

    return (
        <div className="proposal-management">
            <h3 className="proposal-management__title">
                {intl.formatMessage({
                    id: 'PROPOSAL_MANAGEMENT_TITLE',
                })}
            </h3>

            <TonButtonConnector size="md">
                <div className="proposal-management__action">
                    <Button
                        block
                        size="md"
                        type="primary"
                    >
                        {intl.formatMessage({
                            id: 'PROPOSAL_MANAGEMENT_EXECUTE',
                        })}
                    </Button>
                </div>

                {
                    tonWallet.address
                    && proposal.proposer
                    && tonWallet.address === proposal.proposer
                    && (
                        <div className="proposal-management__action">
                            <Button
                                block
                                size="md"
                                type="secondary"
                                onClick={showCancelPopup}
                            >
                                {intl.formatMessage({
                                    id: 'PROPOSAL_MANAGEMENT_CANCEL',
                                })}
                            </Button>
                        </div>
                    )
                }
            </TonButtonConnector>

            {cancelPopupVisible && (
                <CancelPopup
                    loading={proposal.cancelLoading}
                    onConfirm={cancelProposal}
                    onDismiss={hideCancelPopup}
                />
            )}
        </div>
    )
}

export const ProposalManagement = observer(ProposalManagementInner)
