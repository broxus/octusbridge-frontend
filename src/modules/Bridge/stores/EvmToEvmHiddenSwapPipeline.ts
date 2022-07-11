import { addABI, decodeMethod } from 'abi-decoder'
import BigNumber from 'bignumber.js'
import { mapTonCellIntoEthBytes } from 'eth-ton-abi-converter'
import { computed, makeObservable, toJS } from 'mobx'
import { Address } from 'everscale-inpage-provider'

import {
    CreditBody,
    CreditFactoryAddress,
    DepositToFactoryMaxSlippage,
    DepositToFactoryMinSlippageDenominator,
    DepositToFactoryMinSlippageNumerator,
    HiddenBridgeStrategyGas,
    IndexerApiBaseUrl,
    WEVERRootAddress,
} from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { Dex, DexConstants, EthAbi } from '@/misc'
import {
    creditFactoryContract,
    creditProcessorContract,
    dexPairContract,
    ethereumEventConfigurationContract,
    ethereumTokenTransferProxyContract,
    everscaleEventConfigurationContract,
    getFullContractState,
    tokenTransferEthereumEventContract,
    tokenTransferEverscaleEventContract,
} from '@/misc/contracts'
import { evmBridgeContract, evmVaultContract } from '@/misc/eth-contracts'
import { EverscaleToken, Pipeline } from '@/models'
import {
    DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA,
    DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_STATE,
} from '@/modules/Bridge/constants'
import { EvmToEverscaleSwapPipeline } from '@/modules/Bridge/stores/EvmToEverscaleSwapPipeline'
import type {
    BurnCallbackTableResponse,
    EventStateStatus,
    EvmHiddenSwapTransferStoreData,
    EvmHiddenSwapTransferStoreState,
    EvmSwapTransferStoreState,
    EvmTransferQueryParams,
    SearchBurnCallbackInfoRequest,
} from '@/modules/Bridge/types'
import { BurnCallbackOrdering, CreditProcessorState } from '@/modules/Bridge/types'
import { BridgeAssetsService } from '@/stores/BridgeAssetsService'
import { EverWalletService } from '@/stores/EverWalletService'
import { EvmWalletService } from '@/stores/EvmWalletService'
import {
    debug,
    error,
    findNetwork,
    getEverscaleMainNetwork,
    isGoodBignumber,
} from '@/utils'


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
        protected readonly bridgeAssets: BridgeAssetsService,
        protected readonly params?: EvmTransferQueryParams,
    ) {
        super(evmWallet, everWallet, bridgeAssets, params)

        this.setData(() => DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_DATA)
        this.setState(() => DEFAULT_EVM_HIDDEN_SWAP_TRANSFER_STORE_STATE)

        makeObservable<EvmToEvmHiddenSwapPipeline, | 'debt'>(this, {
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
        })
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
            }
        }
        catch (e) {
            error('Check transaction error', e)
            this.setState('isCheckingTransaction', false)
            return
        }

        if (!this.state.isCheckingTransaction) {
            try {
                switch (true) {
                    case this.secondEventState?.status === 'confirmed' && this.releaseState?.status !== 'confirmed':
                        await this.runEventUpdater()
                        break

                    default:
                        await this.resolve()
                }
            }
            catch (e) {
                error('Resolve error', e)
            }
        }
    }

    public async resolve(): Promise<void> {
        if (
            this.txHash === undefined
            || this.leftNetwork === undefined
            || this.bridgeAssets.tokens.length === 0
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
            const tx = await this.web3.eth.getTransaction(this.txHash)

            if (tx == null || tx.to == null) {
                debug('Transaction not found. Run check transaction runner')
                await this.checkTransaction()
                return
            }

            const token = this.bridgeAssets.findTokenByVaultAndChain(
                tx.to.toLowerCase(),
                this.leftNetwork.chainId,
            )

            if (token === undefined) {
                debug('Token not found. Exit resolve')
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
                const everscaleMainNetwork = getEverscaleMainNetwork()

                const pipelineCredit = await this.bridgeAssets.pipeline(
                    this.token.root,
                    `${this.leftNetwork.type}-${this.leftNetwork.chainId}`,
                    `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                    'credit',
                )

                let pipelineDefault

                if (pipelineCredit?.everscaleTokenAddress !== undefined) {
                    pipelineDefault = await this.bridgeAssets.pipeline(
                        pipelineCredit.everscaleTokenAddress.toString(),
                        `${everscaleMainNetwork?.type}-${everscaleMainNetwork?.chainId}`,
                        `${this.rightNetwork.type}-${this.rightNetwork.chainId}`,
                        'default',
                    )
                }

                this.setData({
                    pipelineCredit: pipelineCredit !== undefined ? new Pipeline(pipelineCredit) : undefined,
                    pipelineDefault: pipelineDefault !== undefined ? new Pipeline(pipelineDefault) : undefined,
                })
            }

            addABI(EthAbi.Vault)
            const methodCall = decodeMethod(tx.input)

            if (methodCall?.name !== 'depositToFactory') {
                debug('Is not a deposit to factory method call. Exit resolve')
                return
            }

            if (this.pipelineCredit?.ethereumConfiguration === undefined) {
                debug('Cannon find ethereum configuration in pipeline. Exit resolve')
                return
            }

            const ethConfigDetails = await ethereumEventConfigurationContract(this.pipelineCredit.ethereumConfiguration)
                .methods.getDetails({ answerId: 0 })
                .call()
            const { eventBlocksToConfirm } = ethConfigDetails._networkConfiguration

            const layer3 = methodCall?.params[10].value.substring(2, methodCall?.params[10].value.length)
            const event = await staticRpc.unpackFromCell({
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
            this.syncPair(),
            this.syncCreditFactoryFee(),
        ])
        await this.syncTransferFees()
    }

    public async release(): Promise<void> {
        let tries = 0

        const send = async (transactionType?: string) => {
            if (
                tries >= 2
                || this.rightNetwork === undefined
                || this.contractAddress === undefined
                || this.pipelineDefault?.vaultAddress === undefined
                || this.evmWallet.web3 === undefined
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

            const vaultContract = new this.evmWallet.web3.eth.Contract(EthAbi.Vault, this.pipelineDefault.vaultAddress)

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
                if (
                    /eip-1559/g.test(e.message.toLowerCase())
                    && transactionType !== undefined && transactionType !== '0x0'
                ) {
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

            const cachedState = await getFullContractState(this.deriveEventAddress)

            if (cachedState === undefined || !cachedState?.isDeployed) {
                if (this.prepareState?.status !== 'pending') {
                    this.setState('prepareState', this.prepareState)
                }

                if (this.txHash !== undefined) {
                    try {
                        const { blockNumber } = await this.web3.eth.getTransactionReceipt(this.txHash)
                        const networkBlockNumber = await this.web3.eth.getBlockNumber()

                        this.setState('transferState', {
                            ...this.transferState,
                            confirmedBlocksCount: networkBlockNumber - blockNumber,
                        } as EvmSwapTransferStoreState['transferState'])

                        const ts = parseInt(
                            (await this.web3.eth.getBlock(blockNumber)).timestamp.toString(),
                            10,
                        )

                        debug('Outdated ts', `${(Date.now() / 1000) - ts} / 600`)

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

            if (this.creditProcessorAddress === undefined) {
                return
            }

            await this.checkOwner()

            const creditProcessorDetails = (await creditProcessorContract(this.creditProcessorAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                .value0

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
                        .shiftedBy(-(this.token?.decimals ?? 0))
                    const tokenAmountNumber = new BigNumber(this.amount)
                        .shiftedBy(-(this.pipelineCredit?.evmTokenDecimals ?? 0))

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
                    const eventDetails = await tokenTransferEthereumEventContract(this.deriveEventAddress)
                        .methods.getDetails({ answerId: 0 })
                        .call({ cachedState })

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

            const tx = (await staticRpc.getTransactions({ address: this.deriveEventAddress })).transactions[0]

            this.setState('swapState', {
                ...this.swapState,
                deployer: creditProcessorDetails.deployer,
            } as EvmSwapTransferStoreState['swapState'])

            const isStuckNow = this.swapState?.isStuck
            const isStuck = ((Date.now() / 1000) - tx.createdAt) >= 600 && !isCancelled && !isProcessed

            debug('Stuck ts', `${(Date.now() / 1000) - tx.createdAt} / 600`)

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
            if (this.contractAddress === undefined || this.leftNetwork === undefined) {
                return
            }

            const eventContract = tokenTransferEverscaleEventContract(this.contractAddress)
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
            const proxyDetails = await ethereumTokenTransferProxyContract(proxyAddress)
                .methods.getDetails({ answerId: 0 })
                .call()

            const eventConfigDetails = await everscaleEventConfigurationContract(proxyDetails.value0.tonConfiguration)
                .methods.getDetails({ answerId: 0 })
                .call()
            const eventDataEncoded = mapTonCellIntoEthBytes(
                Buffer.from(eventConfigDetails._basicConfiguration.eventABI, 'base64').toString(),
                eventDetails._eventInitData.voteData.eventData,
            )

            const roundNumber = (await eventContract.methods.round_number({}).call()).round_number

            this.setState('secondEventState', {
                ...this.secondEventState,
                roundNumber: parseInt(roundNumber, 10),
            } as EvmHiddenSwapTransferStoreState['secondEventState'])

            const encodedEvent = this.web3.eth.abi.encodeParameters([{
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
                round: roundNumber,
            }])
            const withdrawalId = this.web3.utils.keccak256(encodedEvent)

            this.setData({
                encodedEvent,
                withdrawalId,
            })

            if (this.secondEventState?.status === 'confirmed') {
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
                && this.pipelineDefault?.vaultAddress !== undefined
            ) {
                const network = findNetwork(this.pipelineDefault.chainId, 'evm')

                if (network === undefined) {
                    return
                }

                const vaultContract = evmVaultContract(this.pipelineDefault.vaultAddress, network.rpcUrl)

                let ttl: string | undefined

                if (typeof this.secondEventState?.roundNumber === 'number') {
                    const bridgeAddress = await vaultContract.methods.bridge().call()

                    ttl = (await evmBridgeContract(bridgeAddress, network.rpcUrl)
                        .methods.rounds(this.secondEventState.roundNumber)
                        .call()).ttl
                }

                const isReleased = await vaultContract.methods.withdrawalIds(this.data.withdrawalId).call()

                if (this.releaseState?.status === 'pending' && this.releaseState?.isReleased === undefined) {
                    this.setState('releaseState', {
                        isReleased,
                        status: isReleased ? 'confirmed' : 'disabled',
                        ttl: ttl !== undefined ? parseInt(ttl, 10) : undefined,
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
        try {
            const { fee } = (await creditFactoryContract(CreditFactoryAddress)
                .methods.getDetails({ answerId: 0 })
                .call())
                .value0

            this.setData('creditFactoryFee', fee)
        }
        catch (e) {
            this.setData('creditFactoryFee', '')
            error('Sync fee error', e)
        }
    }

    protected async syncPair(): Promise<void> {
        if (this.token?.address === undefined) {
            return
        }

        try {
            const pairAddress = await Dex.checkPair(
                WEVERRootAddress,
                (this.token as EverscaleToken).address,
            )

            if (pairAddress === undefined) {
                return
            }

            const pairState = await getFullContractState(pairAddress)

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
        if (this.data.pairAddress === undefined || this.token === undefined) {
            return
        }

        try {
            const results = await Promise.allSettled([
                dexPairContract(this.data.pairAddress)
                    .methods.expectedSpendAmount({
                        answerId: 0,
                        receive_amount: this.debt
                            .shiftedBy(DexConstants.CoinDecimals)
                            .plus(HiddenBridgeStrategyGas)
                            .times(100)
                            .div(new BigNumber(100).minus(
                                new BigNumber(DepositToFactoryMinSlippageNumerator)
                                    .div(DepositToFactoryMinSlippageDenominator)
                                    .toFixed(),
                            ))
                            .dp(0, BigNumber.ROUND_UP)
                            .toFixed(),
                        receive_token_root: WEVERRootAddress,
                    })
                    .call({
                        cachedState: toJS(this.data.pairState),
                    }),
                dexPairContract(this.data.pairAddress)
                    .methods.expectedSpendAmount({
                        answerId: 0,
                        receive_amount: this.debt
                            .shiftedBy(DexConstants.CoinDecimals)
                            .plus(HiddenBridgeStrategyGas)
                            .times(100)
                            .div(new BigNumber(100).minus(DepositToFactoryMaxSlippage))
                            .dp(0, BigNumber.ROUND_UP)
                            .toFixed(),
                        receive_token_root: WEVERRootAddress,
                    })
                    .call({
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

    public get pipeline(): EvmHiddenSwapTransferStoreData['pipeline'] {
        return this.pipelineCredit
    }

    public get pipelineCredit(): EvmHiddenSwapTransferStoreData['pipelineCredit'] {
        return this.data.pipelineCredit
    }

    public get pipelineDefault(): EvmHiddenSwapTransferStoreData['pipelineDefault'] {
        return this.data.pipelineDefault
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
        return new BigNumber(CreditBody)
            .plus(new BigNumber(this.data.creditFactoryFee || 0))
            .shiftedBy(-DexConstants.CoinDecimals)
    }

}
