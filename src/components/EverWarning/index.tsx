import * as React from 'react'
import { useIntl } from 'react-intl'

import { storage } from '@/utils'

import styles from './index.module.scss'

export function EverWarning(): JSX.Element | null {
    const intl = useIntl()

    const [visible, setVisible] = React.useState(storage.get('everWarningShown') !== '0')

    const onClose = (e: React.FormEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setVisible(false)
        storage.set('testnetBannerStatus', '0')
    }

    if (!visible) {
        return null
    }

    return (
        <div className={styles.warning}>
            <div
                dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({ id: 'EVER_WARNING_NOTE' }, undefined, {
                        ignoreTag: true,
                    }),
                }}
            />
            <div className={styles.close} onClick={onClose}>
                <svg
                    width="10" height="10" viewBox="0 0 10 10"
                    fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 9L9 1M1 1L9 9" stroke="white" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
}
