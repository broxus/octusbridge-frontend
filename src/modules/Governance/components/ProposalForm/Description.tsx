import * as React from 'react'
import { useIntl } from 'react-intl'

import { Counter } from '@/components/common/Counter'
import { Textarea } from '@/components/common/Textarea'
import { TextField } from '@/modules/Governance/components/ProposalForm/TextField'

import './index.scss'

const TOTAL_LENGTH = 4010
const TITLE_LIMIT = 100
const LINK_LIMIT = 100
const MIN_JSON_OVERHEAD = 10
const DESCRIPTION_LIMIT = TOTAL_LENGTH - TITLE_LIMIT - LINK_LIMIT - MIN_JSON_OVERHEAD

type Props = {
    disabled?: boolean;
    onChange: (value?: string) => void;
}

export function Description({
    disabled,
    onChange,
}: Props): JSX.Element {
    const intl = useIntl()
    const [description, setDescription] = React.useState('')
    const [title, setTitle] = React.useState('')
    const [link, setLink] = React.useState('')

    const titleJson = JSON.stringify(title)
    const linkJson = JSON.stringify(link)
    const descriptionJson = JSON.stringify(description)

    const titleValid = title.length > 0 && titleJson.length - 2 <= TITLE_LIMIT
    const linkValid = link.length > 0 && linkJson.length - 2 <= LINK_LIMIT
    const descriptionValid = descriptionJson.length - 2 <= DESCRIPTION_LIMIT

    React.useEffect(() => {
        if (titleValid && linkValid && descriptionValid) {
            onChange(JSON.stringify([title, link, description]))
        }
        else {
            onChange(undefined)
        }
    }, [title, link, description])

    return (
        <>
            <TextField
                value={title}
                onChange={setTitle}
                valid={titleValid}
                limit={TITLE_LIMIT}
                length={titleJson.length - 2}
                disabled={disabled}
                placeholder={intl.formatMessage({
                    id: 'PROPOSAL_FORM_PLACEHOLDER',
                })}
                label={intl.formatMessage({
                    id: 'PROPOSAL_FORM_LABEL_TITLE',
                })}
            />

            <TextField
                valid={linkValid}
                value={link}
                onChange={setLink}
                limit={LINK_LIMIT}
                length={linkJson.length - 2}
                disabled={disabled}
                placeholder={intl.formatMessage({
                    id: 'PROPOSAL_FORM_PLACEHOLDER',
                })}
                label={intl.formatMessage({
                    id: 'PROPOSAL_FORM_LABEL_LINK',
                })}
            />

            <div className="proposal-form__field">
                <legend className="form-legend">
                    {intl.formatMessage({
                        id: 'PROPOSAL_FORM_LABEL_DESCRIPTION',
                    })}
                </legend>

                <Textarea
                    valid={descriptionValid}
                    value={description}
                    rows={10}
                    showCounter={false}
                    disabled={disabled}
                    onChange={setDescription}
                    placeholder={intl.formatMessage({
                        id: 'PROPOSAL_FORM_PLACEHOLDER',
                    })}
                />

                <Counter
                    maxLength={DESCRIPTION_LIMIT}
                    length={descriptionJson.length - 2}
                />
            </div>
        </>
    )
}
