import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Button, ButtonProps } from '@/components/common/Button'
import { useAirdropStore } from '@/modules/Airdrop/stores/AirdropStore'
import { Icon } from '@/components/common/Icon'


function SubmitButton(): JSX.Element {
    const intl = useIntl()
    const airdrop = useAirdropStore()
    const wallet = airdrop.useTonWallet

    if (airdrop.isClaiming || airdrop.isFetching) {
        return (
            <Button
                aria-disabled="true"
                block
                className="form-submit"
                disabled
                size="lg"
                type="primary"
            >
                <Icon icon="loader" className="spin" />
            </Button>
        )
    }

    const buttonProps: ButtonProps = {}
    let buttonText: React.ReactNode = intl.formatMessage({ id: 'AIRDROP_BTN_TEXT_CLAIM' })

    switch (true) {
        case wallet.account === undefined:
            buttonProps.disabled = wallet.isConnecting
            buttonProps.onClick = async () => {
                await wallet.connect()
            }
            buttonText = intl.formatMessage({
                id: 'EVER_WALLET_CONNECT_BTN_TEXT',
            })
            break

        case airdrop.canClaim:
            buttonProps.onClick = async () => {
                await airdrop.claim()
            }
            break

        default:
            buttonProps.disabled = true
    }

    return (
        <Button
            aria-disabled={buttonProps.disabled}
            className="form-submit"
            block
            size="lg"
            type="primary"
            {...buttonProps}
        >
            {buttonText}
        </Button>
    )
}

export const AirdropSubmitButton = observer(SubmitButton)
