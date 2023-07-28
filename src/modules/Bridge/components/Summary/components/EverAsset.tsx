import * as React from 'react'
import { Tooltip } from 'react-tooltip'

import { EverscanAccountLink } from '@/components/common/EverscanAccountLink'
import { useBridge } from '@/modules/Bridge/providers'
import { sliceAddress, uniqueId } from '@/utils'

export function EverAsset({ address }: { address: string }): JSX.Element {
    const bridge = useBridge()

    const isMount = React.useRef(false)
    const linkId = React.useRef(`link${uniqueId()}-${uniqueId()}`)

    const [isOpen, setIsOpen] = React.useState(false)

    const addToEverAsset = (root: string) => async () => {
        try {
            const result = await bridge.tvmWallet.addAsset(root)
            setIsOpen(result?.newAsset === false)
        }
        catch (e) {}
        finally {
            setTimeout(() => {
                if (isMount.current) {
                    setIsOpen(false)
                }
            }, 5000)
        }
    }

    React.useEffect(() => {
        isMount.current = true
        return () => {
            isMount.current = false
        }
    }, [])

    return (
        <>
            <EverscanAccountLink
                key="token-link"
                addAsset
                address={address}
                className="text-regular"
                onAddAsset={addToEverAsset(address)}
            >
                {sliceAddress(address)}
            </EverscanAccountLink>
            <span
                data-tooltip-content="Already added"
                id={linkId.current}
            />
            <Tooltip
                anchorId={linkId.current}
                className="tooltip-common"
                noArrow
                isOpen={isOpen}
                place="top"
            />
        </>
    )
}
