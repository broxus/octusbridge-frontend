import * as React from 'react'
import { useIntl } from 'react-intl'

import { Icon } from '@/components/common/Icon'
import { Copy } from '@/components/common/Copy'
import { sliceAddress } from '@/utils'

import './index.scss'

type Props = {
    title?: string;
    address?: string;
    externalLink?: string;
}

export function Address({
    title,
    address,
    externalLink,
}: Props): JSX.Element {
    const intl = useIntl()

    return (
        <div className="explorer-link address">
            {address ? (
                <>
                    {externalLink ? (
                        <a
                            href={externalLink}
                            title={title}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {sliceAddress(address)}
                        </a>
                    ) : sliceAddress(address)}

                    <Copy text={address} id={`copy-${address}`}>
                        <Icon icon="copy" className="address__icon" />
                    </Copy>
                </>
            ) : (
                intl.formatMessage({
                    id: 'NO_VALUE',
                })
            )}
        </div>
    )
}
