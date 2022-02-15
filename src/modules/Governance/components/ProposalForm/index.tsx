import * as React from 'react'
import { useIntl } from 'react-intl'
import { Redirect } from 'react-router-dom'
import { Observer } from 'mobx-react-lite'

import { ContentLoader } from '@/components/common/ContentLoader'
import { Section } from '@/components/common/Section'
import { Button } from '@/components/common/Button'
import { Action, ActionPopup } from '@/modules/Governance/components/ProposalForm/ActionPopup'
import { Description } from '@/modules/Governance/components/ProposalForm/Description'
import { ActionList } from '@/modules/Governance/components/ProposalForm/ActionList'
import { TonButtonConnector } from '@/modules/TonWalletConnector/Button'
import { useProposalCreateContext } from '@/modules/Governance/providers'
import { ActionNetwork, EthAction, TonAction } from '@/modules/Governance/types'
import { error } from '@/utils'

import './index.scss'

// TODO: Markdown preview
export function ProposalForm(): JSX.Element {
    const intl = useIntl()
    const proposalCreate = useProposalCreateContext()

    const [proposalId, setProposalId] = React.useState<string>()
    const [description, setDescription] = React.useState<string | undefined>()
    const [actions, setActions] = React.useState<Action[]>([])
    const [actionIndex, setActionIndex] = React.useState<number | undefined>()
    const [actionFormVisible, setActionFormVisible] = React.useState(false)

    const valid = description && actions.length > 0

    const showActionForm = () => setActionFormVisible(true)

    const hideActionForm = () => {
        setActionFormVisible(false)
        setActionIndex(undefined)
    }

    const editAction = (index: number) => {
        setActionIndex(index)
        showActionForm()
    }

    const removeAction = (index: number) => {
        setActions(prev => {
            const next = [...prev]
            next.splice(index, 1)
            return next
        })
    }

    const changeAction = (action: Action) => {
        setActions(prev => {
            const next = [...prev]
            if (actionIndex !== undefined) {
                next[actionIndex] = action
            }
            else {
                next.push(action)
            }
            return next
        })

        hideActionForm()
    }

    const submit = async () => {
        if (!description) {
            return
        }
        try {
            const tonActions = actions.reduce<TonAction[]>((acc, item) => (
                item.network === ActionNetwork.TON ? [...acc, item.data] : acc
            ), [])
            const ethActions = actions.reduce<EthAction[]>((acc, item) => (
                item.network === ActionNetwork.ETH ? [...acc, item.data] : acc
            ), [])
            const id = await proposalCreate.submit(description, tonActions, ethActions)

            setProposalId(id)
        }
        catch (e) {
            error(e)
        }
    }

    if (proposalId) {
        return (
            <Redirect to={`/governance/proposals/${proposalId}`} />
        )
    }

    return (
        <Section className="proposal-form">
            {actionFormVisible && (
                <ActionPopup
                    action={actionIndex !== undefined ? actions[actionIndex] : undefined}
                    onDismiss={hideActionForm}
                    onSubmit={changeAction}
                />
            )}

            <div className="proposal-form__layout">
                <div className="card card--flat card--small">
                    <div className="proposal-form__title">
                        {intl.formatMessage({
                            id: 'PROPOSAL_FORM_DESCRIPTION',
                        })}
                    </div>

                    <Observer>
                        {() => (
                            <Description
                                onChange={setDescription}
                                disabled={proposalCreate.createLoading}
                            />
                        )}
                    </Observer>
                </div>

                <div className="card card--flat card--small">
                    <div className="proposal-form__title">
                        {intl.formatMessage({
                            id: 'PROPOSAL_FORM_ACTIONS',
                        })}
                    </div>

                    <div className="proposal-form-actions">
                        <Observer>
                            {() => (
                                <ActionList
                                    actions={actions}
                                    onEdit={editAction}
                                    onRemove={removeAction}
                                    onAdd={showActionForm}
                                    disabled={proposalCreate.createLoading}
                                />
                            )}
                        </Observer>
                    </div>
                </div>
            </div>

            <div className="proposal-form__footer">
                <TonButtonConnector size="md" block={false}>
                    <Observer>
                        {() => (
                            <Button
                                size="md"
                                type="primary"
                                disabled={!valid || proposalCreate.createLoading}
                                onClick={submit}
                                className="proposal-form__submit"
                            >
                                {intl.formatMessage({
                                    id: 'PROPOSAL_FORM_SUBMIT',
                                })}
                                {proposalCreate.createLoading && (
                                    <ContentLoader slim iconRatio={0.8} />
                                )}
                            </Button>
                        )}
                    </Observer>
                </TonButtonConnector>
            </div>
        </Section>
    )
}
