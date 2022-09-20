import BigNumber from 'bignumber.js'
import { AccountMeta, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'


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
