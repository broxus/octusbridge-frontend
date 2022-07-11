import * as React from 'react'
import { observer, Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { useDebounce } from '@/hooks/useDebounce'
import { useMounted } from '@/hooks/useMounted'
import { DexConstants } from '@/misc'
import { CreateRelayerLayout } from '@/modules/Relayers/components/CreateRelayerLayout'
import { CreateRelayerFormLayout } from '@/modules/Relayers/components/CreateRelayerFormLayout'
import { CreateRelayerStepLayout } from '@/modules/Relayers/components/CreateRelayerStepLayout'
import { CreateRelayerStatusIndicator } from '@/modules/Relayers/components/CreateRelayerStatusIndicator'
import { CreateRelayerSuccess } from '@/modules/Relayers/components/CreateRelayerSuccess'
import { useStakingData } from '@/modules/Relayers/hooks/useStakingData'
import { useRelayerBroadcast } from '@/modules/Relayers/hooks/useRelayerBroadcast'
import { formattedAmount } from '@/utils'

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
                tonTokenSymbol={DexConstants.CoinSymbol}
                tonTokenDecimals={DexConstants.CoinDecimals}
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
                                && (
                                    <p>
                                        <Alert
                                            text={intl.formatMessage({
                                                id: 'RELAYERS_CREATE_CONFIRMATION_BALANCE_WARNING',
                                            }, {
                                                amount: formattedAmount(
                                                    stakingData.eventInitialBalance,
                                                    DexConstants.CoinDecimals,
                                                    { preserve: true, roundOn: false },
                                                ),
                                                symbol: DexConstants.CoinSymbol,
                                            }, { ignoreTag: true })}
                                        />
                                    </p>
                                )
                            }

                            {relayerBroadcast.broadcastStatus !== 'confirmed' && (
                                <Button
                                    disabled={(
                                        !relayerBroadcast.tonWalletBalanceIsValid
                                        || relayerBroadcast.tonPubkeyStatus !== 'confirmed'
                                        || relayerBroadcast.ethAddressStatus !== 'confirmed'
                                        || relayerBroadcast.broadcastStatus === 'pending'
                                        || relayerBroadcast.broadcastStatus === 'checking'
                                    )}
                                    type="primary"
                                    onClick={relayerBroadcast.broadcast}
                                >
                                    {intl.formatMessage({
                                        id: 'RELAYERS_CREATE_FORM_BROADCAST_BTN',
                                    })}
                                </Button>
                            )}
                        </div>
                    </CreateRelayerFormLayout>
                </CreateRelayerStepLayout>
            </CreateRelayerLayout>
        </>
    )
}

export const RelayerStatus = observer(RelayerStatusInner)
