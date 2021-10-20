import { Address, Contract } from 'ton-inpage-provider'

import { StackingContract } from '@/modules/Staking/types'
import { BridgeConstants, StackingAbi } from '@/misc'

export function getStackingContract(): StackingContract {
    return new Contract(StackingAbi.Root, new Address(BridgeConstants.StakingAccountAddress))
}
