import { addABI, decodeLogs, keepNonDecodedLogs } from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapEthBytesIntoTonCell, mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import { Address } from 'everscale-inpage-provider'
import { type IReactionDisposer, computed, makeObservable, reaction, toJS } from 'mobx'
import Web3 from 'web3'

import { BridgeUtils, EthAbi, TokenWallet } from '@/misc'
import {
    ethereumEventConfigurationContract,
    everscaleEventAlienContract,
    everscaleEventConfigurationContract,
    everscaleEventNativeContract,
    getFullContractState,
    tokenTransferEthereumEventContract,
    tokenTransferEverscaleEventContract,
} from '@/misc/contracts'
import { evmBridgeContract, evmMultiVaultContract } from '@/misc/eth-contracts'
import { EverscaleToken, type EverscaleTokenData, EvmToken, Pipeline } from '@/models'
import {
    type EvmTvmPipelineState,
    type TvmEvmPipelineState,
} from '@/modules/Bridge'
import {
    type EventStateStatus,
    type EvmEventVoteData,
    type EvmTransferUrlParams,
    type PendingWithdrawal,
    type PendingWithdrawalStatus,
    type PrepareStateStatus,
} from '@/modules/Bridge/types'
import { deriveEvmAddressFromOperations } from '@/modules/Bridge/utils'
import { handleLiquidityRequests } from '@/modules/LiquidityRequests'
import { handleTransfers } from '@/modules/Transfers/utils'
import { BaseStore } from '@/stores/BaseStore'
import { type BridgeAsset, type BridgeAssetUniqueKey, type BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { type EverWalletService } from '@/stores/EverWalletService'
import { type EvmWalletService } from '@/stores/EvmWalletService'
import { type NetworkShape } from '@/types'
import {
    debug,
    error,
    findNetwork,
    getEverscaleMainNetwork,
    isEverscaleAddressValid,
    resolveEverscaleAddress,
    storage,
} from '@/utils'

export type EvmEvmPipelineData = {
    amount: string
    // TVM-EVM event
    contractAddress?: Address
    // EVM-TVM event
    deriveEventAddress?: Address
    eventInitialBalance?: string
    eventVoteData?: EvmEventVoteData
    encodedEvent?: string
    expectedEvers: string
    evmTvmNonce?: string
    leftAddress?: string
    maxTransferFee?: string
    minTransferFee?: string
    pendingWithdrawals?: PendingWithdrawal[]
    pipeline?: Pipeline
    secondPipeline?: Pipeline
    rightAddress?: string
    token?: BridgeAsset
    tvmAddress?: string
    withdrawalId?: string
    pendingWithdrawalId?: string
    pendingWithdrawalStatus?: PendingWithdrawalStatus
    pendingWithdrawalBounty?: string
}

export type EvmEvmPipelineState = {
    encodedEvent?: string
    eventState?: EvmTvmPipelineState['eventState']
    isCheckingTransaction?: boolean
    isMultiVaultCredit?: boolean
    isPendingWithdrawalSynced?: boolean
    prepareState?: {
        errorMessage?: string
        isDeployed?: boolean
        isDeploying?: boolean
        isOutdated?: boolean
        status: PrepareStateStatus
    }
    transferState?: EvmTvmPipelineState['transferState']
    secondPrepareState?: {
        errorMessage?: string
        isDeployed?: boolean
        isDeploying?: boolean
        status: PrepareStateStatus
    }
    secondEventState?: TvmEvmPipelineState['eventState']
    releaseState?: TvmEvmPipelineState['releaseState']
}

export class EvmEvmPipeline extends BaseStore<EvmEvmPipelineData, EvmEvmPipelineState> {

    protected transferUpdater: ReturnType<typeof setTimeout> | undefined

    protected prepareUpdater: ReturnType<typeof setTimeout> | undefined

    protected contractUpdater: ReturnType<typeof setTimeout> | undefined

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    protected pendingWithdrawalUpdater: ReturnType<typeof setTimeout> | undefined

    protected bridgeAssetsDisposer: IReactionDisposer | undefined

    constructor(
        protected readonly _evmWallet: EvmWalletService,
        protected readonly _bridgeAssets: BridgeAssetsService,
        protected readonly _tvmWallet: EverWalletService,
        protected readonly params?: EvmTransferUrlParams,
    ) {
        super()

        this.setData(() => ({ amount: '' }))
        this.setState(() => ({ isCheckingTransaction: false }))

        makeObservable<EvmEvmPipeline, 'web3'>(this, {
            amount: computed,
            amountNumber: computed,
            bridgeAssets: computed,
            contractAddress: computed,
            deriveEventAddress: computed,
            eventState: computed,
            evmWallet: computed,
            isInsufficientVaultBalance: computed,
            isPendingWithdrawalSynced: computed,
            isTvmBasedToken: computed,
            leftAddress: computed,
            leftNetwork: computed,
            maxTransferFee: computed,
            minTransferFee: computed,
            pendingWithdrawalId: computed,
            prepareState: computed,
            releaseState: computed,
            rightAddress: computed,
            rightNetwork: computed,
            secondDepositFee: computed,
            secondEventState: computed,
            secondPipeline: computed,
            secondWithdrawFee: computed,
            token: computed,
            transferState: computed,
            tvmAddress: computed,
            tvmWallet: computed,
            txHash: computed,
            web3: computed,
        })
    }

    public async init(): Promise<void> {
        if (this.txHash === undefined) {
            return
        }

        this.bridgeAssetsDisposer = reaction(
            () => this._bridgeAssets.isReady,
            async isReady => {
                if (isReady) {
                    await this.checkTransaction(true)
                }
            },
            { fireImmediately: true },
        )
    }

    public dispose(): void {
        this.bridgeAssetsDisposer?.()
        this.stopTransferUpdater()
        this.stopPrepareUpdater()
        this.stopContractUpdater()
        this.stopEventUpdater()
        this.stopReleaseUpdater()
        this.stopPendingWithdrawalUpdater()
    }

    public async checkTransaction(force: boolean = false): Promise<void> {
        if (
            this.txHash === undefined
            || (this.state.isCheckingTransaction && !force)
            || this.leftNetwork?.chainId === undefined
        ) {
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
                    case this.secondEventState?.status === 'confirmed' && this.releaseState?.status !== 'confirmed':
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
        if (this.txHash === undefined || this.leftNetwork === undefined || this.transferState?.status === 'confirmed') {
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

            const everscaleMainNetwork = getEverscaleMainNetwork()
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
                            amount: item.events[3].value,
                            bounty: item.events[6].value,
                            id: item.events[5].value,
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
                const root = `0x${BigNumber(alienTransfer.events.find(value => value.name === 'base_token')?.value)
                ?.toString(16)
                .padStart(40, '0')}`.toLowerCase()
                const { chainId, type } = this.leftNetwork
                token = this._bridgeAssets.get(type, chainId, root)

                if (token === undefined) {
                    try {
                        const data = await Promise.all([
                            BridgeUtils.getEvmTokenName(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenSymbol(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenDecimals(root, network.rpcUrl),
                        ])

                        if (data !== undefined) {
                            token = new EvmToken<BridgeAssetUniqueKey>({
                                chainId,
                                decimals: data[2],
                                key: `${type}-${chainId}-${root}`,
                                name: data[0],
                                root,
                                symbol: data[1],
                            })
                            this._bridgeAssets.add(token)
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

                if (
                    this.token?.root !== undefined
                    && this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this._bridgeAssets.pipeline(
                        this.token.root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                    )

                    let secondPipeline

                    if (pipeline?.everscaleTokenAddress !== undefined) {
                        secondPipeline = await this._bridgeAssets.pipeline(
                            pipeline.everscaleTokenAddress.toString(),
                            `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                            `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        )
                    }

                    this.setData({
                        pipeline: pipeline !== undefined ? new Pipeline(pipeline) : undefined,
                        secondPipeline: secondPipeline !== undefined ? new Pipeline(secondPipeline) : undefined,
                    })
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

                const payload = alienTransfer.events.find(i => i.name === 'payload')?.value
                const hex = new BigNumber(payload).toString(16)
                const base64 = Buffer.from(hex, 'hex').toString('base64')
                const rightAddress = await deriveEvmAddressFromOperations(base64)

                this.setData({
                    amount: new BigNumber(depositAmount || 0).shiftedBy(-token.decimals).toFixed(),
                    expectedEvers,
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress,
                    tvmAddress: `${targetWid}:${new BigNumber(targetAddress)
                        .toString(16)
                        .padStart(64, '0')}`.toLowerCase(),
                })
                this.setState('isMultiVaultCredit', expectedEvers !== '0')
            }
            else if (nativeTransfer) {
                debug('Native Transfer Logs', nativeTransfer)
                const root = depositLog.events.find(i => i.name === 'token')?.value.toLowerCase()

                if (
                    this.leftNetwork?.type !== undefined
                    && this.leftNetwork?.chainId !== undefined
                    && this.rightNetwork?.type !== undefined
                    && this.rightNetwork?.chainId !== undefined
                ) {
                    const pipeline = await this._bridgeAssets.pipeline(
                        root,
                        `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                        `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                    )

                    let secondPipeline

                    if (pipeline?.everscaleTokenAddress !== undefined) {
                        secondPipeline = await this._bridgeAssets.pipeline(
                            pipeline.everscaleTokenAddress.toString(),
                            `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                            `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        )
                    }

                    this.setData({
                        pipeline: pipeline !== undefined ? new Pipeline(pipeline) : undefined,
                        secondPipeline: secondPipeline !== undefined ? new Pipeline(secondPipeline) : undefined,
                    })
                }

                if (this.pipeline?.vaultAddress === undefined) {
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
                token = this._bridgeAssets.get(type, chainId, evmTokenAddress)

                if (token === undefined) {
                    try {
                        const data = await Promise.all([
                            BridgeUtils.getEvmTokenName(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenSymbol(root, network.rpcUrl),
                            BridgeUtils.getEvmTokenDecimals(root, network.rpcUrl),
                        ])

                        if (data !== undefined) {
                            token = new EvmToken<BridgeAssetUniqueKey>({
                                chainId,
                                decimals: data[2],
                                key: `${type}-${chainId}-${root}`,
                                name: data[0],
                                root,
                                symbol: data[1],
                            })
                            this._bridgeAssets.add(token)
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
                const targetWid = nativeTransfer.events.find(i => ['recipient_wid', 'wid'].includes(i.name))?.value
                const targetAddress = nativeTransfer.events.find(i => ['recipient_addr', 'addr'].includes(i.name))?.value

                const payload = nativeTransfer.events.find(i => i.name === 'payload')?.value
                const hex = new BigNumber(payload).toString(16)
                const base64 = Buffer.from(hex, 'hex').toString('base64')
                const rightAddress = await deriveEvmAddressFromOperations(base64)

                this.setData({
                    amount: new BigNumber(depositAmount || 0).shiftedBy(-token.decimals).toFixed(),
                    expectedEvers,
                    leftAddress: txReceipt.from.toLowerCase(),
                    rightAddress,
                    tvmAddress: `${targetWid}:${new BigNumber(targetAddress)
                        .toString(16)
                        .padStart(64, '0')}`.toLowerCase(),
                })
                this.setState('isMultiVaultCredit', expectedEvers !== '0')
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
        const rpc = this.tvmWallet.getProvider()

        if (
            this._tvmWallet.account?.address === undefined
            || this.pipeline?.ethereumConfiguration === undefined
            || this.data.eventVoteData === undefined
            || !rpc
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
                from: this._tvmWallet.account.address,
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
            } as EvmTvmPipelineState['prepareState'])
        }
    }

    public async release(): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.secondPipeline?.vaultAddress === undefined
                || this._evmWallet.web3 === undefined
                || this.data.encodedEvent === undefined
            ) {
                return
            }

            this.setState('releaseState', {
                ...this.releaseState,
                status: 'pending',
            })

            const eventContract = tokenTransferEverscaleEventContract(this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

            const signatures = eventDetails._signatures.map(sign => {
                const signature = `0x${Buffer.from(sign, 'base64').toString('hex')}`
                const address = this.web3.eth.accounts.recover(
                    this.web3.utils.sha3(this.data.encodedEvent!)!,
                    signature,
                )
                return {
                    address,
                    order: new BigNumber(address.slice(2).toUpperCase(), 16),
                    signature,
                }
            })
            signatures.sort((a, b) => {
                if (a.order.eq(b.order)) {
                    return 0
                }

                if (a.order.gt(b.order)) {
                    return 1
                }

                return -1
            })

            try {
                attempts += 1
                let r
                const vaultContract = new this._evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.secondPipeline.vaultAddress.toString(),
                )
                if (this.secondPipeline.isNative) {
                    r = vaultContract?.methods.saveWithdrawNative(
                        this.data.encodedEvent,
                        signatures.map(({ signature }) => signature),
                    )
                }
                else {
                    r = vaultContract?.methods.saveWithdrawAlien(
                        this.data.encodedEvent,
                        signatures.map(({ signature }) => signature),
                    )
                }

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })

                    this.setState('releaseState', {
                        ...this.releaseState,
                        isInsufficientVaultBalance: this.isInsufficientVaultBalance,
                    } as TvmEvmPipelineState['releaseState'])

                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined
                    && transactionType !== '0x0'
                ) {
                    error('Release tokens error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        // eslint-disable-next-line no-void
                        isInsufficientVaultBalance: void 0,
                        status: 'disabled',
                    })
                    error('Release tokens error', e)
                }
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async forceClose(reject?: (e: any) => void): Promise<void> {
        let attempts = 0

        const send = async (transactionType?: string): Promise<void> => {
            if (
                attempts >= 2
                || this.secondPipeline === undefined
                || this._evmWallet.web3 === undefined
            ) {
                return
            }

            const vaultContract = new this._evmWallet.web3.eth.Contract(
                EthAbi.MultiVault,
                this.secondPipeline.vaultAddress.toString(),
            )

            this.setState('releaseState', {
                ...this.releaseState,
                isPendingClosing: true,
            } as TvmEvmPipelineState['releaseState'])

            try {
                attempts += 1

                const r = vaultContract.methods.forceWithdraw([[this.rightAddress, this.pendingWithdrawalId]])
                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Transfer deposit to factory error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    reject?.(e)
                    error('Transfer deposit to factory error', e)
                }
            }
            finally {
                this.setState('releaseState', {
                    ...this.releaseState,
                    isPendingClosing: false,
                } as TvmEvmPipelineState['releaseState'])
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    public async changeBounty(amount: string): Promise<void> {
        if (this.releaseState?.isSettingWithdrawBounty) {
            return
        }

        let attempts = 0

        const send = async (transactionType?: string): Promise<boolean> => {
            if (
                attempts >= 2
                || this._evmWallet.web3 === undefined
                || this.secondPipeline === undefined
                || this.data.pendingWithdrawalId === undefined
            ) {
                return false
            }

            try {
                attempts += 1

                const vaultContract = new this._evmWallet.web3.eth.Contract(
                    EthAbi.MultiVault,
                    this.secondPipeline.vaultAddress.toString(),
                )

                const r = vaultContract.methods.setPendingWithdrawalBounty(this.data.pendingWithdrawalId, amount)

                if (r !== undefined) {
                    const gas = await r.estimateGas({
                        from: this._evmWallet.address,
                        type: transactionType,
                    })
                    await r.send({
                        from: this._evmWallet.address,
                        gas,
                        type: transactionType,
                    })
                }

                return true
            }
            catch (e: any) {
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
                    error('Set bounty error. Try with transaction type 0x0', e)
                    return send('0x0')
                }
                error('Release tokens error', e)
                return false
            }
        }

        this.setState('releaseState', {
            ...this.releaseState,
            isSettingWithdrawBounty: true,
        } as TvmEvmPipelineState['releaseState'])
        const success = await send(this.rightNetwork?.transactionType)

        if (success) {
            while (this.data.pendingWithdrawalBounty !== amount) {
                await new Promise(r => {
                    setTimeout(r, 2000)
                })
            }
        }
        this.setState('releaseState', {
            ...this.releaseState,
            isSettingWithdrawBounty: false,
        } as TvmEvmPipelineState['releaseState'])
    }

    protected runTransferUpdater(): void {
        debug('runTransferUpdater', toJS(this.data), toJS(this.state))
        this.stopTransferUpdater();
        (async () => {
            if (this.txHash === undefined) {
                return
            }

            const txReceipt = await this.web3.eth.getTransactionReceipt(this.txHash)

            if (txReceipt == null) {
                return
            }

            const networkBlockNumber = await this.web3.eth.getBlockNumber()

            if (txReceipt.blockNumber == null || networkBlockNumber == null) {
                this.setState('transferState', {
                    confirmedBlocksCount: 0,
                    eventBlocksToConfirm: this.transferState?.eventBlocksToConfirm || 0,
                    status: 'pending',
                })
                return
            }

            const transferState: EvmEvmPipelineState['transferState'] = {
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
                addABI(EthAbi.MultiVault)

                const decodedLogs = decodeLogs(txReceipt?.logs || [])
                const depositLog = txReceipt.logs[decodedLogs.findIndex(log => log !== undefined && log.name === 'Deposit')]
                const alienTransferLog = txReceipt.logs[decodedLogs.findIndex(log => log !== undefined && log.name === 'AlienTransfer')]
                const nativeTransferLog = txReceipt.logs[decodedLogs.findIndex(log => log !== undefined && log.name === 'NativeTransfer')]

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
                    ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                    .methods.getFlags({ answerId: 0 })
                    .call({ cachedState: ethereumEventConfigurationContractState })
                    .then(value => value._flags)
                    .catch(() => '0'),
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

                const deriveEventAddress = await ethereumEventConfigurationContract(this.pipeline.ethereumConfiguration)
                .methods.deriveEventAddress({
                    answerId: 0,
                    eventVoteData,
                })
                .call({ cachedState: ethereumEventConfigurationContractState })
                .then(result => result.eventContract)

                this.setData({
                    deriveEventAddress,
                    eventInitialBalance,
                    eventVoteData,
                })

                this.setState({
                    prepareState: {
                        status: 'pending',
                    },
                    transferState,
                })

                this.runPrepareUpdater()
            }
            else {
                this.setState('transferState', {
                    ...transferState,
                    status: 'pending',
                })
            }
        })().finally(() => {
            if (this.state.transferState?.status !== 'confirmed' && this.state.transferState?.status !== 'rejected') {
                this.transferUpdater = setTimeout(() => {
                    this.runTransferUpdater()
                }, 5000)
            }
        })
    }

    protected stopTransferUpdater(): void {
        if (this.transferUpdater !== undefined) {
            clearTimeout(this.transferUpdater)
            this.transferUpdater = undefined
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

                            const ts = parseInt((await this.web3.eth.getBlock(blockNumber)).timestamp.toString(), 10)
                            debug('Outdated ts', `${Date.now() / 1000 - ts} >= 600`)

                            this.setState('prepareState', {
                                ...this.prepareState,
                                isDeployed: false,
                                isOutdated: Date.now() / 1000 - ts >= 600,
                            } as EvmTvmPipelineState['prepareState'])
                        }
                        catch (e) {}
                    }

                    if ((isFirstIteration && !this.state.isMultiVaultCredit) || this.prepareState?.isOutdated) {
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

                const eventState: EvmEvmPipelineState['eventState'] = {
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

                this.setState({
                    eventState,
                    secondPrepareState: {
                        ...this.secondPrepareState,
                        status: 'pending',
                    },
                })

                if (this.eventState?.status === 'confirmed') {
                    this.setState('secondPrepareState', {
                        ...this.secondPrepareState,
                        status: 'pending',
                    })

                    this.runContractUpdater()
                }

                // todo move it from here
                const { chainId, type } = this.rightNetwork
                const root = this.pipeline?.everscaleTokenAddress?.toString().toLowerCase()
                const key = `${type}-${chainId}-${root}`.toLowerCase()

                if (root !== undefined && isEverscaleAddressValid(root) && !this._bridgeAssets.has(key)) {
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
                                const evmTokenAddress = `0x${new BigNumber(meta.base_token)
                                .toString(16)
                                .padStart(40, '0')}`
                                const evmToken = this._bridgeAssets.get('evm', meta.base_chainId, evmTokenAddress)
                                asset.logoURI = evmToken?.icon
                            }
                            catch (e) {}

                            this._bridgeAssets.add(
                                new EverscaleToken<BridgeAssetUniqueKey>({
                                    ...asset,
                                    key,
                                }),
                            )

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
                this.prepareUpdater = setTimeout(() => {
                    this.runPrepareUpdater()
                }, 5000)
            }
        })
    }

    protected stopPrepareUpdater(): void {
        if (this.prepareUpdater !== undefined) {
            clearTimeout(this.prepareUpdater)
            this.prepareUpdater = undefined
        }
    }

    protected runContractUpdater(): void {
        debug('runContractUpdater', toJS(this.data), toJS(this.state))

        this.stopContractUpdater();
        (async () => {
            if (
                this.deriveEventAddress === undefined
                || this.secondPipeline === undefined
                || this.leftNetwork === undefined
            ) {
                return
            }

            const pipelineType = this._bridgeAssets.getPipelineType(this.secondPipeline.proxyAddress.toString())

            if (this.contractAddress === undefined) {
                let nonce = '0'

                if (pipelineType === 'multi_tvm_evm') {
                    nonce = (await everscaleEventNativeContract(this.deriveEventAddress).methods.nonce().call()).nonce
                }
                else if (pipelineType === 'multi_evm_tvm') {
                    nonce = (await everscaleEventAlienContract(this.deriveEventAddress).methods.nonce().call()).nonce
                }

                const [contractEvent] = (
                    await handleTransfers({
                        limit: 1,
                        nonce: Number(nonce),
                        offset: 0,
                        ordering: 'createdatdescending',
                        transferKinds: [],
                    })
                ).transfers

                if (contractEvent?.tonEthContractAddress) {
                    this.setData('contractAddress', resolveEverscaleAddress(contractEvent.tonEthContractAddress))

                    this.setState({
                        secondEventState: {
                            ...this.secondEventState,
                            confirmations: 0,
                            requiredConfirmations: 0,
                            status: 'pending',
                        },
                        secondPrepareState: {
                            status: 'confirmed',
                        },
                    })

                    this.runEventUpdater()
                }
            }
        })().finally(() => {
            if (this.secondPrepareState?.status !== 'confirmed' && this.secondPrepareState?.status !== 'rejected') {
                this.eventUpdater = setTimeout(() => {
                    this.runContractUpdater()
                }, 5000)
            }
        })
    }

    protected stopContractUpdater(): void {
        if (this.contractUpdater !== undefined) {
            clearTimeout(this.contractUpdater)
            this.contractUpdater = undefined
        }
    }

    protected runEventUpdater(): void {
        debug('runEventUpdater', toJS(this.data), toJS(this.state))

        this.stopEventUpdater();
        (async () => {
            if (
                this.contractAddress === undefined
                || this.secondPipeline === undefined
                || this.leftNetwork === undefined
            ) {
                return
            }

            const pipelineType = this._bridgeAssets.getPipelineType(this.secondPipeline.proxyAddress.toString())

            const eventContract = tokenTransferEverscaleEventContract(this.contractAddress)
            const eventContractState = await getFullContractState(this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call({
                cachedState: eventContractState,
            })

            let status: EventStateStatus = 'pending'

            if (eventDetails._status === '2') {
                status = 'confirmed'
            }
            else if (eventDetails._status === '3') {
                status = 'rejected'
            }

            this.setState('secondEventState', {
                confirmations: eventDetails._confirms.length,
                requiredConfirmations: parseInt(eventDetails._requiredVotes, 10),
                status,
            })

            if (status !== 'confirmed') {
                return
            }

            if (this.data.withdrawalId === undefined || this.data.encodedEvent === undefined) {
                this.setState('releaseState', {
                    status: 'pending',
                })
            }

            if (pipelineType === 'multi_tvm_evm') {
                const everscaleConfiguration = eventDetails._eventInitData.configuration
                this.secondPipeline.setData('everscaleConfiguration', everscaleConfiguration)

                const everscaleEventConfigurationContractState = await getFullContractState(everscaleConfiguration)

                const [eventConfigDetails, flags] = await Promise.all([
                    everscaleEventConfigurationContract(everscaleConfiguration)
                    .methods.getDetails({ answerId: 0 })
                    .call({ cachedState: everscaleEventConfigurationContractState }),
                    everscaleEventConfigurationContract(everscaleConfiguration)
                    .methods.getFlags({ answerId: 0 })
                    .call({ cachedState: everscaleEventConfigurationContractState })
                    .then(value => value._flags)
                    .catch(() => '0'),
                ])

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                    flags,
                )

                const roundNumber = await eventContract.methods
                .round_number({})
                .call({
                    cachedState: eventContractState,
                })
                .then(result => result.round_number)

                this.setState('secondEventState', {
                    ...this.secondEventState,
                    roundNumber: parseInt(roundNumber, 10),
                    timestamp: Number(eventDetails._eventInitData.voteData.eventTimestamp),
                } as EvmEvmPipelineState['secondEventState'])

                /* eslint-disable sort-keys */
                const encodedEvent = this.web3.eth.abi.encodeParameters(
                    [
                        {
                            TONEvent: {
                                eventTransactionLt: 'uint64',
                                eventTimestamp: 'uint32',
                                eventData: 'bytes',
                                configurationWid: 'int8',
                                configurationAddress: 'uint256',
                                eventContractWid: 'int8',
                                eventContractAddress: 'uint256',
                                proxy: 'address',
                                round: 'uint32',
                            },
                        },
                    ],
                    [
                        {
                            eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
                            eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
                            eventData: eventDataEncoded,
                            configurationWid: everscaleConfiguration.toString().split(':')[0],
                            configurationAddress: `0x${everscaleConfiguration.toString().split(':')[1]}`,
                            eventContractWid: this.contractAddress.toString().split(':')[0],
                            eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                            proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy)
                            .toString(16)
                            .padStart(40, '0')}`,
                            round: roundNumber,
                        },
                    ],
                )
                const withdrawalId = this.web3.utils.keccak256(encodedEvent)

                this.setData({
                    encodedEvent,
                    withdrawalId,
                })

                if (this.secondEventState?.status === 'confirmed') {
                    this.runReleaseUpdater()
                }
            }
            else if (pipelineType === 'multi_evm_tvm') {
                const everscaleConfiguration = eventDetails._eventInitData.configuration
                this.secondPipeline.setData('everscaleConfiguration', everscaleConfiguration)

                const everscaleEventConfigurationContractState = await getFullContractState(everscaleConfiguration)

                const [eventConfigDetails, flags] = await Promise.all([
                    everscaleEventConfigurationContract(everscaleConfiguration)
                    .methods.getDetails({ answerId: 0 })
                    .call({ cachedState: everscaleEventConfigurationContractState }),
                    everscaleEventConfigurationContract(everscaleConfiguration)
                    .methods.getFlags({ answerId: 0 })
                    .call({ cachedState: everscaleEventConfigurationContractState })
                    .then(value => value._flags)
                    .catch(() => '0'),
                ])

                const eventDataEncoded = mapTonCellIntoEthBytes(
                    Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                    eventDetails._eventInitData.voteData.eventData,
                    flags,
                )

                const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

                this.setState('secondEventState', {
                    ...this.secondEventState,
                    roundNumber: parseInt(roundNumber, 10),
                    timestamp: Number(eventDetails._eventInitData.voteData.eventTimestamp),
                } as EvmEvmPipelineState['secondEventState'])

                const encodedEvent = this.web3.eth.abi.encodeParameters(
                    [
                        {
                            TONEvent: {
                                eventTransactionLt: 'uint64',
                                eventTimestamp: 'uint32',
                                eventData: 'bytes',
                                configurationWid: 'int8',
                                configurationAddress: 'uint256',
                                eventContractWid: 'int8',
                                eventContractAddress: 'uint256',
                                proxy: 'address',
                                round: 'uint32',
                            },
                        },
                    ],
                    [
                        {
                            eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
                            eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
                            eventData: eventDataEncoded,
                            configurationWid: everscaleConfiguration.toString().split(':')[0],
                            configurationAddress: `0x${everscaleConfiguration.toString().split(':')[1]}`,
                            eventContractWid: this.contractAddress.toString().split(':')[0],
                            eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                            proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy)
                            .toString(16)
                            .padStart(40, '0')}`,
                            round: roundNumber,
                        },
                    ],
                )
                const withdrawalId = this.web3.utils.keccak256(encodedEvent)

                this.setData({
                    encodedEvent,
                    withdrawalId,
                })

                if (this.secondEventState?.status === 'confirmed') {
                    this.runReleaseUpdater()
                }
            }
        })().finally(() => {
            if (this.secondEventState?.status !== 'confirmed' && this.secondEventState?.status !== 'rejected') {
                this.eventUpdater = setTimeout(() => {
                    this.runEventUpdater()
                }, 5000)
            }
        })
    }

    protected stopEventUpdater(): void {
        if (this.eventUpdater !== undefined) {
            clearTimeout(this.eventUpdater)
            this.eventUpdater = undefined
        }
    }

    protected runReleaseUpdater(): void {
        debug('runReleaseUpdater', toJS(this.data), toJS(this.state))

        this.stopReleaseUpdater();
        (async () => {
            if (
                this.data.withdrawalId !== undefined
                && this.token !== undefined
                && this.rightNetwork !== undefined
                && this.secondPipeline?.vaultAddress !== undefined
            ) {
                const network = findNetwork(this.secondPipeline.chainId, 'evm')

                if (network === undefined) {
                    return
                }

                const vaultContract = evmMultiVaultContract(this.secondPipeline.vaultAddress.toString(), network.rpcUrl)

                await this.syncVaultBalance()

                let ttl: string | undefined

                if (typeof this.secondEventState?.roundNumber === 'number') {
                    const bridgeAddress = await vaultContract.methods.bridge().call()

                    ttl = (
                        await evmBridgeContract(bridgeAddress, network.rpcUrl)
                        .methods.rounds(this.secondEventState.roundNumber)
                        .call()
                    ).ttl
                }

                const firstIteration = this.releaseState?.isReleased === undefined
                const isReleased = await vaultContract.methods.withdrawalIds(this.data.withdrawalId).call()
                const timestamp = Date.now() / 1000 - (this.secondEventState?.timestamp ?? 0)
                const isOutdated = timestamp >= 600
                const isInsufficientVaultBalance = (
                    this.releaseState?.isInsufficientVaultBalance
                    || this.isInsufficientVaultBalance
                )
                const shouldCheckPendingWithdrawals = (
                    timestamp < 120
                    || isInsufficientVaultBalance
                ) && (
                    !this.isTvmBasedToken
                    || !this.secondPipeline.isNative
                )

                if (this.releaseState?.status === 'pending' && firstIteration) {
                    const status = isReleased ? 'confirmed' : 'pending'
                    this.setState('releaseState', {
                        isOutdated: isReleased ? undefined : isOutdated,
                        isReleased,
                        status: shouldCheckPendingWithdrawals ? 'pending' : status,
                        ttl: (!isReleased && ttl !== undefined) ? parseInt(ttl, 10) : undefined,
                    })
                }

                if (isReleased) {
                    this.setState('releaseState', {
                        isPendingWithdrawal: shouldCheckPendingWithdrawals,
                        isReleased: !shouldCheckPendingWithdrawals,
                        status: shouldCheckPendingWithdrawals ? 'pending' : 'confirmed',
                    })
                    if (shouldCheckPendingWithdrawals) {
                        await this.runPendingWithdrawalUpdater(shouldCheckPendingWithdrawals ? 30 : 5)
                    }
                    else {
                        await this.runPendingWithdrawalUpdater(1)
                    }
                }
                else if (isOutdated && !this.releaseState?.isReleasing) {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        isOutdated: isReleased ? undefined : isOutdated,
                        isReleased: false,
                        status: 'disabled',
                    })
                }
            }
        })().finally(() => {
            if (
                this.releaseState?.status !== 'confirmed'
                && this.releaseState?.status !== 'rejected'
                && !this.releaseState?.isPendingWithdrawal
            ) {
                this.releaseUpdater = setTimeout(() => {
                    this.runReleaseUpdater()
                }, 5000)
            }
        })
    }

    protected stopReleaseUpdater(): void {
        if (this.releaseUpdater !== undefined) {
            clearTimeout(this.releaseUpdater)
            this.releaseUpdater = undefined
        }
    }

    protected async runPendingWithdrawalUpdater(triesCount: number = 5): Promise<void> {
        this.stopPendingWithdrawalUpdater()

        let attempts = 0

        this.setState('releaseState', {
            ...this.releaseState,
            isPendingWithdrawal: true,
            status: 'pending',
        })

        const runPendingWithdrawalUpdater = async (): Promise<void> => {
            debug('runPendingWithdrawalUpdater', toJS(this.data), toJS(this.state))

            attempts += 1

            await this.syncVaultBalance()
            await this.syncPendingWithdrawal()

            const isClosed = this.pendingWithdrawalStatus === 'Close'
                || (this.pendingWithdrawalId === undefined && attempts === triesCount)

            this.setState('releaseState', {
                ...this.releaseState,
                isPendingWithdrawal: !isClosed,
                status: isClosed ? 'confirmed' : 'pending',
            })

            if (!isClosed || this.pendingWithdrawalStatus === 'Open') {
                this.pendingWithdrawalUpdater = setTimeout(async () => {
                    await runPendingWithdrawalUpdater()
                }, 3000)
            }
        }

        await runPendingWithdrawalUpdater()
    }

    protected stopPendingWithdrawalUpdater(): void {
        if (this.pendingWithdrawalUpdater !== undefined) {
            clearTimeout(this.pendingWithdrawalUpdater)
            this.pendingWithdrawalUpdater = undefined
        }
    }

    protected async syncVaultBalance(): Promise<void> {
        if (this.secondPipeline === undefined) {
            return
        }

        const network = findNetwork(this.secondPipeline.chainId, 'evm')

        if (network === undefined) {
            return
        }

        if (this.secondPipeline.evmTokenAddress !== undefined) {
            if (this.secondPipeline.isMerged || !this.isTvmBasedToken) {
                const vaultBalance = await BridgeUtils.getEvmTokenBalance(
                    this.secondPipeline.evmTokenAddress,
                    this.secondPipeline.vaultAddress.toString(),
                    network.rpcUrl,
                )
                this.secondPipeline.setData('vaultBalance', vaultBalance)
            }
        }
    }

    protected async syncPendingWithdrawal(): Promise<void> {
        if (!this.contractAddress) {
            return
        }

        try {
            const { transfers } = await handleLiquidityRequests({
                contractAddress: this.contractAddress.toString(),
                limit: 1,
                offset: 0,
                ordering: 'createdatdescending',
            })
            if (transfers.length > 0) {
                this.setData({
                    pendingWithdrawalBounty: transfers[0].bounty,
                    pendingWithdrawalId: transfers[0].userId,
                    pendingWithdrawalStatus: transfers[0].status,
                })
            }
        }
        catch (e) {
            error(e)
        }
        finally {
            this.setState('isPendingWithdrawalSynced', true)
        }
    }

    public get amount(): EvmEvmPipelineData['amount'] {
        return this.data.amount
    }

    public get pipeline(): EvmEvmPipelineData['pipeline'] {
        return this.data.pipeline
    }

    public get secondPipeline(): EvmEvmPipelineData['secondPipeline'] {
        return this.data.secondPipeline
    }

    public get tvmAddress(): EvmEvmPipelineData['tvmAddress'] {
        return this.data.tvmAddress
    }

    public get deriveEventAddress(): EvmEvmPipelineData['deriveEventAddress'] {
        return this.data.deriveEventAddress
    }

    public get contractAddress(): EvmEvmPipelineData['contractAddress'] {
        return this.data.contractAddress
    }

    public get leftAddress(): EvmEvmPipelineData['leftAddress'] {
        return this.data.leftAddress
    }

    public get rightAddress(): EvmEvmPipelineData['rightAddress'] {
        return this.data.rightAddress
    }

    public get pendingWithdrawalId(): EvmEvmPipelineData['pendingWithdrawalId'] {
        return this.data.pendingWithdrawalId
    }

    public get pendingWithdrawalStatus(): EvmEvmPipelineData['pendingWithdrawalStatus'] {
        return this.data.pendingWithdrawalStatus
    }

    public get bounty(): EvmEvmPipelineData['pendingWithdrawalBounty'] {
        return this.data.pendingWithdrawalBounty
    }

    public get maxTransferFee(): EvmEvmPipelineData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    public get minTransferFee(): EvmEvmPipelineData['minTransferFee'] {
        return this.data.minTransferFee
    }

    public get token(): EvmEvmPipelineData['token'] {
        return this.data.token
    }

    public get eventState(): EvmEvmPipelineState['eventState'] {
        return this.state.eventState
    }

    public get isPendingWithdrawalSynced(): EvmEvmPipelineState['isPendingWithdrawalSynced'] {
        return this.state.isPendingWithdrawalSynced === true
    }

    public get prepareState(): EvmEvmPipelineState['prepareState'] {
        return this.state.prepareState
    }

    public get releaseState(): EvmEvmPipelineState['releaseState'] {
        return this.state.releaseState
    }

    public get transferState(): EvmEvmPipelineState['transferState'] {
        return this.state.transferState
    }

    public get secondPrepareState(): EvmEvmPipelineState['secondPrepareState'] {
        return this.state.secondPrepareState
    }

    public get secondEventState(): EvmEvmPipelineState['secondEventState'] {
        return this.state.secondEventState
    }

    public get isTvmBasedToken(): boolean {
        return this.secondPipeline?.tokenBase === 'tvm'
    }

    /**
     * Returns non-shifted amount field BigNumber instance
     */
    public get amountNumber(): BigNumber {
        return new BigNumber(this.amount || 0)
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

    public get isInsufficientVaultBalance(): boolean {
        return new BigNumber(this.secondPipeline?.vaultBalance ?? 0)
            .shiftedBy(-(this.secondPipeline?.evmTokenDecimals ?? 0))
            .lt(this.amountNumber
                .shiftedBy(this.token?.decimals ?? 0)
                .shiftedBy(-(this.token?.decimals ?? 0)))
    }

    public get txHash(): EvmTransferUrlParams['txHash'] | undefined {
        return this.params?.txHash
    }

    public get depositFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
            .shiftedBy(decimals)
            .times(this.pipeline?.depositFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-decimals)
            .toFixed()
    }

    public get withdrawFee(): string {
        const decimals = this.token?.decimals ?? this.pipeline?.evmTokenDecimals ?? 0
        return this.amountNumber
            .shiftedBy(decimals)
            .times(this.pipeline?.withdrawFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-decimals)
            .toFixed()
    }

    public get secondDepositFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
            .shiftedBy(decimals)
            .times(this.secondPipeline?.depositFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-decimals)
            .toFixed()
    }

    public get secondWithdrawFee(): string {
        const decimals = this.pipeline?.evmTokenDecimals ?? this.token?.decimals ?? 0
        return this.amountNumber
            .shiftedBy(decimals)
            .times(this.secondPipeline?.withdrawFee ?? 0)
            .div(10000)
            .dp(0, BigNumber.ROUND_UP)
            .shiftedBy(-decimals)
            .toFixed()
    }

    public get success(): boolean {
        return this.eventState?.status === 'confirmed'
    }

    public get bridgeAssets(): BridgeAssetsService {
        return this._bridgeAssets
    }

    public get evmWallet(): EvmWalletService {
        return this._evmWallet
    }

    public get tvmWallet(): EverWalletService {
        return this._tvmWallet
    }

    protected get web3(): Web3 {
        const network = findNetwork(this.leftNetwork?.chainId as string, 'evm')
        return new Web3(network?.rpcUrl as string)
    }

}
