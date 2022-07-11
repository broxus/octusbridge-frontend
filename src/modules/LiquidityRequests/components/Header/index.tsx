import BigNumber from 'bignumber.js'
import * as React from 'react'
import { useIntl } from 'react-intl'
import { observer } from 'mobx-react-lite'

import {
    DateFilter, FilterField, Filters, NUM_REGEXP,
    RadioFilter, TextFilter,
} from '@/components/common/Filters'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { useBridgeAssets } from '@/stores/BridgeAssetsService'
import { SearchNotInstantFilters, SearchNotInstantStatus } from '@/modules/LiquidityRequests/types'
import { useLiquidityRequests } from '@/modules/LiquidityRequests/providers/LiquidityRequestsProvider'
import { formattedAmount } from '@/utils'
import { networks } from '@/config'

import './index.scss'

const evmNetworks = networks.filter(item => item.type === 'evm')

type Props = {
    filters: SearchNotInstantFilters;
    onChangeFilters: (filters: SearchNotInstantFilters) => void;
}

function LiquidityRequestsHeaderInner({
    filters,
    onChangeFilters,
}: Props): JSX.Element {
    const intl = useIntl()
    const bridgeAssets = useBridgeAssets()
    const liquidityRequests = useLiquidityRequests()

    const tokenSymbol = liquidityRequests.selected.length > 0
        ? bridgeAssets.get('everscale', '1', liquidityRequests.selected[0].tonTokenAddress)?.symbol
        : undefined

    const evmTokenDecimals = liquidityRequests.selected.length > 0
        ? liquidityRequests.getEvmTokenDecimals(
            liquidityRequests.selected[0].ethTokenAddress,
            liquidityRequests.selected[0].chainId.toString(),
        )
        : undefined

    const totalAmount = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected
            .reduce((acc, item) => (
                acc.plus(item.currentAmount)
            ), new BigNumber(0))
            .toFixed()
        : undefined

    const totalBounty = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected
            .reduce((acc, item) => (
                acc.plus(item.bounty)
            ), new BigNumber(0))
            .toFixed()
        : undefined

    const selectedChainId = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected[0].chainId.toString()
        : undefined

    const selectedToken = liquidityRequests.selected.length > 0
        ? liquidityRequests.selected[0].ethTokenAddress
        : undefined

    const searchParams = liquidityRequests.selected.length > 0
        ? new URLSearchParams(
            liquidityRequests.selected.map(item => ([
                'id', `${item.ethUserAddress}.${item.userId}`,
            ])),
        ).toString()
        : undefined

    const depositLink = selectedChainId && selectedToken && searchParams
        ? `/bridge/liquidity-requests/${selectedChainId}/${selectedToken}?${searchParams}`
        : undefined

    return (
        <div className="liquidity-requests-header">
            <div className="liquidity-requests-header__spend">
                <div className="liquidity-requests-header__label">
                    {intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_HEADER_YOU_SPEND',
                    })}
                </div>
                <div className="liquidity-requests-header__value">
                    {tokenSymbol && totalAmount && evmTokenDecimals ? (
                        intl.formatMessage({
                            id: 'AMOUNT',
                        }, {
                            value: formattedAmount(totalAmount, evmTokenDecimals),
                            symbol: tokenSymbol,
                        })
                    ) : intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
                </div>
            </div>

            <div className="liquidity-requests-header__get">
                <div className="liquidity-requests-header__label">
                    {intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_HEADER_YOU_GET',
                    })}
                </div>
                <div className="liquidity-requests-header__value">
                    {tokenSymbol && totalBounty && totalAmount && evmTokenDecimals ? (
                        intl.formatMessage({
                            id: 'AMOUNT',
                        }, {
                            value: formattedAmount(
                                new BigNumber(totalBounty).plus(totalAmount).toFixed(),
                                evmTokenDecimals,
                            ),
                            symbol: tokenSymbol,
                        })
                    ) : intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
                </div>
            </div>

            <div className="liquidity-requests-header__reward">
                <div className="liquidity-requests-header__label">
                    {intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_HEADER_TOTAL_REWARD',
                    })}
                </div>
                <div className="liquidity-requests-header__value">
                    {tokenSymbol && totalBounty && evmTokenDecimals ? (
                        intl.formatMessage({
                            id: 'AMOUNT',
                        }, {
                            value: formattedAmount(totalBounty, evmTokenDecimals),
                            symbol: tokenSymbol,
                        })
                    ) : intl.formatMessage({
                        id: 'NO_VALUE',
                    })}
                </div>
            </div>

            <div className="liquidity-requests-header__submit">
                <Button
                    block
                    type="primary"
                    disabled={!depositLink}
                    link={depositLink}
                >
                    {intl.formatMessage({
                        id: 'LIQUIDITY_REQUESTS_HEADER_SUBMIT',
                    })}
                </Button>
            </div>

            <div className="liquidity-requests-header__filter">
                <Filters<SearchNotInstantFilters>
                    block
                    filters={filters}
                    onChange={onChangeFilters}
                >
                    {(localFilters, changeFilter) => (
                        <>
                            <FilterField
                                title={intl.formatMessage({
                                    id: 'LIQUIDITY_REQUESTS_FILTER_BOUNTY',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    value={localFilters.bountyGe}
                                    onChange={changeFilter('bountyGe')}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    value={localFilters.bountyLe}
                                    onChange={changeFilter('bountyLe')}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                />
                            </FilterField>

                            <FilterField
                                title={intl.formatMessage({
                                    id: 'LIQUIDITY_REQUESTS_FILTER_AMOUNT',
                                })}
                            >
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    value={localFilters.volumeExecGe}
                                    onChange={changeFilter('volumeExecGe')}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_FROM',
                                    })}
                                />
                                <TextFilter
                                    regexp={NUM_REGEXP}
                                    value={localFilters.volumeExecLe}
                                    onChange={changeFilter('volumeExecLe')}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_TO',
                                    })}
                                />
                            </FilterField>

                            <FilterField
                                title={intl.formatMessage({
                                    id: 'LIQUIDITY_REQUESTS_FILTER_DATE',
                                })}
                            >
                                <DateFilter
                                    value={localFilters.createdAtGe}
                                    onChange={changeFilter('createdAtGe')}
                                />
                                <DateFilter
                                    value={localFilters.createdAtLe}
                                    onChange={changeFilter('createdAtLe')}
                                />
                            </FilterField>

                            <FilterField
                                title={intl.formatMessage({
                                    id: 'LIQUIDITY_REQUESTS_FILTER_CHAIN_ID',
                                })}
                            >
                                <Select
                                    allowClear
                                    value={localFilters.chainId?.toString()}
                                    onChange={changeFilter('chainId')}
                                    options={evmNetworks.map(item => ({
                                        value: item.chainId,
                                        label: item.label,
                                    }))}
                                    placeholder={intl.formatMessage({
                                        id: 'FILTERS_BC',
                                    })}
                                />
                            </FilterField>

                            <FilterField
                                title={intl.formatMessage({
                                    id: 'LIQUIDITY_REQUESTS_FILTER_STATUS',
                                })}
                            >
                                <RadioFilter<SearchNotInstantStatus>
                                    onChange={changeFilter('status')}
                                    value={localFilters.status}
                                    labels={[{
                                        id: 'Close',
                                        name: intl.formatMessage({
                                            id: 'LIQUIDITY_REQUESTS_FILTER_STATUS_CLOSE',
                                        }),
                                    }, {
                                        id: 'Open',
                                        name: intl.formatMessage({
                                            id: 'LIQUIDITY_REQUESTS_FILTER_STATUS_OPEN',
                                        }),
                                    }]}
                                />
                            </FilterField>
                        </>
                    )}
                </Filters>
            </div>
        </div>
    )
}

export const LiquidityRequestsHeader = observer(LiquidityRequestsHeaderInner)
