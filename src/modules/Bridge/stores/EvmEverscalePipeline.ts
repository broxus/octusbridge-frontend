import { addABI, decodeLogs, keepNonDecodedLogs } from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapEthBytesIntoTonCell } from 'eth-ton-abi-converter'
import { Address } from 'everscale-inpage-provider'
import {
    computed,
    type IReactionDisposer,
    makeObservable,
    reaction,
    toJS,
} from 'mobx'
import Web3 from 'web3'

import rpc from '@/hooks/useRpcClient'
import { BridgeUtils, EthAbi, TokenWallet } from '@/misc'
import {
    ethereumEventConfigurationContract,
    getFullContractState,
    tokenTransferEthereumEventContract,
} from '@/misc/contracts'
import { EverscaleToken, EvmToken, Pipeline } from '@/models'
import { type EverscaleTokenData } from '@/models'
import {
    type EventStateStatus,
    type EvmEventVoteData,
    type EvmTransferUrlParams,
    type PendingWithdrawal,
    type PrepareStateStatus,
    type TransferStateStatus,
} from '@/modules/Bridge/types'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetsService, type BridgeAssetUniqueKey } from '@/stores/BridgeAssetsService'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    isEverscaleAddressValid,
    storage,
} from '@/utils'
import { middlewareDecodePayload } from '@/modules/Bridge/utils'


export type EvmEverscalePipelineData = {
    amount: string;
    expectedEvers: string;
    deriveEventAddress?: Address;
    eventVoteData?: EvmEventVoteData;
    leftAddress?: string;
    pipeline?: Pipeline;
    rightAddress?: string;
    token?: BridgeAsset;
    pendingWithdrawals?: PendingWithdrawal[];
    eventInitialBalance?: string;
}

