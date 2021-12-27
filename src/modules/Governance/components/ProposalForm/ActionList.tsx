import * as React from 'react'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { Button } from '@/components/common/Button'
import { Action } from '@/modules/Governance/components/ProposalForm/ActionPopup'
import { ActionItem } from '@/modules/Governance/components/ProposalForm/ActionItem'
import { ActionNetwork } from '@/modules/Governance/types'

import './index.scss'

type Props = {
    actions: Action[];
    disabled?: boolean;
    onEdit: (index: number) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
}

export function ActionList({
    actions,
    disabled,
    onEdit,
    onRemove,
    onAdd,
}: Props): JSX.Element | null {
    const intl = useIntl()

    const actionsIndexed = actions.map((action, index) => ({ index, action }))
    const tonActions = actionsIndexed.filter(item => item.action.network === ActionNetwork.TON)
    const ethActions = actionsIndexed.filter(item => item.action.network === ActionNetwork.ETH)

    const onClickEdit = (index: number) => () => {
        onEdit(index)
    }

    const onClickRemove = (index: number) => () => {
        onRemove(index)
    }

    return (
        <>
            {(tonActions.length > 0 || ethActions.length > 0) && (
                <div className="proposal-form-action-list">
                    {tonActions.length > 0 && (
                        <>
                            <div className="proposal-form-action-list__title">
                                {intl.formatMessage({
                                    id: 'PROPOSAL_FORM_TON_ACTIONS',
                                })}
                            </div>

                            <div className="proposal-form-action-list__items">
                                {tonActions.map(item => (
                                    <ActionItem
                                        key={item.index}
                                        target={item.action.data.target}
                                        onEdit={onClickEdit(item.index)}
                                        onRemove={onClickRemove(item.index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {ethActions.length > 0 && (
                        <>
                            <div className="proposal-form-action-list__title">
                                {intl.formatMessage({
                                    id: 'PROPOSAL_FORM_ETH_ACTIONS',
                                })}
                            </div>

                            <div className="proposal-form-action-list__items">
                                {ethActions.map(item => (
                                    <ActionItem
                                        key={item.index}
                                        target={item.action.data.target}
                                        onEdit={onClickEdit(item.index)}
                                        onRemove={onClickRemove(item.index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <Button
                block
                size="md"
                type="secondary"
                className="proposal-form-actions__add"
                disabled={disabled}
                onClick={onAdd}
            >
                <Icon icon="add" />
                {intl.formatMessage({
                    id: 'PROPOSAL_FORM_ADD_ACTION',
                })}
            </Button>
        </>
    )
}
