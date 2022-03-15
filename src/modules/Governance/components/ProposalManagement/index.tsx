import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import { Icon } from '@/components/common/Icon'
import { Button } from '@/components/common/Button'
import { Layout } from '@/modules/Governance/components/ProposalManagement/Layout'
import { CancelPopup } from '@/modules/Governance/components/ProposalManagement/CancelPopup'
import { useProposalContext } from '@/modules/Governance/providers'
import { error } from '@/utils'
import { useEverWallet } from '@/stores/EverWalletService'

import './index.scss'

export function ProposalManagementInner(): JSX.Element | null {
    const intl = useIntl()
    const tonWallet = useEverWallet()
    const proposal = useProposalContext()
    const currentTime = new Date().getTime()

    const [cancelPopupVisible, setCancelPopupVisible] = React.useState(false)

    const showCancelPopup = () => {
        setCancelPopupVisible(true)
    }

    const hideCancelPopup = () => {
        setCancelPopupVisible(false)
    }

    const cancelProposal = async () => {
        try {
            await proposal.cancel()
        }
        catch (e) {
            error(e)
        }
    }

    const queueProposal = async () => {
        try {
            await proposal.queue()
        }
        catch (e) {
            error(e)
        }
    }

    const executeProposal = async () => {
        try {
            await proposal.execute()
        }
        catch (e) {
            error(e)
        }
    }

    if (proposal.state === 'Succeeded') {
        return (
            <Layout>
                <div className="proposal-management__action">
                    <Button
                        block
                        size="md"
                        type="primary"
                        onClick={queueProposal}
                        disabled={proposal.queueLoading}
                        className="proposal-management__button"
                    >
                        {proposal.queueLoading ? (
                            <Icon icon="loader" className="spin" />
                        ) : (
                            intl.formatMessage({
                                id: 'PROPOSAL_MANAGEMENT_QUEUE',
                            })
                        )}
                    </Button>
                </div>
            </Layout>
        )
    }

    if (proposal.state === 'Queued' && proposal.executionTime && currentTime >= proposal.executionTime) {
        return (
            <Layout>
                <div className="proposal-management__action">
                    <Button
                        block
                        size="md"
                        type="primary"
                        onClick={executeProposal}
                        disabled={proposal.executeLoading}
                    >
                        {proposal.executeLoading ? (
                            <Icon icon="loader" className="spin" />
                        ) : (
                            intl.formatMessage({
                                id: 'PROPOSAL_MANAGEMENT_EXECUTE',
                            })
                        )}
                    </Button>
                </div>
            </Layout>
        )
    }

    if (proposal.state !== 'Executed' && proposal.proposer && proposal.proposer === tonWallet.address) {
        return (
            <Layout>
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

                {cancelPopupVisible && (
                    <CancelPopup
                        loading={proposal.cancelLoading}
                        onConfirm={cancelProposal}
                        onDismiss={hideCancelPopup}
                    />
                )}
            </Layout>
        )
    }

    return null
}

export const ProposalManagement = observer(ProposalManagementInner)
