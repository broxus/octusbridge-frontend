import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer, Observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'

import { Warning } from '@/components/common/Warning'
import { CreateRelayerLayout } from '@/modules/Relayers/components/CreateRelayerLayout'
import { CreateRelayerFormLayout } from '@/modules/Relayers/components/CreateRelayerFormLayout'
import { CreateRelayerStepLayout } from '@/modules/Relayers/components/CreateRelayerStepLayout'
import { CreateRelayerStatusIndicator } from '@/modules/Relayers/components/CreateRelayerStatusIndicator'
import { CreateRelayerSuccess } from '@/modules/Relayers/components/CreateRelayerSuccess'
import { useStakingData } from '@/modules/Relayers/hooks/useStakingData'
import { useRelayerBroadcast } from '@/modules/Relayers/hooks/useRelayerBroadcast'
import { useDebounce } from '@/hooks/useDebounce'
import { useMounted } from '@/hooks/useMounted'
import { amount } from '@/utils'

function RelayerStatusInner(): JSX.Element {
    const intl = useIntl()
    const history = useHistory()
    const mounted = useMounted()
    const stakingData = useStakingData()
    const relayerBroadcast = useRelayerBroadcast(stakingData)
    const isLoading = useDebounce(!mounted || stakingData.isLoading, 300)

    React.useEffect(() => {
        if (stakingData.isNeedToCreateKeys) {
            history.replace('/relayers/create/keys')
        }
    }, [stakingData.isNeedToCreateKeys])

    return (
        <>
            {
                relayerBroadcast.isSubmitted
                && stakingData.ethAddressConfirmed
                && stakingData.tonPubkeyConfirmed
                && (
                    <CreateRelayerSuccess />
                )
            }

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
                    step="2"
                    isLoading={isLoading}
                    isConnected={stakingData.isConnected}
                    onConnect={stakingData.connectTonWallet}
                    title={intl.formatMessage({
                        id: 'RELAYERS_CREATE_TITLE',
                    })}
                    hint={intl.formatMessage({
                        id: 'RELAYERS_CREATE_HINT_SECOND',
                    })}
                >
                    <CreateRelayerFormLayout
                        submitVisible
                        submitLink="/relayers/create/keys"
                        isLoading={isLoading}
                        isConnected={stakingData.isConnected}
                        onConnect={stakingData.connectTonWallet}
                        submitLabel={intl.formatMessage({
                            id: 'RELAYERS_CREATE_FORM_KEYS_BTN',
                        })}
                    >
                        <div>
                            <Observer>
                                {() => (
                                    <CreateRelayerStatusIndicator status={relayerBroadcast.tonPubkeyStatus} />
                                )}
                            </Observer>
                        </div>

                        <div>
                            {intl.formatMessage({
                                id: 'RELAYERS_CREATE_FORM_CONFIRM_TON',
                            })}
                        </div>

                        <div>
                            <Observer>
                                {() => (
                                    <CreateRelayerStatusIndicator status={relayerBroadcast.ethAddressStatus} />
                                )}
                            </Observer>
                        </div>

                        <div>
                            {intl.formatMessage({
                                id: 'RELAYERS_CREATE_FORM_CONFIRM_ETH',
                            })}
                        </div>

                        <div>
                            <Observer>
                                {() => (
                                    <CreateRelayerStatusIndicator status={relayerBroadcast.broadcastStatus} />
                                )}
                            </Observer>
                        </div>

                        <div>
                            <p>
                                {intl.formatMessage({
                                    id: 'RELAYERS_CREATE_FORM_CONFIRM_ADDRESS',
                                })}
                            </p>

                            {
                                !relayerBroadcast.isSubmitted
                                && !relayerBroadcast.tonWalletBalanceIsValid
                                && relayerBroadcast.broadcastStatus !== 'confirmed'
                                && stakingData.eventInitialBalance
                                && stakingData.tonTokenDecimals
                                && stakingData.tonTokenSymbol
                                && (
                                    <p>
                                        <Warning
                                            text={intl.formatMessage({
                                                id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING',
                                            }, {
                                                amount: amount(
                                                    stakingData.eventInitialBalance,
                                                    stakingData.tonTokenDecimals,
                                                ),
                                                symbol: stakingData.tonTokenSymbol,
                                            })}
                                        />
                                    </p>
                                )
                            }

                            {relayerBroadcast.broadcastStatus !== 'confirmed' && (
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    disabled={(
                                        !relayerBroadcast.tonWalletBalanceIsValid
                                        || relayerBroadcast.tonPubkeyStatus !== 'confirmed'
                                        || relayerBroadcast.ethAddressStatus !== 'confirmed'
                                        || relayerBroadcast.broadcastStatus === 'pending'
                                        || relayerBroadcast.broadcastStatus === 'checking'
                                    )}
                                    onClick={relayerBroadcast.broadcast}
                                >
                                    {intl.formatMessage({
                                        id: 'RELAYERS_CREATE_FORM_BROADCAST_BTN',
                                    })}
                                </button>
                            )}
                        </div>
                    </CreateRelayerFormLayout>
                </CreateRelayerStepLayout>
            </CreateRelayerLayout>
        </>
    )
}

export const RelayerStatus = observer(RelayerStatusInner)
