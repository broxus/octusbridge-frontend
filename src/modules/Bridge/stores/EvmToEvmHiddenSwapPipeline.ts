import { addABI, decodeMethod } from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import isEqual from 'lodash.isequal'
import {
    computed,
    makeObservable,
    override,
    toJS,
} from 'mobx'
import { Address, Contract } from 'everscale-inpage-provider'

import { IndexerApiBaseUrl } from '@/config'
import rpc from '@/hooks/useRpcClient'
import {
    BridgeConstants, Dex,
    DexAbi,
    DexConstants, EthAbi,
    TokenAbi,
} from '@/misc'
import {
    DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA,
    DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import { EvmToEverscaleSwapPipeline } from '@/modules/Bridge/stores/EvmToEverscaleSwapPipeline'
import {
    BurnCallbackOrdering,
    BurnCallbackTableResponse,
    CreditProcessorState,
    EventStateStatus,
    EvmHiddenSwapTransferStoreData,
    EvmHiddenSwapTransferStoreState,
    EvmSwapTransferStoreState,
    EvmTransferQueryParams,
    SearchBurnCallbackInfoRequest,
} from '@/modules/Bridge/types'
import { getCreditFactoryContract } from '@/modules/Bridge/utils'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import { Pipeline, TokensCacheService } from '@/stores/TokensCacheService'
import {
    debug,
    error,
    getEverscaleMainNetwork,
    isGoodBignumber,
} from '@/utils'


// noinspection DuplicatedCode
export class EvmToEvmHiddenSwapPipeline extends EvmToEverscaleSwapPipeline<
    EvmHiddenSwapTransferStoreData,
    EvmHiddenSwapTransferStoreState
> {

    protected contractUpdater: ReturnType<typeof setTimeout> | undefined

    protected eventUpdater: ReturnType<typeof setTimeout> | undefined

    protected releaseUpdater: ReturnType<typeof setTimeout> | undefined

    constructor(
        protected readonly evmWallet: EvmWalletService,
        protected readonly everWallet: EverWalletService,
        protected readonly tokensCache: TokensCacheService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        super(evmWallet, everWallet, tokensCache, params)

        this.data = DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA
        this.state = DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_STATE

        makeObservable<
            EvmToEvmHiddenSwapPipeline,
            | 'data'
            | 'state'
            | 'debt'
            | 'pairContract'
        >(this, {
            data: override,
            state: override,
            contractAddress: computed,
            everscaleAddress: computed,
            maxTransferFee: computed,
            minTransferFee: computed,
            swapAmount: computed,
            tokenAmount: computed,
            secondPrepareState: computed,
            secondEventState: computed,
            releaseState: computed,
            debt: computed,
            pairContract: computed,
        })
    }

    public async resolve(): Promise<void> {
        if (
            this.evmWallet.web3 === undefined
            || this.txHash === undefined
            || this.leftNetwork === undefined
            || this.tokensCache.tokens.length === 0
            || this.transferState?.status === 'confirmed'
        ) {
            return
        }

        this.setState('transferState', {
            confirmedBlocksCount: this.state.transferState?.confirmedBlocksCount || 0,
            eventBlocksToConfirm: this.state.transferState?.eventBlocksToConfirm || 0,
            status: 'pending',
        })

        try {
            const tx = await this.evmWallet.web3.eth.getTransaction(this.txHash)

            if (tx == null || tx.to == null) {
                debug('Transaction not found. Run check transaction runner')
                await this.checkTransaction()
                return
            }

            const token = this.tokensCache.findTokenByVaultAddress(
                tx.to,
                this.leftNetwork.chainId,
            )

            if (token === undefined) {
                debug('Token not found. Exit resolve')
                return
            }

            this.setData('token', token)

            await this.tokensCache.syncEvmToken(this.pipelineCredit)

            addABI(EthAbi.Vault)
            const methodCall = decodeMethod(tx.input)

            if (methodCall?.name !== 'depositToFactory') {
                debug('Is not a deposit to factory method call. Exit resolve')
                return
            }

            const ethereumConfiguration = this.pipelineCredit?.ethereumConfiguration

            if (ethereumConfiguration === undefined) {
                debug('Cannon find ethereum configuration in pipeline. Exit resolve')
                return
            }

            const ethConfigAddress = new Address(ethereumConfiguration)

            this.setData('ethConfigAddress', ethConfigAddress)

            const ethConfig = new rpc.Contract(TokenAbi.EthEventConfig, ethConfigAddress)
            const ethConfigDetails = await ethConfig.methods.getDetails({ answerId: 0 }).call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            const layer3 = methodCall?.params[10].value.substring(2, methodCall?.params[10].value.length)
            const event = await rpc.unpackFromCell({
                allowPartial: true,
                boc: Buffer.from(layer3, 'hex').toString('base64'),
                structure: [
                    { name: 'id', type: 'uint32' },
                    { name: 'proxy', type: 'address' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ] as const,
            })

            const targetWid = methodCall?.params[1].value
            const targetAddress = methodCall?.params[2].value

            this.setData({
                amount: methodCall?.params[0].value,
                everscaleAddress: `${targetWid}:${new BigNumber(targetAddress).toString(16).padStart(64, '0')}`.toLowerCase(),
                leftAddress: tx.from.toLowerCase(),
                rightAddress: `0x${new BigNumber(event.data.evmAddress).toString(16).padStart(40, '0')}`.toLowerCase(),
                tokenAmount: methodCall?.params[5].value,
            })

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

        await Promise.all([
            this.everWallet.isConnected ? this.syncPair() : undefined,
            this.syncCreditFactoryFee(),
        ])
        await this.syncTransferFees()
    }

    public async release(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.evmWallet.web3 === undefined
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.token === undefined
                || this.data.encodedEvent === undefined
            ) {
                return
            }

            this.setState('releaseState', {
                ...this.releaseState,
                status: 'pending',
            })

            const eventContract = new rpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

            const signatures = eventDetails._signatures.map(sign => {
                const signature = `0x${Buffer.from(sign, 'base64').toString('hex')}`
                const address = this.evmWallet.web3!.eth.accounts.recover(
                    this.evmWallet.web3!.utils.sha3(this.data.encodedEvent!)!,
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

            const vaultContract = this.tokensCache.getEvmTokenVaultContract(this.pipelineDefault)

            if (vaultContract === undefined) {
                this.setState('releaseState', {
                    ...this.releaseState,
                    status: 'disabled',
                })
                return
            }

            try {
                tries += 1

                await vaultContract.methods.saveWithdraw(
                    this.data.encodedEvent,
                    signatures.map(({ signature }) => signature),
                ).send({
                    from: this.evmWallet.address,
                    type: transactionType,
                })
            }
            catch (e: any) {
                if (/EIP-1559/g.test(e.message) && transactionType !== undefined && transactionType !== '0x0') {
                    error('Release tokens error. Try with transaction type 0x0', e)
                    await send('0x0')
                }
                else {
                    this.setState('releaseState', {
                        ...this.releaseState,
                        status: 'disabled',
                    })
                    error('Release tokens error', e)
                }
            }
        }

        await send(this.rightNetwork?.transactionType)
    }

    protected runCreditProcessorUpdater(): void {
        debug('runCreditProcessorUpdater', toJS(this.data), toJS(this.state))

        this.stopCreditProcessorUpdater();

        (async () => {
            if (this.deriveEventAddress === undefined) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }
                return
            }

            const cachedState = (await rpc.getFullContractState({
                address: this.deriveEventAddress,
            })).state

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }

                if (this.evmWallet.web3 !== undefined && this.txHash !== undefined) {
                    try {
                        const { blockNumber } = await this.evmWallet.web3.eth.getTransactionReceipt(this.txHash)
                        const networkBlockNumber = await this.evmWallet.web3.eth.getBlockNumber()

                        this.setState('transferState', {
                            ...this.transferState,
                            confirmedBlocksCount: networkBlockNumber - blockNumber,
                        } as EvmSwapTransferStoreState['transferState'])

                        const ts = parseInt(
                            (await this.evmWallet.web3.eth.getBlock(blockNumber)).timestamp.toString(),
                            10,
                        )

                        debug('Outdated ts', (Date.now() / 1000) - ts)

                        this.setState('prepareState', {
                            ...this.prepareState,
                            isOutdated: ((Date.now() / 1000) - ts) >= 600,
                        } as EvmSwapTransferStoreState['prepareState'])
                    }
                    catch (e) {
                        error('Credit processor updater error', e)
                    }
                }

                return
            }

            if (this.creditProcessorContract === undefined || this.creditProcessorAddress === undefined) {
                return
            }

            await this.checkOwner()

            const creditProcessorDetails = (await this.creditProcessorContract.methods.getDetails({
                answerId: 0,
            }).call()).value0

            const state = parseInt(creditProcessorDetails.state, 10)
            const isCancelled = state === CreditProcessorState.Cancelled
            const isProcessed = state === CreditProcessorState.Processed

            if (this.creditProcessorState !== state) {
                this.setState('swapState', {
                    ...this.swapState,
                    isCanceling: false,
                    isProcessing: false,
                } as EvmSwapTransferStoreState['swapState'])
            }

            this.setState('creditProcessorState', state)

            if (isCancelled || isProcessed) {
                this.setState({
                    prepareState: {
                        status: 'confirmed',
                    },
                    eventState: {
                        confirmations: this.eventState?.confirmations || 0,
                        requiredConfirmations: this.eventState?.requiredConfirmations || 0,
                        status: 'confirmed',
                    },
                    swapState: {
                        ...this.swapState,
                        isStuck: false,
                        status: isCancelled ? 'disabled' : 'pending',
                    },
                })

                if (isCancelled) {
                    await this.checkWithdrawBalances()
                }

                const swapState: EvmSwapTransferStoreState['swapState'] = {
                    ...this.swapState,
                    status: isCancelled ? 'disabled' : 'confirmed',
                }

                this.setState('swapState', swapState)

                if (isProcessed) {
                    this.setData('swapAmount', creditProcessorDetails.swapAmount)

                    const swapAmountNumber = new BigNumber(creditProcessorDetails.swapAmount)
                        .shiftedBy(this.token?.decimals ? -this.token.decimals : 0)
                    const tokenAmountNumber = new BigNumber(this.amount)
                        .shiftedBy(this.pipelineCredit?.evmTokenDecimals ? -this.pipelineCredit.evmTokenDecimals : 0)

                    if (isGoodBignumber(tokenAmountNumber) && isGoodBignumber(swapAmountNumber)) {
                        this.setData(
                            'tokenAmount',
                            tokenAmountNumber
                                .minus(swapAmountNumber)
                                .shiftedBy(this.token?.decimals || 0)
                                .toFixed(),
                        )
                    }

                    this.setState('secondPrepareState', {
                        status: 'pending',
                    })

                    this.runContractUpdater()
                }

                return
            }

            if (state >= CreditProcessorState.EventDeployInProgress) {
                if (this.prepareState?.status !== 'confirmed') {
                    this.setState('prepareState', {
                        status: 'confirmed',
                    })
                }

                if (this.eventState?.status !== 'confirmed' && this.eventState?.status !== 'rejected') {
                    const eventContract = new rpc.Contract(
                        TokenAbi.TokenTransferEthEvent,
                        this.deriveEventAddress,
                    )
                    const eventDetails = await eventContract.methods.getDetails({
                        answerId: 0,
                    }).call({
                        cachedState,
                    })

                    const eventState: EvmSwapTransferStoreState['eventState'] = {
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

                    this.setState('eventState', eventState)

                    if (eventState.status !== 'confirmed' && eventState.status !== 'rejected') {
                        return
                    }

                    if (eventState.status === 'confirmed') {
                        this.setState('swapState', {
                            ...this.swapState,
                            status: 'pending',
                        })
                    }
                }
            }

            const tx = (await rpc.getTransactions({ address: this.deriveEventAddress })).transactions[0]

            this.setState('swapState', {
                ...this.swapState,
                deployer: creditProcessorDetails.deployer,
            } as EvmSwapTransferStoreState['swapState'])

            const isStuckNow = this.swapState?.isStuck
            const isStuck = ((Date.now() / 1000) - tx.createdAt) >= 600 && !isCancelled && !isProcessed

            debug('Stuck ts', (Date.now() / 1000) - tx.createdAt)

            if ([
                CreditProcessorState.EventConfirmed,
                CreditProcessorState.SwapFailed,
                CreditProcessorState.SwapUnknown,
                CreditProcessorState.UnwrapFailed,
                CreditProcessorState.ProcessRequiresGas,
            ].includes(state) && isStuck) {
                this.setState('swapState', {
                    ...this.swapState,
                    isStuck: isStuckNow === undefined ? true : isStuckNow,
                    status: 'pending',
                })
                return
            }

            this.setState('swapState', {
                ...this.swapState,
                isStuck: isStuckNow,
            } as EvmSwapTransferStoreState['swapState'])

            if (this.eventState?.status === 'confirmed') {
                this.setState('swapState', {
                    ...this.swapState,
                    status: 'pending',
                })
            }
            else {
                this.setState('swapState', this.swapState)
            }
        })().finally(() => {
            if (
                this.swapState?.status !== 'confirmed'
                && this.swapState?.status !== 'rejected'
                && this.creditProcessorState !== CreditProcessorState.Cancelled
            ) {
                this.txCreditProcessorUpdater = setTimeout(() => {
                    this.runCreditProcessorUpdater()
                }, 5000)
            }
        })
    }

    protected runContractUpdater(): void {
        debug('runContractUpdater', toJS(this.data), toJS(this.state))

        this.stopContractUpdater();

        (async () => {
            const body: SearchBurnCallbackInfoRequest = {
                chainId: this.rightNetwork?.chainId !== undefined
                    ? parseInt(this.rightNetwork.chainId, 10)
                    : undefined,
                creditProcessorAddress: this.creditProcessorAddress?.toString(),
                limit: 20,
                offset: 0,
                ordering: BurnCallbackOrdering.CREATED_AT_DESCENDING,
                // proxyAddress: this.tokenVault?.ethereumConfiguration,
            }
            const url = `${IndexerApiBaseUrl}/burn_callbacks/search`
            const [transfer]: BurnCallbackTableResponse['transfers'] = (await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then(res => res.json())).transfers

            if (transfer?.tonEventContractAddress == null) {
                return
            }

            this.setData('contractAddress', new Address(transfer.tonEventContractAddress))

            this.setState({
                secondPrepareState: {
                    status: 'confirmed',
                },
                secondEventState: {
                    confirmations: this.secondEventState?.confirmations || 0,
                    requiredConfirmations: this.secondEventState?.requiredConfirmations || 0,
                    status: 'pending',
                },
            })

            this.runEventUpdater()
        })().finally(() => {
            if (
                this.secondPrepareState?.status !== 'confirmed'
                && this.secondPrepareState?.status !== 'rejected'
            ) {
                this.txCreditProcessorUpdater = setTimeout(() => {
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
                !this.evmWallet.isConnected
                || !this.everWallet.isConnected
                || this.evmWallet.web3 === undefined
                || this.contractAddress === undefined
            ) {
                return
            }

            const eventContract = new rpc.Contract(TokenAbi.TokenTransferTonEvent, this.contractAddress)
            const eventDetails = await eventContract.methods.getDetails({ answerId: 0 }).call()

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

            const proxyAddress = eventDetails._initializer
            const proxyContract = new rpc.Contract(TokenAbi.EvmTokenTransferProxy, proxyAddress)

            const tokenAddress = (await proxyContract.methods.getTokenRoot({ answerId: 0 }).call()).value0

            const token = this.tokensCache.get(tokenAddress.toString())

            if (token === undefined) {
                return
            }

            const proxyDetails = await proxyContract.methods.getDetails({ answerId: 0 }).call()

            const eventConfig = new rpc.Contract(TokenAbi.EverscaleEventConfig, proxyDetails.value0.tonConfiguration)
            const eventConfigDetails = await eventConfig.methods.getDetails({ answerId: 0 }).call()
            const eventDataEncoded = mapTonCellIntoEthBytes(
                Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                eventDetails._eventInitData.voteData.eventData,
            )

            const encodedEvent = this.evmWallet.web3.eth.abi.encodeParameters([{
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
            }], [{
                eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
                eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
                eventData: eventDataEncoded,
                configurationWid: proxyDetails.value0.tonConfiguration.toString().split(':')[0],
                configurationAddress: `0x${proxyDetails.value0.tonConfiguration.toString().split(':')[1]}`,
                eventContractWid: this.contractAddress.toString().split(':')[0],
                eventContractAddress: `0x${this.contractAddress.toString().split(':')[1]}`,
                proxy: `0x${new BigNumber(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, '0')}`,
                round: (await eventContract.methods.round_number({}).call()).round_number,
            }])
            const withdrawalId = this.evmWallet.web3.utils.keccak256(encodedEvent)

            this.setData({
                encodedEvent,
                withdrawalId,
            })

            if (this.evmWallet.isConnected && this.secondEventState?.status === 'confirmed') {
                this.runReleaseUpdater()
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
                && isEqual(this.rightNetwork.chainId, this.evmWallet.chainId)
            ) {
                const vaultContract = this.tokensCache.getEvmTokenVaultContract(this.pipelineDefault)
                const isReleased = await vaultContract?.methods.withdrawalIds(this.data.withdrawalId).call()

                if (this.releaseState?.status === 'pending' && this.releaseState?.isReleased === undefined) {
                    this.setState('releaseState', {
                        isReleased,
                        status: isReleased ? 'confirmed' : 'disabled',
                    })
                }

                if (isReleased) {
                    this.setState('releaseState', {
                        isReleased: true,
                        status: 'confirmed',
                    })
                }
            }
        })().finally(() => {
            if (this.releaseState?.status !== 'confirmed' && this.releaseState?.status !== 'rejected') {
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

    protected async syncCreditFactoryFee(): Promise<void> {
        const creditFactory = getCreditFactoryContract()
        try {
            const { fee } = (await creditFactory.methods.getDetails({
                answerId: 0,
            }).call()).value0

            this.setData('creditFactoryFee', fee)
        }
        catch (e) {
            this.setData('creditFactoryFee', '')
            error('Sync fee error', e)
        }
    }

    protected async syncPair(): Promise<void> {
        if (this.token?.root === undefined) {
            return
        }

        try {
            const pairAddress = await Dex.checkPair(
                DexConstants.WTONRootAddress,
                new Address(this.token.root),
            )

            if (pairAddress === undefined) {
                return
            }

            const pairState = (await rpc.getFullContractState({
                address: pairAddress,
            })).state

            debug('Sync pair')
            this.setData({
                pairAddress,
                pairState,
            })
        }
        catch (e) {
            error('Sync pair error', e)
        }
    }

    protected async syncTransferFees(): Promise<void> {
        if (this.pairContract === undefined || this.token === undefined) {
            return
        }

        try {
            const results = await Promise.allSettled([
                this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .shiftedBy(DexConstants.CoinDecimals)
                        .plus(BridgeConstants.HiddenBridgeStrategyGas)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMinSlippage))
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
                    cachedState: toJS(this.data.pairState),
                }),
                this.pairContract.methods.expectedSpendAmount({
                    answerId: 0,
                    receive_amount: this.debt
                        .shiftedBy(DexConstants.CoinDecimals)
                        .plus(BridgeConstants.HiddenBridgeStrategyGas)
                        .times(100)
                        .div(new BigNumber(100).minus(BridgeConstants.DepositToFactoryMaxSlippage))
                        .dp(0, BigNumber.ROUND_UP)
                        .toFixed(),
                    receive_token_root: DexConstants.WTONRootAddress,
                }).call({
                    cachedState: toJS(this.data.pairState),
                }),
            ]).then(r => r.map(i => (i.status === 'fulfilled' ? i.value : undefined)))

            this.setData({
                minTransferFee: results[0]?.expected_amount,
                maxTransferFee: results[1]?.expected_amount,
            })
        }
        catch (e) {
            error('Sync transfers fee error', e)
        }
    }

    public get pipelineCredit(): Pipeline | undefined {
        if (
            this.token?.root === undefined
            || this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.rightNetwork?.type === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return undefined
        }

        const everscaleMainNetwork = getEverscaleMainNetwork()

        return this.tokensCache.pipeline(
            this.token.root,
            `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
            `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
            'credit',
        )
    }

    public get pipelineDefault(): Pipeline | undefined {
        if (
            this.token?.root === undefined
            || this.leftNetwork?.type === undefined
            || this.leftNetwork?.chainId === undefined
            || this.rightNetwork?.type === undefined
            || this.rightNetwork?.chainId === undefined
        ) {
            return undefined
        }

        const everscaleMainNetwork = getEverscaleMainNetwork()

        return this.tokensCache.pipeline(
            this.token.root,
            `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
            `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
            'default',
        )
    }

    public get contractAddress(): EvmHiddenSwapTransferStoreData['contractAddress'] {
        return this.data.contractAddress
    }

    public get everscaleAddress(): EvmHiddenSwapTransferStoreData['everscaleAddress'] {
        return this.data.everscaleAddress
    }

    public get maxTransferFee(): EvmHiddenSwapTransferStoreData['maxTransferFee'] {
        return this.data.maxTransferFee
    }

    public get minTransferFee(): EvmHiddenSwapTransferStoreData['minTransferFee'] {
        return this.data.minTransferFee
    }

    public get swapAmount(): EvmHiddenSwapTransferStoreData['swapAmount'] {
        return this.data.swapAmount
    }

    public get tokenAmount(): EvmHiddenSwapTransferStoreData['tokenAmount'] {
        return this.data.tokenAmount
    }

    public get secondPrepareState(): EvmHiddenSwapTransferStoreState['secondPrepareState'] {
        return this.state.secondPrepareState
    }

    public get secondEventState(): EvmHiddenSwapTransferStoreState['secondEventState'] {
        return this.state.secondEventState
    }

    public get releaseState(): EvmHiddenSwapTransferStoreState['releaseState'] {
        return this.state.releaseState
    }

    protected get debt(): BigNumber {
        return new BigNumber(BridgeConstants.CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.CoinDecimals)
    }

    protected get pairContract(): Contract<typeof DexAbi.Pair> | undefined {
        return this.data.pairAddress !== undefined
            ? new rpc.Contract(DexAbi.Pair, this.data.pairAddress)
            : undefined
    }

}
