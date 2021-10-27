import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer, Observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import { CreateRelayerLayout } from '@/modules/Relayers/components/CreateRelayerLayout'
import { CreateRelayerFormLayout } from '@/modules/Relayers/components/CreateRelayerFormLayout'
import { CreateRelayerStepLayout } from '@/modules/Relayers/components/CreateRelayerStepLayout'
import { CreateRelayerConfirmation } from '@/modules/Relayers/components/CreateRelayerConfirmation'
import { CreateRelayerTextField } from '@/modules/Relayers/components/CreateRelayerTextField'
import { CreateRelayerBalance } from '@/modules/Relayers/components/CreateRelayerBalance'
import { useStakingData } from '@/modules/Relayers/hooks/useStakingData'
import { useRelayerLink } from '@/modules/Relayers/hooks/useRelayerLink'
import { useDebounce } from '@/hooks/useDebounce'
import { useMounted } from '@/hooks/useMounted'

function RelayerFormInner(): JSX.Element {
    const intl = useIntl()
    const history = useHistory()
    const mounted = useMounted()
    const stakingData = useStakingData()
    const relayerLink = useRelayerLink(stakingData)
    const isLoading = useDebounce(!mounted || stakingData.isLoading, 300)

    React.useEffect(() => {
        if (relayerLink.isLinked) {
            history.push('/relayers/create')
        }
    }, [relayerLink.isLinked])

    return (
        <>
            {(relayerLink.isLinked || relayerLink.isConfirming) && (
                <CreateRelayerConfirmation
                    isValid={relayerLink.isValid}
                    isSubmitted={relayerLink.isSubmitted}
                    isLoading={relayerLink.isLoading}
                    requiredStake={stakingData.minRelayDeposit}
                    stakingBalance={stakingData.stakingBalance}
                    stakingBalanceIsValid={relayerLink.stakingBalanceIsValid}
                    stakingTokenSymbol={stakingData.stakingTokenSymbol}
                    stakingTokenDecimals={stakingData.stakingTokenDecimals}
                    tonWalletBalance={stakingData.tonWalletBalance}
                    tonWalletBalanceIsValid={relayerLink.tonWalletBalanceIsValid}
                    tonTokenSymbol={stakingData.tonTokenSymbol}
                    tonTokenDecimals={stakingData.tonTokenDecimals}
                    contractFee={stakingData.relayInitialTonDeposit}
                    onDismiss={relayerLink.cancel}
                    onSubmit={relayerLink.linkAccounts}
                />
            )}

            <CreateRelayerLayout
                tonTokenSymbol={stakingData.tonTokenSymbol}
                tonTokenDecimals={stakingData.tonTokenDecimals}
                relayInitialTonDeposit={stakingData.relayInitialTonDeposit}
                stakingBalance={stakingData.stakingBalance}
                stakingTokenDecimals={stakingData.stakingTokenDecimals}
                stakingTokenSymbol={stakingData.stakingTokenSymbol}
                relayTonPubkey={stakingData.relayTonPubkey}
                relayEthAddress={stakingData.relayEthAddress}
            >
                <CreateRelayerStepLayout
                    step="1"
                    isLoading={isLoading}
                    title={intl.formatMessage({
                        id: 'RELAYERS_CREATE_TITLE',
                    })}
                    hint={intl.formatMessage({
                        id: 'RELAYERS_CREATE_HINT_FIRST',
                    })}
                >
                    <CreateRelayerFormLayout
                        submitVisible
                        submitEnabled={relayerLink.isValid}
                        onSubmit={relayerLink.confirming}
                        onConnect={stakingData.connectTonWallet}
                        isLoading={isLoading}
                        isConnected={stakingData.isConnected}
                        submitLabel={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_SEND_BTN',
                        })}
                    >
                        <h3>
                            {intl.formatMessage({
                                id: 'RELAYERS_CREATE_FORM_LABEL',
                            })}
                        </h3>
                        <div>
                            <Observer>
                                {() => (
                                    <CreateRelayerTextField
                                        isValid={relayerLink.isTonPublicKeyValid}
                                        disabled={isLoading}
                                        value={relayerLink.tonPublicKey}
                                        onChange={relayerLink.setTonPublicKey}
                                        label={intl.formatMessage({
                                            id: 'RELAYERS_CREATE_FORM_TON_KEY',
                                        })}
                                        placeholder={intl.formatMessage({
                                            id: 'RELAYERS_CREATE_FORM_TON_KEY_PLACEHOLDER',
                                        })}
                                    />
                                )}
                            </Observer>

                            <Observer>
                                {() => (
                                    <CreateRelayerTextField
                                        disabled={isLoading}
                                        isValid={relayerLink.isEthAddressValid}
                                        value={relayerLink.ethAddress}
                                        onChange={relayerLink.setEthAddress}
                                        label={intl.formatMessage({
                                            id: 'RELAYERS_CREATE_FORM_ETH_KEY',
                                        })}
                                        placeholder={intl.formatMessage({
                                            id: 'RELAYERS_CREATE_FORM_ETH_KEY_PLACEHOLDER',
                                        })}
                                    />
                                )}
                            </Observer>

                            <hr />

                            <Observer>
                                {() => (
                                    <CreateRelayerBalance
                                        isSubmitted={relayerLink.isSubmitted}
                                        tonWalletBalanceIsValid={relayerLink.tonWalletBalanceIsValid}
                                        contractFee={stakingData.relayInitialTonDeposit}
                                        tonTokenSymbol={stakingData.tonTokenSymbol}
                                        tonTokenDecimals={stakingData.tonTokenDecimals}
                                        stakingBalance={stakingData.stakingBalance}
                                        requiredStake={stakingData.minRelayDeposit}
                                        stakingTokenDecimals={stakingData.stakingTokenDecimals}
                                        stakingTokenSymbol={stakingData.stakingTokenSymbol}
                                    />
                                )}
                            </Observer>
                        </div>
                    </CreateRelayerFormLayout>
                </CreateRelayerStepLayout>
            </CreateRelayerLayout>
        </>
    )
}

export const RelayerForm = observer(RelayerFormInner)
