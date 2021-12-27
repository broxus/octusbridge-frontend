import * as React from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@/components/common/Button'
import { UnlockForm } from '@/modules/Governance/components/UnlockForm'

type Props = {
    onSuccess?: () => void;
}

export function UnlockAllButton({
    onSuccess,
}: Props): JSX.Element {
    const intl = useIntl()
    const [formVisible, setFormVisible] = React.useState(false)

    const showForm = () => setFormVisible(true)
    const hideForm = () => setFormVisible(false)

    return (
        <>
            <Button
                type="secondary"
                onClick={showForm}
            >
                {intl.formatMessage({
                    id: 'PROPOSALS_UNLOCK_ALL',
                })}
            </Button>

            {formVisible && (
                <UnlockForm
                    onSuccess={onSuccess}
                    onDismiss={hideForm}
                />
            )}
        </>
    )
}
