import BigNumber from 'bignumber.js'
import { type AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { IndexerApiBaseUrl } from '@/config'
import { DexConstants } from '@/misc'

export function unshiftedAmountWithSlippage(amount: BigNumber, slippage: number | string): BigNumber {
    return amount.times(100)
        .div(new BigNumber(100).minus(slippage))
        .shiftedBy(DexConstants.CoinDecimals)
        .dp(0, BigNumber.ROUND_UP)
}

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
)

export async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey,
): Promise<PublicKey> {
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    ))[0]
}

export function accountMetaFromRust(meta: any): AccountMeta {
    return {
        pubkey: new PublicKey(meta.pubkey),
        isSigner: meta.is_signer,
        isWritable: meta.is_writable,
    }
}

export function ixFromRust(data: any): TransactionInstruction {
    const keys: Array<AccountMeta> = data.accounts.map(accountMetaFromRust)
    return new TransactionInstruction({
        programId: new PublicKey(data.program_id),
        data: Buffer.from(data.data),
        keys,
    })
}

export type Tickers = 'ETH' | 'BNB' | 'FTM' | 'MATIC' | 'AVAX'

export async function getPrice(ticker: Tickers): Promise<{ ticker: Tickers, price: string }> {
    return fetch(`${IndexerApiBaseUrl}/gate_prices`, {
        body: JSON.stringify({ ticker }),
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(value => value.json())
}

export type UnwrapPayloadRequest = {
    remainingGasTo: string;
    destination: string;
    amount: string;
    payload?: string;
};

type UnwrapResponse = {
    tokensTransferPayload: string;
    sendTo: string;
    everAmount: string;
    tokenAmount: string;
};

export async function getUnwrapPayload(
    unwrapConfig: UnwrapPayloadRequest,
    apiEndpoint: string = 'https://api.flatqube.io',
): Promise<UnwrapResponse> {
    return fetch(`${apiEndpoint}/v2/middleware`, {
        body: JSON.stringify({ input: { unwrapAll: unwrapConfig }}),
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(value => value.json()).then(value => value.output.unwrapAll)
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
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(value => value.json())
}
