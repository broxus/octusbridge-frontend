import * as React from 'react'
import { useIntl } from 'react-intl'

import { RelayEvmNetworkChainId } from '@/config'
import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import {
    findNetwork,
    formattedAmount,
    formattedTokenAmount,
    sliceAddress,
} from '@/utils'

type Props = {
    tonTokenSymbol?: string;
    tonTokenDecimals?: number;
    contractFee?: string;
    tonPublicKey?: string;
    ethAddress?: string;
    stakingTokenSymbol?: string;
    stakingTokenDecimals?: number;
    stakingBalance?: string;
}

const ethNetwork = findNetwork(RelayEvmNetworkChainId, 'evm')

export function CreateRelayerSummary({
    tonTokenSymbol,
    tonTokenDecimals,
    contractFee,
    tonPublicKey,
    ethAddress,
    stakingTokenSymbol,
    stakingTokenDecimals,
    stakingBalance,
}: Props): JSX.Element {
    const intl = useIntl()

    const noValue = intl.formatMessage({
        id: 'NO_VALUE',
    })

    return (
        <div className="card card--ghost card--flat card--small">
            <h3 className="card-title">
                {intl.formatMessage({
                    id: 'RELAYERS_SUMMARY_TITLE',
                })}
            </h3>

            <ul className="summary">
                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_SUMMARY_TON_PUB_KEY',
                        })}
                    </span>

                    <div className="explorer-link">
                        {tonPublicKey ? sliceAddress(tonPublicKey.slice(2)) : noValue}
                        {tonPublicKey && (
                            <Copy text={tonPublicKey} id={`copy-${tonPublicKey}`}>
                                <Icon icon="copy" />
                            </Copy>
                        )}
                    </div>
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_SUMMARY_ETH_ADDRESS',
                        })}
                    </span>
                    <div className="explorer-link">
                        {ethAddress ? (
                            <>
                                {ethNetwork ? (
                                    <a
                                        href={`${ethNetwork.explorerBaseUrl}address/${ethAddress}`}
                                        title={intl.formatMessage({ id: 'OPEN_IN_ETHERSCAN' })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {sliceAddress(ethAddress)}
                                    </a>
                                ) : sliceAddress(ethAddress)}
                            </>
                        ) : noValue}

                        {ethAddress && (
                            <Copy text={ethAddress} id={`copy-${ethAddress}`}>
                                <Icon icon="copy" />
                            </Copy>
                        )}
                    </div>
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: stakingTokenSymbol
                                ? 'RELAYERS_SUMMARY_STAKING_BALANCE'
                                : 'RELAYERS_SUMMARY_STAKING_BALANCE_SHORT',
                        }, {
                            symbol: stakingTokenSymbol,
                        })}
                    </span>
                    <span>
                        {
                            stakingBalance !== undefined && stakingTokenDecimals !== undefined
                                ? formattedTokenAmount(stakingBalance, stakingTokenDecimals)
                                : noValue
                        }
                    </span>
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_SUMMARY_CONTRACT_FEE',
                        }, {
                            symbol: tonTokenSymbol,
                        })}
                    </span>
                    {
                        contractFee !== undefined && tonTokenDecimals !== undefined
                            ? formattedAmount(
                                contractFee,
                                tonTokenDecimals,
                                { preserve: true, roundOn: false },
                            )
                            : noValue
                    }
                </li>

                <li>
                    <span className="text-muted">
                        {intl.formatMessage({
                            id: 'RELAYERS_SUMMARY_CONFIRM_ETH',
                        })}
                    </span>
                    0.1
                </li>
            </ul>
        </div>
    )
}
