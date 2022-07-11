import {
    Address,
    FullContractState,
    TransactionId,
} from 'everscale-inpage-provider'

import rpc from '@/hooks/useRpcClient'
import { TokenAbi } from '@/misc/abi'
import { debug, error } from '@/utils'
import type { EverscaleTokenData } from '@/models'

export type BalanceWalletRequest = {
    wallet: Address;
}

export type WalletAddressRequest = {
    root: Address;
    owner: Address;
}

export type TokenDetailsResponse = {
    decimals: number;
    rootOwnerAddress: Address;
    totalSupply: string;
}

function params<TRequired>(): <TOptional>(o: TOptional) => Partial<TOptional> & TRequired;
function params<TOptional>(o: TOptional): Partial<TOptional>;
function params<T>(o?: T): Partial<T> | (<TOptional>(o: TOptional) => Partial<TOptional> & T) {
    if (o != null) {
        return o
    }
    return ((oo: any) => oo) as any
}

export class TokenWallet {

    public static async walletAddress(args: WalletAddressRequest, state?: FullContractState): Promise<Address> {
        const rootContract = rpc.createContract(TokenAbi.Root, args.root)
        const { value0: tokenWallet } = await rootContract.methods.walletOf({
            answerId: 0,
            walletOwner: args.owner,
        }).call({ cachedState: state })

        debug(
            `%cToken Wallet%c Request wallet %c${args.owner.toString()}%c address
               In token: %c${args.root.toString()}%c
               Found: %c${tokenWallet.toString()}`,
            'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
            'color: #bae701',
        )

        return tokenWallet
    }

    public static async balance(
        args: BalanceWalletRequest | WalletAddressRequest,
        state?: FullContractState,
    ): Promise<string> {
        let { wallet } = (args as BalanceWalletRequest)

        if (wallet == null) {
            wallet = await this.walletAddress(args as WalletAddressRequest)
        }

        const tokenWalletContract = rpc.createContract(TokenAbi.Wallet, wallet)
        const { value0: balance } = await tokenWalletContract.methods.balance({
            answerId: 0,
        }).call({ cachedState: state })

        debug(
            `%cToken Wallet%c Request token wallet %c${wallet.toString()}%c balance
               Result: %c${balance}`,
            'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
            'color: #c5e4f3',
            'color: #bae701',
            'color: #c5e4f3',
            'color: #bae701',
        )

        return balance.toString()
    }

    public static async balanceByTokenRoot(ownerAddress: Address, tokenRootAddress: Address): Promise<string> {
        try {
            const walletAddress = await TokenWallet.walletAddress({
                owner: ownerAddress,
                root: tokenRootAddress,
            })
            return await TokenWallet.balance({
                wallet: walletAddress,
            })
        }
        catch (e) {
            error(e)
            return '0'
        }
    }

    public static async balanceByWalletAddress(walletAddress: Address): Promise<string> {
        try {
            return await TokenWallet.balance({
                wallet: walletAddress,
            })
        }
        catch (e) {
            error(e)
            return '0'
        }
    }

    public static async getDetails(root: Address, state?: FullContractState): Promise<TokenDetailsResponse> {
        const [decimals, rootOwnerAddress, totalSupply] = await Promise.all([
            TokenWallet.getDecimals(root, state),
            TokenWallet.rootOwnerAddress(root, state),
            TokenWallet.totalSupply(root, state),
        ])

        return {
            decimals,
            rootOwnerAddress,
            totalSupply,
        }
    }

    public static async getTokenFullDetails(root: string): Promise<Partial<EverscaleTokenData> | undefined> {
        const address = new Address(root)

        const { state } = await rpc.getFullContractState({ address })

        if (!state) {
            return undefined
        }

        if (state.isDeployed) {
            const [decimals, name, symbol, details] = await Promise.all([
                TokenWallet.getDecimals(address, state),
                TokenWallet.getName(address, state),
                TokenWallet.getSymbol(address, state),
                TokenWallet.getDetails(address, state),
            ])

            return {
                ...details,
                address,
                decimals,
                name,
                root,
                symbol,
            }
        }

        return undefined
    }

    public static async getDecimals(root: Address, state?: FullContractState): Promise<number> {
        const rootContract = rpc.createContract(TokenAbi.Root, root)
        const response = (await rootContract.methods.decimals({ answerId: 0 }).call(
            { cachedState: state },
        )).value0
        return parseInt(response, 10)
    }

    public static async getSymbol(root: Address, state?: FullContractState): Promise<string> {
        const rootContract = rpc.createContract(TokenAbi.Root, root)
        return (await rootContract.methods.symbol({ answerId: 0 }).call({
            cachedState: state,
            responsible: true,
        })).value0
    }

    public static async getName(root: Address, state?: FullContractState): Promise<string> {
        const rootContract = rpc.createContract(TokenAbi.Root, root)
        return (await rootContract.methods.name({ answerId: 0 }).call({
            cachedState: state,
            responsible: true,
        })).value0
    }

    public static async rootOwnerAddress(root: Address, state?: FullContractState): Promise<Address> {
        const rootContract = rpc.createContract(TokenAbi.Root, root)
        return (await rootContract.methods.rootOwner({ answerId: 0 }).call({
            cachedState: state,
            responsible: true,
        })).value0
    }

    public static async totalSupply(root: Address, state?: FullContractState): Promise<string> {
        const rootContract = rpc.createContract(TokenAbi.Root, root)
        return (await rootContract.methods.totalSupply({ answerId: 0 }).call({
            cachedState: state,
            responsible: true,
        })).value0
    }

    public static async send(args = params<{
        address: Address,
        recipient: Address,
        owner: Address,
        tokens: string,
    }>()({
        grams: '500000000',
        payload: '',
        withDerive: false,
        bounce: true,
    })): Promise<TransactionId> {
        let { address } = args

        if (args.withDerive) {
            address = await this.walletAddress({
                owner: args.owner,
                root: args.address,
            })
        }

        const tokenWalletContract = rpc.createContract(TokenAbi.Wallet, address)

        const { id } = await tokenWalletContract.methods.transferToWallet({
            amount: args.tokens,
            recipientTokenWallet: args.recipient,
            payload: args.payload || '',
            notify: true,
            remainingGasTo: args.owner,
        }).send({
            from: args.owner,
            bounce: args.bounce,
            amount: args.grams || '500000000',
        })

        return id
    }

}
