import ton, {
    Address,
    Contract,
    FullContractState,
} from 'everscale-inpage-provider'

import { DexAbi } from '@/misc/abi'
import { DexConstants } from '@/misc/dex-constants'
import { debug } from '@/utils'


export type PairTokenRoots = {
    left: Address;
    right: Address;
}

export type PairBalances = {
    left: string;
    right: string;
}


export class Dex {

    public static async checkPair(leftAddress: Address, rightAddress: Address): Promise<Address | undefined> {
        const pairAddress = await Dex.pairAddress(leftAddress, rightAddress)
        const pairState = await ton.getFullContractState({
            address: pairAddress,
        })

        if (!pairState.state?.isDeployed) {
            if (process.env.NODE_ENV === 'development') {
                debug(
                    `%cTON Provider%c Check Pair: %c${pairAddress?.toString()}%c is%c not deployed`,
                    'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                    'color: #c5e4f3',
                    'color: #bae701',
                    'color: #c5e4f3',
                    'color: #defefe',
                )
            }

            return undefined
        }

        if (!await Dex.pairIsActive(pairAddress)) {
            return undefined
        }

        if (process.env.NODE_ENV === 'development') {
            debug(
                `%cTON Provider%c Check Pair: Found one: %c${pairAddress?.toString()}`,
                'font-weight: bold; background: #4a5772; color: #fff; border-radius: 2px; padding: 3px 6.5px',
                'color: #c5e4f3',
                'color: #bae701',
            )
        }

        return pairAddress
    }

    public static async pairAddress(
        leftAddress: Address,
        rightAddress: Address,
        state?: FullContractState,
    ): Promise<Address> {
        const rootContract = new Contract(DexAbi.Root, DexConstants.DexRootAddress)
        const {
            value0: pairAddress,
        } = await rootContract.methods.getExpectedPairAddress({
            _answer_id: 0,
            left_root: leftAddress,
            right_root: rightAddress,
        }).call({ cachedState: state })
        return pairAddress
    }

    public static async pairIsActive(pairAddress: Address, state?: FullContractState): Promise<boolean> {
        const pairContract = new Contract(DexAbi.Pair, pairAddress)
        const {
            value0: isActive,
        } = await pairContract.methods.isActive({
            _answer_id: 0,
        }).call({ cachedState: state })
        return isActive
    }

    public static async pairTokenRoots(pairAddress: Address, state?: FullContractState): Promise<PairTokenRoots> {
        const pairContract = new Contract(DexAbi.Pair, pairAddress)
        const { left, right } = await pairContract.methods.getTokenRoots({
            _answer_id: 0,
        }).call({ cachedState: state })
        return { left, right }
    }

    public static async pairBalances(pairAddress: Address, state?: FullContractState): Promise<PairBalances> {
        const pairContract = new Contract(DexAbi.Pair, pairAddress)
        const {
            value0: {
                left_balance: left,
                right_balance: right,
            },
        } = await pairContract.methods.getBalances({
            _answer_id: 0,
        }).call({ cachedState: state })

        return {
            left: left.toString(),
            right: right.toString(),
        }
    }

}
