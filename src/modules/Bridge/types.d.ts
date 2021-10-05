import BigNumber from 'bignumber.js'
import { Address, DecodedAbiFunctionInputs } from 'ton-inpage-provider'
import { LogItem } from 'abi-decoder'
import { Transaction } from 'web3-core'

import { TokenAbi } from '@/misc'
import { TokenCache } from '@/stores/TokensCacheService'


export type NetworkShape = {
    chainId: string;
    label: string;
    type: string;
}

export type ApprovalStrategies = 'infinity' | 'fixed'

export type CrosschainBridgeStoreData = {
    amount: string;
    approvalDelta?: BigNumber;
    balance?: string;
    leftAddress: string;
    leftNetwork?: NetworkShape;
    rightAddress: string;
    rightNetwork?: NetworkShape;
    selectedToken?: string;
    txHash?: string;
}

export type AddressesFields = Pick<CrosschainBridgeStoreData, 'leftAddress' | 'rightAddress'>

export type EventVoteData = DecodedAbiFunctionInputs<typeof TokenAbi.EthEventConfig, 'deployEvent'>['eventVoteData']

export type NetworkFields = Pick<CrosschainBridgeStoreData, 'leftNetwork' | 'rightNetwork'>

export enum CrosschainBridgeStep {
    SELECT_ROUTE,
    SELECT_ASSET,
    SELECT_APPROVAL_STRATEGY,
    TRANSFER,
}

export type CrosschainBridgeStoreState = {
    approvalStrategy: ApprovalStrategies;
    step: CrosschainBridgeStep;
}

export type EventStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type PrepareStateStatus = 'confirmed' | 'pending' | 'disabled'

export type ReleaseStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type TransferStateStatus = 'confirmed' | 'pending' | 'disabled' | 'rejected'

export type EvmTransferQueryParams = {
    fromId: string;
    fromType: string;
    toId: string;
    toType: string;
    txHash: string;
}

export type EvmTransferStoreData = {
    amount: string;
    deriveEventAddress?: Address;
    ethConfigAddress?: string;
    eventVoteData?: EventVoteData;
    leftAddress?: string;
    log?: LogItem;
    rightAddress?: string;
    token: TokenCache | undefined;
    tx?: Transaction;
}

export type EvmTransferStoreState = {
    eventState?: {
        confirmations: number;
        requiredConfirmations: number;
        status: EventStateStatus;
    };
    prepareState?: PrepareStateStatus;
    transferState?: {
        confirmedBlocksCount: number;
        eventBlocksToConfirm: number;
        status: TransferStateStatus;
    },
}


export type TonTransferQueryParams = {
    contractAddress: string;
    fromId: string;
    fromType: string;
    toId: string;
    toType: string;
}

export type TonTransferStoreData = {
    amount: string;
    chainId?: string;
    encodedEvent?: string;
    leftAddress?: string;
    rightAddress?: string;
    token: TokenCache | undefined;
    withdrawalId?: string;
}

export type TonTransferStoreState = {
    isContractDeployed: boolean;
    eventState?: {
        status: EventStateStatus;
        confirmations: number;
        requiredConfirmations: number;
    };
    prepareState?: PrepareStateStatus;
    releaseState?: ReleaseStateStatus;
}

