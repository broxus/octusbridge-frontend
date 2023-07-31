import { error } from '@broxus/js-utils'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { type AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { Buffer } from 'buffer'

import { IndexerApiBaseUrl } from '@/config'
import staticRpc from '@/hooks/useStaticRpc'
import { DexConstants } from '@/misc'
import { TransitOperation } from '@/modules/Bridge/types'

export function unshiftedAmountWithSlippage(amount: BigNumber, slippage: number | string): BigNumber {
    return amount
        .times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.CoinDecimals)
        .dp(0, BigNumber.ROUND_UP)
}

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

export async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey,
): Promise<PublicKey> {
    return (
        await PublicKey.findProgramAddress(
            [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        )
    )[0]
}

export function accountMetaFromRust(meta: any): AccountMeta {
    return {
        isSigner: meta.is_signer,
        isWritable: meta.is_writable,
        pubkey: new PublicKey(meta.pubkey),
    }
}

export function ixFromRust(data: any): TransactionInstruction {
    const keys: Array<AccountMeta> = data.accounts.map(accountMetaFromRust)
    return new TransactionInstruction({
        data: Buffer.from(data.data),
        keys,
        programId: new PublicKey(data.program_id),
    })
}

export type Tickers = 'ETH' | 'BNB' | 'FTM' | 'MATIC' | 'AVAX' | string

export async function getPrice(ticker: Tickers): Promise<string> {
    const response = await fetch(`${IndexerApiBaseUrl}/gate_prices`, {
        body: JSON.stringify({ ticker }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
    }).then(value => value.json())
    return response.price
}

export async function deriveEvmAddressFromOperations(base64str: string): Promise<string> {
    try {
        const operationPayload = await staticRpc.unpackFromCell({
            allowPartial: true,
            boc: base64str,
            structure: [
                { name: 'operation', type: 'uint8' },
                { name: 'recipient', type: 'address' },
                { name: 'payload', type: 'cell' },
            ] as const,
        })

        if (operationPayload.data.operation === TransitOperation.BurnToAlienProxy) {
            const callback = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: operationPayload.data.payload,
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'network', type: 'uint8' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })

            const burnPayload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: callback.data.payload,
                structure: [
                    { name: 'targetAddress', type: 'uint160' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            const payload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: burnPayload.data.callback.payload,
                structure: [
                    { name: 'recipient', type: 'uint256' },
                ] as const,
            })

            return `0x${BigNumber(payload.data.recipient).toString(16).padStart(40, '0')}`
        }
        if (operationPayload.data.operation === TransitOperation.BurnToMergePool) {
            const burnPayload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: operationPayload.data.payload,
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'burnType', type: 'uint8' },
                    { name: 'targetToken', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })

            const callback = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: burnPayload.data.payload,
                structure: [
                    { name: 'network', type: 'uint8' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })

            const payload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: callback.data.payload,
                structure: [
                    { name: 'targetAddress', type: 'uint160' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            return `0x${new BigNumber(payload.data.targetAddress).toString(16).padStart(40, '0')}`
        }
        if (operationPayload.data.operation === TransitOperation.TransferToNativeProxy) {
            const transferPayload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: operationPayload.data.payload,
                structure: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'network', type: 'uint8' },
                    { name: 'payload', type: 'cell' },
                ] as const,
            })

            const payload = await staticRpc.unpackFromCell({
                allowPartial: true,
                boc: transferPayload.data.payload,
                structure: [
                    { name: 'targetAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'cell' },
                            { name: 'strict', type: 'bool' },
                        ] as const,
                        name: 'callback',
                        type: 'tuple',
                    },
                ] as const,
            })

            return `0x${new BigNumber(payload.data.targetAddress).toString(16).padStart(40, '0')}`
        }

        return ''
    }
    catch (e) {
        error(e)
        return ''
    }
}

export type UnwrapPayloadRequest = {
    remainingGasTo: string
    destination: string
    amount: string
    payload?: string
}

type UnwrapResponse = {
    tokensTransferPayload: string
    sendTo: string
    everAmount: string
    tokenAmount: string
}

export async function getUnwrapPayload(
    unwrapConfig: UnwrapPayloadRequest,
    apiEndpoint: string = 'https://api.flatqube.io',
): Promise<UnwrapResponse> {
    return fetch(`${apiEndpoint}/v2/middleware`, {
        body: JSON.stringify({ input: { unwrapAll: unwrapConfig }}),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
    })
        .then(value => value.json())
        .then(value => value.output.unwrapAll)
}

type MiddlewareDecodePayloadForUnwrap = {
    amount: number
    decodedPayload: string | null
    destination: string
    payload: string
    remainingGasTo: string
}

export type MiddlewareDecodePayloadResponse = {
    payloadForUnwrap: MiddlewareDecodePayloadForUnwrap[]
    remainingGasTo: string
    remainingTokensTo: string
    tokensDistributionType: number
}

export async function middlewareDecodePayload(
    payload: string,
    apiEndpoint: string = 'https://api.flatqube.io',
): Promise<MiddlewareDecodePayloadResponse> {
    return fetch(`${apiEndpoint}/v2/middleware/decode_payload`, {
        body: JSON.stringify({ payload }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
    }).then(value => value.json())
}
