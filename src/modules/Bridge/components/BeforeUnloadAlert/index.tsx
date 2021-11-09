import * as React from 'react'
import { useIntl } from 'react-intl'
import { Prompt } from 'react-router-dom'


type Props = {
    message?: string;
}


export function BeforeUnloadAlert({ message }: Props): JSX.Element {
    const intl = useIntl()

    React.useEffect(() => {
        window.onbeforeunload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            // eslint-disable-next-line no-param-reassign
            event.returnValue = ''
        }

        return () => {
            window.onbeforeunload = null
        }
    }, [])

    return (
        <Prompt
            when
            message={(location, action) => (
                (action === 'PUSH' && location.pathname.startsWith('/transfer'))
                    ? true
                    : message || intl.formatMessage({
                        id: 'BEFORE_UNLOAD_ALERT',
                    })
            )}
        />
    )
}
