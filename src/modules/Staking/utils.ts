import { Address, Contract } from 'ton-inpage-provider'

import { BridgeConstants, StackingAbi, StackingContract } from '@/misc'

export function getStackingContract(): StackingContract {
    return new Contract(StackingAbi.Root, new Address(BridgeConstants.StakingAccountAddress))
}