export type EvmEverscalePipelineState = {
    eventState?: {
        confirmations: number;
        errorMessage?: string;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
    isCheckingTransaction: boolean;
    isSwapEnabled?: boolean;
    prepareState?: {
        errorMessage?: string;
        isDeployed?: boolean;
        isDeploying?: boolean;
        isOutdated?: boolean;
        status: PrepareStateStatus;
    };
    transferState?: {
        confirmedBlocksCount: number;
        errorMessage?: string;
        eventBlocksToConfirm: number;
        status: TransferStateStatus;
    };
}


export class EvmEverscalePipeline extends BaseStore<EvmEverscalePipelineData, EvmEverscalePipelineState> {

    protected txTransferUpdater: ReturnType<typeof setTimeout> | undefined

    protected txPrepareUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: EvmTransferUrlParams,
    ) {
        super()

        this.setData(() => ({ amount: '' }))
        this.setState(() => ({ isCheckingTransaction: false }))

        makeObservable<EvmEverscalePipeline, 'web3'>(this, {
            amount: computed,
            eversAmount: computed,
            deriveEventAddress: computed,
            leftAddress: computed,
            rightAddress: computed,
            token: computed,
            eventState: computed,
            isSwapEnabled: computed,
            prepareState: computed,
            transferState: computed,
            leftNetwork: computed,
            rightNetwork: computed,
            pipeline: computed,
            txHash: computed,
            useEverWallet: computed,
            useEvmWallet: computed,
            useTokensAssets: computed,
            web3: computed,
            success: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.#bridgeAssetsDisposer = reaction(() => this.bridgeAssets.isReady, async isReady => {
            if (isReady) {
                await this.checkTransaction(true)
            }
        }, { fireImmediately: true })
    }

    public dispose(): void {
        this.#bridgeAssetsDisposer?.()
        this.stopTransferUpdater()
        this.stopPrepareUpdater()
    }

    public async checkTransaction(force: boolean = false): Promise<void> {
        if (this.txHash === undefined || (this.state.isCheckingTransaction && !force)) {
            return
        }

        this.setState({
            isCheckingTransaction: true,
            transferState: {
                confirmedBlocksCount: this.transferState?.confirmedBlocksCount || 0,
                eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                status: this.transferState?.status || 'pending',
            },
        })

        try {
            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                setTimeout(async () => {
                    await this.checkTransaction(true)
                }, 5000)
            }
            else {
                this.setState('isCheckingTransaction', false)
                switch (true) {
                    case this.transferState?.status === 'confirmed' && this.prepareState?.status !== 'confirmed':
                        await this.runPrepareUpdater()
                        break

                    default:
                        await this.resolve()
                }
            }
        }
        catch (e) {
            error('Check transaction error', e)
            this.setState('isCheckingTransaction', false)

        }
    }

    public async resolve(): Promise<void> {
        if (
            this.txHash === undefined
            || this.leftNetwork === undefined
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        const network = findNetwork(this.leftNetwork.chainId, 'evm')

        if (network === undefined) {
            return
        }

        this.setState('transferState', {
            confirmedBlocksCount: this.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        })

        try {
            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null || txReceipt.to == null) {
                await this.checkTransaction()
                return
            }

            addABI(EthAbi.MultiVault)

            const decodedLogs = decodeLogs(txReceipt.logs ?? [])
            const depositLog = decodedLogs.find(log => log?.name === 'Deposit')
            const alienTransfer = decodedLogs.find(log => log?.name === 'AlienTransfer')
            const nativeTransfer = decodedLogs.find(log => log?.name === 'NativeTransfer')
            const userDepositLogs = decodedLogs.filter(log => log?.name === 'UserDeposit')

            if (depositLog == null) {
                return
            }

            debug('Deposit Transfer Logs', depositLog)

            if (userDepositLogs.length > 0) {
                debug('User Deposit Logs', userDepositLogs)

                const pendingWithdrawals: PendingWithdrawal[] = []
                userDepositLogs.forEach(item => {
                    if (item.events[4].value !== '0x0000000000000000000000000000000000000000') {
                        pendingWithdrawals.push({
                            id: item.events[5].value,
                            bounty: item.events[6].value,
                            amount: item.events[3].value,
                            recipient: item.events[4].value,
                        })
                    }
                })
                if (pendingWithdrawals.length > 0) {
                    this.setData('pendingWithdrawals', pendingWithdrawals)
                }
            }

            let token: BridgeAsset | undefined

            const depositAmount = depositLog.events.find(i => i.name === 'amount')?.value ?? '0'
            const depositFee = depositLog.events.find(i => i.name === 'fee')?.value ?? '0'

            if (alienTransfer != null) {
                debug('Alien Transfer Logs', alienTransfer)
                const root = `0x${new BigNumber(alienTransfer.events.find(
                    value => value.name === 'base_token',
                )?.value)?.toString(16).padStart(40, '0')}`.toLowerCase()
                const { chainId, type } = this.leftNetwork

                token = this.bridgeAssets.get(type, chainId, root)

                if (token === undefined) {
                    try {
                        const data = await Promise.all([
                            BridgeUtils.getEvmTokenName(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenSymbol(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenDecimals(root, network.rpcUrl),
                        ])

                        if (data !== undefined) {
                            token = new EvmToken<BridgeAssetUniqueKey>({
                                root,
                                decimals: data[2],
                                name: data[0],
                                symbol: data[1],
                                key: `${type}-${chainId}-${root}`,
                                chainId,
                            })
                            this.bridgeAssets.add(token)
                        }
                    }
                    catch (e) {
                        //
                    }
                }

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

                if (
                    this.token?.root !== undefined
                    && this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this.bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    )

                    this.setData('pipeline', pipeline ? new Pipeline(pipeline) : undefined)
                }

                if (depositAmount !== '0') {
                    this.pipeline?.setData(
                        'depositFee',
                        new BigNumber(depositFee ?? 0)
                            .div(depositAmount || 1)
                            .multipliedBy(10000)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                    )
                }

                const expectedEvers = alienTransfer.events.find(i => i.name === 'expected_evers')?.value
                const targetWid = alienTransfer.events.find(i => i.name === 'recipient_wid')?.value
                const targetAddress = alienTransfer.events.find(i => i.name === 'recipient_addr')?.value

                this.setData({
                    amount: new BigNumber(depositAmount || 0).shiftedBy(-token.decimals).toFixed(),
                    expectedEvers,
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                })
                this.setState('isSwapEnabled', expectedEvers !== '0')
            }
            else if (nativeTransfer) {
                debug('Native Transfer Logs', nativeTransfer)
                const root = depositLog.events.find(i => i.name === 'token')?.value.toLowerCase()

                if (this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this.bridgeAssets.pipeline(
                        root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    )

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }

                if (this.pipeline?.everscaleTokenAddress === undefined || this.pipeline.vaultAddress === undefined) {
                    return
                }

                let { evmTokenAddress } = this.pipeline

                if (evmTokenAddress === undefined) {
                    return
                }

                try {
                    const meta = await BridgeUtils.getEvmMultiVaultTokenMeta(
                        this.pipeline.vaultAddress.toString(),
                        evmTokenAddress,
                        network.rpcUrl,
                    )
                    if (meta.custom !== '0x0000000000000000000000000000000000000000') {
                        evmTokenAddress = meta.custom
                    }
                }
                catch (e) {
                    error(e)
                }

                const { chainId, type } = this.leftNetwork
                token = this.bridgeAssets.get(type, chainId, evmTokenAddress)

                if (token === undefined) {
                    try {
                        const data = await Promise.all([
                            BridgeUtils.getEvmTokenName(evmTokenAddress, network.rpcUrl),
                            BridgeUtils.getEvmTokenSymbol(evmTokenAddress, network.rpcUrl),
                            BridgeUtils.getEvmTokenDecimals(evmTokenAddress, network.rpcUrl),
                        ])

                        if (data !== undefined) {
                            token = new EvmToken<BridgeAssetUniqueKey>({
                                root: evmTokenAddress,
                                decimals: data[2],
                                name: data[0],
                                symbol: data[1],
                                key: `${type}-${chainId}-${evmTokenAddress}`,
                                chainId,
                            })
                            this.bridgeAssets.add(token)
                        }
                    }
                    catch (e) {
                        error(e)
                    }
                }

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

                if (depositAmount !== '0') {
                    this.pipeline?.setData(
                        'depositFee',
                        new BigNumber(depositFee || 0)
                            .div(depositAmount || 0)
                            .multipliedBy(10000)
                            .dp(0, BigNumber.ROUND_DOWN)
                            .toFixed(),
                    )
                }

                const expectedEvers = nativeTransfer.events.find(i => i.name === 'expected_evers')?.value
                const targetWid = nativeTransfer.events.find(
                    i => ['recipient_wid', 'wid'].includes(i.name),
                )?.value
                const targetAddress = nativeTransfer.events.find(
                    i => ['recipient_addr', 'addr'].includes(i.name),
                )?.value

                let rightAddress = `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase()

                if (
                    this.pipeline.everscaleTokenAddress
                    && this.bridgeAssets.isNativeCurrency(this.pipeline.everscaleTokenAddress.toString())
                ) {
                    const payload = nativeTransfer.events.find(i => i.name === 'payload')?.value
                    const hex = new BigNumber(payload).toString(16)
                    const base64 = Buffer.from(hex, 'hex').toString('base64')
                    try {
                        rightAddress = (await middlewareDecodePayload(base64)).remainingTokensTo
                    }
                    catch (e) {}
                }

                this.setData({
                    amount: new BigNumber(depositAmount || 0).shiftedBy(-token.decimals).toFixed(),
                    expectedEvers,
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress,
                })
                this.setState('isSwapEnabled', expectedEvers !== '0')
            }
            else {
                token = this.bridgeAssets.findTokenByVaultAndChain(
                    depositLog.address.toLowerCase(),
                    this.leftNetwork.chainId,
                )

                if (token === undefined) {
                    return
                }

                this.setData('token', token)

                if (
                    this.token?.root !== undefined
                    && this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this.bridgeAssets.pipeline(
                        token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                    )

                    this.setData('pipeline', pipeline !== undefined ? new Pipeline(pipeline) : undefined)
                }

                const targetWid = depositLog.events.find(
                    i => ['recipient_wid', 'wid'].includes(i.name),
                )?.value
                const targetAddress = depositLog.events.find(
                    i => ['recipient_addr', 'addr'].includes(i.name),
                )?.value

                this.setData({
                    amount: new BigNumber(depositAmount || 0).shiftedBy(-token.decimals).toFixed(),
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                })
            }

            if (this.pipeline?.ethereumConfiguration === undefined) {
                return
            }

            const ethConfigDetails = await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                .methods.getDetails({ answerId: 0 })
                .call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            this.setState('transferState', {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: parseInt(eventBlocksToConfirm, 10),
                status: 'pending',
            })

            this.runTransferUpdater()
        }
        catch (e) {
            error('Resolve error', e)
            this.setState('transferState', {
                confirmedBlocksCount: 0,
                eventBlocksToConfirm: 0,
                status: 'disabled',
            })
        }
    }

    public async prepare(): Promise<void> {
        if (
            this.everWallet.account?.address === undefined
            || this.pipeline?.ethereumConfiguration === undefined
            || this.data.eventVoteData === undefined
        ) {
            return
        }

        this.setState('prepareState', {
            ...this.prepareState,
            isDeploying: true,
            status: 'pending',
        })

        try {
            await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration, rpc)
                .methods.deployEvent({
                    eventVoteData: this.data.eventVoteData,
                })
                .send({
                    amount: '6000000000',
                    bounce: true,
                    from: this.everWallet.account.address,
                })
        }
        catch (e: any) {
            error('Prepare error', e)
            this.setState('prepareState', {
                ...this.prepareState,
                status: 'disabled',
            })
        }
        finally {
            this.setState('prepareState', {
                ...this.prepareState,
                isDeploying: false,
            } as EvmEverscalePipelineState['prepareState'])
        }
    }

    protected runTransferUpdater(): void {
        debug('runTransferUpdater', toJS(this.data), toJS(this.state))

        this.stopTransferUpdater();

        (async () => {
            if (this.txHash === undefined) {
                return
            }

            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)
            const networkBlockNumber = await this.web3.eth.getBlockNumber()

            if (txReceipt?.blockNumber == null || networkBlockNumber == null) {
                this.setState('transferState', {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                    status: 'pending',
                })
                return
            }

            const transferState: EvmEverscalePipelineState['transferState'] = {
                confirmedBlocksCount: networkBlockNumber - txReceipt.blockNumber,
                eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                status: this.transferState?.status || 'pending',
            }

            if (transferState.confirmedBlocksCount >= transferState.eventBlocksToConfirm) {
                transferState.status = 'confirmed'

                if (!txReceipt.status) {
                    transferState.status = 'rejected'
                    this.setState('transferState', transferState)
                    return
                }

                keepNonDecodedLogs()
                addABI(EthAbi.Vault)

                const decodedLogs = decodeLogs(txReceipt?.logs || [])

                const depositLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'Deposit',
                )]
                const alienTransferLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'AlienTransfer',
                )]
                const nativeTransferLog = txReceipt.logs[decodedLogs.findIndex(
                    log => log !== undefined && log.name === 'NativeTransfer',
                )]

                debug('EVENT LOG', decodedLogs, depositLog, alienTransferLog, nativeTransferLog)

                if (depositLog?.data == null || this.pipeline?.ethereumConfiguration === undefined) {
                    return
                }

                const ethereumEventConfigurationContractState = await getFullContractState(
                    this.pipeline.ethereumConfiguration,
                )
                const [ethConfigDetails, flags] = await Promise.all([
                    ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                        .methods.getDetails({ answerId: 0 })
                        .call({ cachedState: ethereumEventConfigurationContractState }),
                    (await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                        .methods.getFlags({ answerId: 0 })
                        .call({ cachedState: ethereumEventConfigurationContractState })
                        .catch(() => ({ _flags: '0' })))._flags,
                ])

                const { eventInitialBalance } = ethConfigDetails._basicConfiguration

                let eventData: string | undefined

                const eventVoteData: EvmEventVoteData = {
                    eventBlock: txReceipt.blockHash,
                    eventBlockNumber: txReceipt.blockNumber.toString(),
                    eventTransaction: txReceipt.transactionHash,
                } as EvmEventVoteData

                if (alienTransferLog != null && this.pipeline.everscaleTokenAddress !== undefined) {
                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        alienTransferLog.data,
                        flags,
                    )
                    eventVoteData.eventIndex = alienTransferLog.logIndex.toString()
                }
                else if (nativeTransferLog != null) {
                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        nativeTransferLog.data,
                        flags,
                    )
                    eventVoteData.eventIndex = nativeTransferLog.logIndex.toString()
                }
                else {
                    eventData = mapEthBytesIntoTonCell(
                        Buffer.from(ethConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                        depositLog.data,
                        flags,
                    )
                    eventVoteData.eventIndex = depositLog.logIndex.toString()
                }

                if (eventData == null) {
                    return
                }

                eventVoteData.eventData = eventData

                const eventAddress = (await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                    .methods.deriveEventAddress({
                        answerId: 0,
                        eventVoteData,
                    })
                    .call())
                    .eventContract

                this.setData({
                    eventInitialBalance,
                    eventVoteData,
                    deriveEventAddress: eventAddress,
                })

                this.setState('transferState', transferState)

                this.runPrepareUpdater()
            }
            else {
                this.setState('transferState', {
                    ...transferState,
                    status: 'pending',
                })
            }
        })().finally(() => {
            if (
                this.state.transferState?.status !== 'confirmed'
                && this.state.transferState?.status !== 'rejected'
            ) {
                this.txTransferUpdater = setTimeout(() => {
                    this.runTransferUpdater()
                }, 5000)
            }
        })
    }

    protected stopTransferUpdater(): void {
        if (this.txTransferUpdater !== undefined) {
            clearTimeout(this.txTransferUpdater)
            this.txTransferUpdater = undefined
        }
    }

    protected runPrepareUpdater(): void {
        debug('runPrepareUpdater', toJS(this.data), toJS(this.state))

        this.stopPrepareUpdater();

        (async () => {
            try {
                if (this.rightNetwork === undefined || this.prepareState?.isDeploying === true) {
                    return
                }

                if (this.deriveEventAddress === undefined) {
                    if (this.prepareState?.status !== 'pending') {
                        this.setState('prepareState', this.prepareState)
                    }
                    return
                }

                const isFirstIteration = this.prepareState?.isDeployed === undefined

                if (isFirstIteration) {
                    this.setState('prepareState', {
                        ...this.prepareState,
                        status: 'pending',
                    })
                }

                const cachedState = await getFullContractState(this.deriveEventAddress)

                if (cachedState === undefined || !cachedState?.isDeployed) {
                    if (this.txHash !== undefined) {
                        try {
                            const { blockNumber } = await this.web3.eth.getTransactionReceipt(this.txHash)

                            const ts = parseInt(
                                (await this.web3.eth.getBlock(blockNumber)).timestamp.toString(),
                                10,
                            )
                            debug('Outdated ts', `${(Date.now() / 1000) - ts} >= 600`)

                            this.setState('prepareState', {
                                ...this.prepareState,
                                isDeployed: false,
                                isOutdated: ((Date.now() / 1000) - ts) >= 600,
                            } as EvmEverscalePipelineState['prepareState'])
                        }
                        catch (e) {}
                    }

                    if (
                        (isFirstIteration && !this.state.isSwapEnabled)
                        || this.prepareState?.isOutdated) {
                        this.setState('prepareState', {
                            ...this.prepareState,
                            isDeployed: false,
                            status: 'disabled',
                        })
                        return
                    }

                    if (this.prepareState?.status !== 'pending') {
                        this.setState('prepareState', this.prepareState)
                    }
                }

                const eventDetails = await tokenTransferEthereumEventContract(this.deriveEventAddress)
                    .methods.getDetails({ answerId: 0 })
                    .call({ cachedState })

                const eventState: EvmEverscalePipelineState['eventState'] = {
                    confirmations: eventDetails._confirms.length,
                    requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                    status: 'pending',
                }

                if (eventDetails._status === '2') {
                    eventState.status = 'confirmed'
                }
                else if (eventDetails._status === '3') {
                    eventState.status = 'rejected'
                }

                if (this.prepareState?.status !== 'confirmed') {
                    this.setState('prepareState', {
                        ...this.prepareState,
                        isDeployed: true,
                        status: 'confirmed',
                    })
                }

                this.setState('eventState', eventState)

                const { chainId, type } = this.rightNetwork
                const root = this.pipeline?.everscaleTokenAddress?.toString().toLowerCase()
                const key = `${type}-${chainId}-${root}`.toLowerCase()

                if (
                    root !== undefined
                    && isEverscaleAddressValid(root)
                    && !this.bridgeAssets.has(key)
                ) {
                    try {
                        const data = await TokenWallet.getTokenFullDetails(root)

                        if (data?.decimals !== undefined && data?.symbol) {
                            const asset: EverscaleTokenData = {
                                address: new Address(root),
                                chainId,
                                decimals: data.decimals,
                                name: data.name,
                                root,
                                symbol: data.symbol,
                            }

                            try {
                                const meta = await BridgeUtils.getAlienTokenRootMeta(root)
                                const evmTokenAddress = `0x${new BigNumber(meta.base_token).toString(16).padStart(40, '0')}`
                                const evmToken = this.bridgeAssets.get('evm', meta.base_chainId, evmTokenAddress)
                                asset.logoURI = evmToken?.icon
                            }
                            catch (e) {}

                            this.bridgeAssets.add(new EverscaleToken<BridgeAssetUniqueKey>({
                                ...asset,
                                key,
                            }))

                            const importedAssets = JSON.parse(storage.get('imported_assets') || '{}')

                            importedAssets[key] = {
                                ...asset,
                                // eslint-disable-next-line no-void
                                address: void 0,
                                key,
                            }

                            storage.set('imported_assets', JSON.stringify(importedAssets))
                        }
                    }
                    catch (e) {}
                }
            }
            catch (e) {}
        })().finally(() => {
            if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                this.txPrepareUpdater = setTimeout(() => {
                    this.runPrepareUpdater()
                }, 5000)
            }
        })
    }

    protected stopPrepareUpdater(): void {
        if (this.txPrepareUpdater !== undefined) {
            clearTimeout(this.txPrepareUpdater)
            this.txPrepareUpdater = undefined
        }
    }

    protected get web3(): Web3 {
        const network = findNetwork(this.leftNetwork?.chainId as string, 'evm')
        return new Web3(network?.rpcUrl as string)
    }

    public get pipeline(): EvmEverscalePipelineData['pipeline'] {
        return this.data.pipeline
    }

    public get amount(): EvmEverscalePipelineData['amount'] {
        return this.data.amount
    }

    public get deriveEventAddress(): EvmEverscalePipelineData['deriveEventAddress'] {
        return this.data.deriveEventAddress
    }

    public get leftAddress(): EvmEverscalePipelineData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): EvmEverscalePipelineData['rightAddress'] {
        return this.data.rightAddress
    }

    public get token(): EvmEverscalePipelineData['token'] {
        return this.data.token
    }

    public get isSwapEnabled(): EvmEverscalePipelineState['isSwapEnabled'] {
        return this.state.isSwapEnabled
    }

    public get eventState(): EvmEverscalePipelineState['eventState'] {
        return this.state.eventState
    }

    public get prepareState(): EvmEverscalePipelineState['prepareState'] {
        return this.state.prepareState
    }

    public get transferState(): EvmEverscalePipelineState['transferState'] {
        return this.state.transferState
    }

    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
    }

    public get depositFee(): string {
        return this.amountNumber
            .shiftedBy(this.pipeline?.evmTokenDecimals || 0)
            .times(this.pipeline?.depositFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-(this.pipeline?.evmTokenDecimals || 0))
            .toFixed()
    }

    public get leftNetwork(): NetworkShape | undefined {
        if (this.params?.fromId === undefined || this.params?.fromType === undefined) {
            return undefined
        }
        return findNetwork(this.params.fromId, this.params.fromType)
    }

    public get rightNetwork(): NetworkShape | undefined {
        if (this.params?.toId === undefined || this.params?.toType === undefined) {
            return undefined
        }
        return findNetwork(this.params.toId, this.params.toType)
    }

    public get txHash(): EvmTransferUrlParams['txHash'] | undefined {
        return this.params?.txHash
    }

    public get useEverWallet(): EverWalletService {
        return this.everWallet
    }

    public get useEvmWallet(): EvmWalletService {
        return this.evmWallet
    }

    public get useTokensAssets(): BridgeAssetsService {
        return this.bridgeAssets
    }

    public get pendingWithdrawals(): PendingWithdrawal[] | undefined {
        return this.data.pendingWithdrawals
    }

    public get success(): boolean {
        return this.eventState?.status === 'confirmed'
    }

    public get eversAmount(): string | undefined {
        return this.data.expectedEvers
            && this.data.eventInitialBalance
            && new BigNumber(this.data.expectedEvers).gt(0)
                ? new BigNumber(this.data.expectedEvers)
                    .minus(this.data.eventInitialBalance)
                    .shiftedBy(-this.everWallet.coin.decimals)
                    .toFixed()
                : undefined
    }

    #bridgeAssetsDisposer: IReactionDisposer | undefined

}
