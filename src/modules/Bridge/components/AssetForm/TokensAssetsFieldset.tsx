import * as React from 'react'
import BigNumber from 'bignumber.js'
import { Address } from 'everscale-inpage-provider'
import { Observer } from 'mobx-react-lite'
import { useIntl } from 'react-intl'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { BaseSelectRef, Select } from '@/components/common/Select'
import { TokenIcon } from '@/components/common/TokenIcon'
import rpc from '@/hooks/useRpcClient'
import { TokenAbi, TokenWallet } from '@/misc'
import { TokenImportPopup } from '@/modules/Bridge/components/TokenImportPopup'
import { useBridge } from '@/modules/Bridge/providers'
import { TokenAsset } from '@/stores/TokensAssetsService'
import {
    isEverscaleAddressValid,
    isEvmAddressValid,
    sliceAddress,
    storage,
} from '@/utils'


export function TokensAssetsFieldset(): JSX.Element {
    const intl = useIntl()
    const { bridge } = useBridge()
    const tokensAssets = bridge.useTokensAssets

    const selectRef = React.useRef<BaseSelectRef>(null)
    const [token, setToken] = React.useState<TokenAsset | undefined>()
    const [isImporting, setImporting] = React.useState(false)

    const onChangeToken = (value?: string) => {
        bridge.setData('selectedToken', value)
    }

    const onClear = () => {
        setToken(undefined)
        bridge.setData('selectedToken', undefined)
    }

    const onImport = () => {
        setImporting(true)
    }

    const onConfirmImport = () => {
        if (token === undefined) {
            return
        }
        const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

        importedAssets[token.key] = {
            decimals: token.decimals,
            name: token.name,
            root: token.root,
            icon: token.icon,
            symbol: token.symbol,
            chainId: token.chainId,
            key: token.key,
        }

        storage.set('imported_assets', JSON.stringify(importedAssets))
        tokensAssets.add(token)
        bridge.setData('selectedToken', token.root)
        setImporting(false)
        setToken(undefined)
    }

    const onCloseImportPopup = () => {
        setImporting(false)
    }

    const onInputKeyDown = () => {
        setToken(undefined)
    }

    const onSearch = async (value: string) => {
        if (bridge.leftNetwork?.type === undefined || bridge.leftNetwork.chainId === undefined) {
            return
        }
        const root = value.toLowerCase()
        const { type, chainId } = bridge.leftNetwork
        const key = `${type}-${chainId}-${root}`
        if (tokensAssets.has(key)) {
            bridge.setData('selectedToken', root)
        }
        else if (bridge.isFromEverscale && isEverscaleAddressValid(root)) {
            try {
                const asset = await TokenWallet.getTokenFullDetails(root) as TokenAsset

                try {
                    const rootContract = new rpc.Contract(TokenAbi.TokenRootAlienEVM, new Address(asset.root))
                    const meta = await rootContract.methods.meta({ answerId: 0 }).call()
                    const evmTokenAddress = `0x${new BigNumber(meta.base_token).toString(16).padStart(40, '0')}`
                    const evmToken = tokensAssets.get('evm', meta.base_chainId, evmTokenAddress)
                    asset.icon = evmToken?.icon
                }
                catch (e) {
                    //
                }

                setToken({
                    ...asset,
                    root,
                    key,
                    chainId,
                    pipelines: [],
                })
                selectRef.current?.blur()
            }
            catch (e) {
                //
            }
        }
        else if (bridge.isFromEvm && isEvmAddressValid(root)) {
            try {
                const contract = tokensAssets.getEvmTokenContract(root, bridge.leftNetwork.chainId)
                const [name, symbol, decimals] = await Promise.all([
                    contract?.methods.name().call(),
                    contract?.methods.symbol().call(),
                    contract?.methods.decimals().call(),
                ])

                const asset = {
                    root,
                    decimals: parseInt(decimals, 10),
                    name,
                    symbol,
                } as TokenAsset

                try {
                    const vault = tokensAssets.multiAssets.evm_everscale.vaults.find(v => (
                        v.chainId === bridge.leftNetwork?.chainId
                    ))

                    if (vault !== undefined) {
                        const vaultContract = tokensAssets.getEvmTokenMultiVaultContract(
                            vault.vault,
                            bridge.leftNetwork.chainId,
                        )
                        const result = await vaultContract?.methods.natives(root).call()
                        const everscaleAddress = `${result.wid}:${new BigNumber(result.addr).toString(16).padStart(64, '0')}`
                        const everscaleToken = tokensAssets.get('everscale', '1', everscaleAddress)
                        asset.icon = everscaleToken?.icon
                    }
                }
                catch (e) {
                    //
                }

                setToken({
                    ...asset,
                    root,
                    key,
                    chainId,
                    pipelines: [],
                })
                selectRef.current?.blur()
            }
            catch (e) {
                //
            }
        }
    }

    return (
        <fieldset className="form-fieldset">
            <legend className="form-legend">
                {intl.formatMessage({
                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_LABEL',
                })}
            </legend>
            <div className="crosschain-transfer__controls">
                <div className="crosschain-transfer__control">
                    <Observer>
                        {() => (
                            <Select
                                ref={selectRef}
                                className="rc-select-assets rc-select--md"
                                notFoundContent="Token not found"
                                optionFilterProp="search"
                                options={token !== undefined ? [{
                                    label: (
                                        <div className="token-select-label">
                                            <TokenIcon
                                                address={token.root}
                                                size="xsmall"
                                                uri={token.icon}
                                            />
                                            <div className="token-select-label__symbol text-truncate">
                                                {`${token.symbol ?? 'Non-exist'} (${sliceAddress(token.root)})`}
                                            </div>
                                            {bridge.leftNetwork?.tokenType !== undefined && (
                                                <div className="token-select-label__badge">
                                                    <span>
                                                        {bridge.leftNetwork?.tokenType}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    value: token.root,
                                }] : bridge.tokens.map(({
                                    icon,
                                    name,
                                    root,
                                    symbol,
                                }) => ({
                                    label: (
                                        <div className="token-select-label">
                                            <TokenIcon
                                                address={root}
                                                size="xsmall"
                                                uri={icon}
                                            />
                                            <div className="token-select-label__symbol text-truncate">
                                                {symbol}
                                            </div>
                                            {bridge.leftNetwork?.tokenType !== undefined && (
                                                <div className="token-select-label__badge">
                                                    <span>
                                                        {bridge.leftNetwork?.tokenType}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    search: `${symbol} ${name} ${root}`,
                                    value: root,
                                }))}
                                placeholder={intl.formatMessage({
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                                }, { blockchainName: bridge.leftNetwork?.name ?? '' })}
                                showSearch
                                allowClear={token !== undefined}
                                value={token?.root ?? bridge.token?.root}
                                virtual
                                onChange={token === undefined ? onChangeToken : undefined}
                                onClear={onClear}
                                onSearch={onSearch}
                                onInputKeyDown={onInputKeyDown}
                                disabled={bridge.isFetching || bridge.evmPendingWithdrawal !== undefined}
                            />
                        )}
                    </Observer>

                    <Observer>
                        {() => (
                            <>
                                {bridge.pipeline?.isBlacklisted && (
                                    <Alert
                                        className="margin-top"
                                        text={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TEXT',
                                        }, {
                                            blockchain: bridge.rightNetwork?.label,
                                            symbol: bridge.token?.symbol,
                                        }, { ignoreTag: true })}
                                        title={intl.formatMessage({
                                            id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TITLE',
                                        })}
                                        type="danger"
                                    />
                                )}
                            </>
                        )}
                    </Observer>
                </div>
                {(token?.symbol !== undefined && token.root !== undefined) && (
                    <>
                        <div className="crosschain-transfer__wallet">
                            <Button
                                size="md"
                                type="primary"
                                onClick={onImport}
                            >
                                Import
                            </Button>
                        </div>
                        {isImporting && (
                            <TokenImportPopup
                                token={token}
                                onClose={onCloseImportPopup}
                                ocConfirm={onConfirmImport}
                            />
                        )}
                    </>
                )}
            </div>
        </fieldset>
    )
}
