import BigNumber from 'bignumber.js'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { type BaseSelectRef, Select } from '@/components/common/Select'
import { TokenIcon } from '@/components/common/TokenIcon'
import { BridgeUtils, TokenWallet } from '@/misc'
import { erc20TokenContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import { EverscaleToken, EvmToken, type EvmTokenData } from '@/models'
import { TokenImportPopup } from '@/modules/Bridge/components/TokenImportPopup'
import { TokenRemovePopup } from '@/modules/Bridge/components/TokenRemovePopup'
import { useBridge } from '@/modules/Bridge/providers'
import { type BridgeAsset } from '@/stores/BridgeAssetsService'
import {
    error,
    findNetwork,
    isEverscaleAddressValid,
    isEvmAddressValid,
    sliceAddress,
    storage,
    uniqueId,
} from '@/utils'

export const TokensAssetsFieldset = observer(() => {
    const intl = useIntl()
    const bridge = useBridge()

    const selectRef = React.useRef<BaseSelectRef>(null)
    const [token, setToken] = React.useState<BridgeAsset>()
    const [isImporting, setImporting] = React.useState(false)
    const [removingToken, setRemovingToken] = React.useState<BridgeAsset>()
    const [isRemoving, setRemoving] = React.useState<boolean>()
    const [isOpen, setOpen] = React.useState(false)

    const onChangeToken = async (value: string): Promise<void> => {
        setRemoving(undefined)
        await bridge.changeToken(value)
    }

    const onBlur: VoidFunction = () => {
        setOpen(false)
    }

    const onFocus: VoidFunction = () => {
        setOpen(true)
    }

    const onClear: VoidFunction = () => {
        setToken(undefined)
        bridge.setData('selectedToken', undefined)
    }

    const onImport: VoidFunction = () => {
        setImporting(true)
    }

    const onConfirmImport: VoidFunction = () => {
        if (token === undefined) {
            return
        }
        const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

        importedAssets[token.get('key')] = {
            chainId: token.chainId,
            decimals: token.decimals,
            icon: token.icon,
            key: token.get('key'),
            name: token.name,
            root: token.root,
            symbol: token.symbol,
        }

        storage.set('imported_assets', JSON.stringify(importedAssets))
        bridge.bridgeAssets.add(token)
        setImporting(false)
        setToken(undefined)
        bridge.changeToken(token.root).catch(error)
    }

    const onCloseImportPopup: VoidFunction = () => {
        setImporting(false)
    }

    const onInputKeyDown: VoidFunction = () => {
        setToken(undefined)
    }

    const onSearch = async (value: string): Promise<void> => {
        if (bridge.leftNetwork?.type === undefined || bridge.leftNetwork.chainId === undefined) {
            return
        }
        const root = value.toLowerCase()
        const { type, chainId } = bridge.leftNetwork
        const key = `${type}-${chainId}-${root}`
        if (bridge.bridgeAssets.has(key)) {
            bridge.setData('selectedToken', root)
        }
 else if (bridge.isFromTvm && isEverscaleAddressValid(root)) {
            try {
                const asset = await TokenWallet.getTokenFullDetails(root)

                if (asset?.address !== undefined) {
                    try {
                        const meta = await BridgeUtils.getAlienTokenRootMeta(asset.address)
                        const evmTokenAddress = `0x${new BigNumber(meta.base_token).toString(16).padStart(40, '0')}`
                        const evmToken = bridge.bridgeAssets.get('evm', meta.base_chainId, evmTokenAddress)
                        asset.logoURI = evmToken?.icon
                    }
 catch (e) {
                        //
                    }

                    setToken(
                        new EverscaleToken({
                            ...asset,
                            chainId,
                            key,
                            root,
                        }),
                    )
                    selectRef.current?.blur()
                }
            }
 catch (e) {
                //
            }
        }
 else if (bridge.isFromEvm && isEvmAddressValid(root)) {
            const network = findNetwork(bridge.leftNetwork.chainId, 'evm')

            if (network === undefined) {
                return
            }

            try {
                const [name, symbol, decimals] = await Promise.all([
                    erc20TokenContract(root, network.rpcUrl).methods.name().call(),
                    erc20TokenContract(root, network.rpcUrl).methods.symbol().call(),
                    erc20TokenContract(root, network.rpcUrl).methods.decimals().call(),
                ])

                const asset: EvmTokenData = {
                    address: root,
                    decimals: parseInt(decimals, 10),
                    name,
                    root,
                    symbol,
                }

                try {
                    const vault = bridge.bridgeAssets.multiAssets.evm_everscale.vaults.find(
                        v => v.chainId === bridge.leftNetwork?.chainId,
                    )

                    if (vault !== undefined) {
                        const vaultContract = evmMultiVaultContract(vault.vault, network.rpcUrl)
                        const result = await vaultContract.methods.natives(root).call()
                        const everscaleAddress = `${result.wid}:${new BigNumber(result.addr)
                            .toString(16)
                            .padStart(64, '0')}`
                        const everscaleToken = bridge.bridgeAssets.get('tvm', '42', everscaleAddress)
                        asset.logoURI = everscaleToken?.icon
                    }
                }
 catch (e) {
                    //
                }

                setToken(
                    new EvmToken({
                        ...asset,
                        chainId,
                        key,
                        root,
                    }),
                )
                selectRef.current?.blur()
            }
 catch (e) {
                //
            }
        }
    }

    const onRemoveImportedToken = (asset: BridgeAsset) => (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setRemovingToken(asset)
        setRemoving(true)
        setOpen(true)
    }

    const onConfirmRemoveToken: VoidFunction = () => {
        if (removingToken) {
            const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')
            delete importedAssets[removingToken.get('key')]
            storage.set('imported_assets', JSON.stringify(importedAssets))
            bridge.bridgeAssets.remove(removingToken)
            setRemovingToken(undefined)
            setRemoving(undefined)
            selectRef.current?.focus()
            setOpen(true)
        }
    }

    const onCloseRemoveToken: VoidFunction = () => {
        setRemovingToken(undefined)
        setRemoving(undefined)
        selectRef.current?.focus()
        setOpen(true)
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
                    <Select
                        ref={selectRef}
                        className="rc-select-assets rc-select--md"
                        notFoundContent="Token not found"
                        open={bridge.token ? undefined : isOpen}
                        optionFilterProp="search"
                        options={
                            token !== undefined
                                ? [
                                      {
                                          label: (
                                              <div className="token-select-label">
                                                  <TokenIcon address={token.root} size="xsmall" uri={token.icon} />
                                                  <div className="token-select-label__symbol text-truncate">
                                                      {`${token.symbol ?? 'Non-exist'} (${sliceAddress(token.root)})`}
                                                  </div>
                                                  {bridge.leftNetwork?.tokenType !== undefined && (
                                                      <div className="token-select-label__badge">
                                                          <span>{bridge.leftNetwork?.tokenType}</span>
                                                      </div>
                                                  )}
                                              </div>
                                          ),
                                          value: token.root,
                                      },
                                  ]
                                : bridge.tokens.map(asset => {
                                      const { icon, name, root, symbol } = asset
                                      const tooltipId = `remove${uniqueId()}`
                                      return {
                                          label: (
                                              <div className="token-select-label">
                                                  <div className="token-select-label-inner">
                                                      <TokenIcon address={root} size="xsmall" uri={icon} />
                                                      <div className="token-select-label__symbol text-truncate">
                                                          {symbol}
                                                      </div>
                                                      {process.env.NODE_ENV !== 'production' && (
                                                          <span className="text-muted">{sliceAddress(root)}</span>
                                                      )}
                                                  </div>
                                                  {bridge.bridgeAssets.isCustomToken(root) && (
                                                      <div>
                                                          <Icon
                                                              className="token-select-label__remove"
                                                              icon="close"
                                                              id={tooltipId}
                                                              ratio={0.8}
                                                              data-tooltip-content={intl.formatMessage({
                                                                  id: 'REMOVE_ASSET',
                                                              })}
                                                              onClick={onRemoveImportedToken(asset)}
                                                          />
                                                          <Tooltip
                                                              anchorId={tooltipId}
                                                              className="tooltip-common-small"
                                                              place="left"
                                                          />
                                                      </div>
                                                  )}
                                              </div>
                                          ),
                                          search: `${symbol} ${name} ${root}`,
                                          value: root,
                                      }
                                  })
                        }
                        placeholder={intl.formatMessage(
                            {
                                id: 'CROSSCHAIN_TRANSFER_ASSET_SELECT_TOKEN_PLACEHOLDER',
                            },
                            { blockchainName: bridge.leftNetwork?.label ?? '' },
                        )}
                        showSearch
                        allowClear={token !== undefined}
                        value={token?.root ?? bridge.token?.root}
                        virtual
                        onBlur={isRemoving ? undefined : onBlur}
                        onChange={token === undefined ? onChangeToken : undefined}
                        onClear={onClear}
                        onFocus={onFocus}
                        onSearch={onSearch}
                        onInputKeyDown={onInputKeyDown}
                        disabled={bridge.isFetching || bridge.evmPendingWithdrawal !== undefined}
                    />

                    {bridge.pipeline?.isBlacklisted && (
                        <Alert
                            className="margin-top"
                            text={intl.formatMessage(
                                {
                                    id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TEXT',
                                },
                                {
                                    blockchain: bridge.rightNetwork?.label,
                                    symbol: bridge.token?.symbol,
                                },
                                { ignoreTag: true },
                            )}
                            title={intl.formatMessage({
                                id: 'CROSSCHAIN_TRANSFER_ASSET_TOKEN_IS_BLACKLISTED_TITLE',
                            })}
                            type="danger"
                        />
                    )}
                </div>
                {token?.symbol !== undefined && token.root !== undefined && (
                    <>
                        <div className="crosschain-transfer__wallet">
                            <Button size="md" type="primary" onClick={onImport}>
                                Import
                            </Button>
                        </div>
                        {isImporting && (
                            <TokenImportPopup token={token} onClose={onCloseImportPopup} ocConfirm={onConfirmImport} />
                        )}
                    </>
                )}
                {removingToken && isRemoving && (
                    <TokenRemovePopup
                        token={removingToken}
                        onClose={onCloseRemoveToken}
                        ocConfirm={onConfirmRemoveToken}
                    />
                )}
            </div>
        </fieldset>
    )
})
