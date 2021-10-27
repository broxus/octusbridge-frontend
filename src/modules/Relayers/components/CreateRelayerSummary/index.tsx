import * as React from 'react'
import { useIntl } from 'react-intl'

import { Copy } from '@/components/common/Copy'
import { Icon } from '@/components/common/Icon'
import { amount, getNetworkByCurrency, sliceAddress } from '@/utils'

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

const ethNetwork = getNetworkByCurrency('ETH')

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

    const nullMessage = intl.formatMessage({
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
                        {tonPublicKey ? sliceAddress(tonPublicKey) : nullMessage}
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
                        ) : nullMessage}

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
                                ? amount(stakingBalance, stakingTokenDecimals)
                                : nullMessage
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
                            ? amount(contractFee, tonTokenDecimals)
                            : nullMessage
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
