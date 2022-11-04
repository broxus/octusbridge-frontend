import * as React from 'react'

import { DaoConfigStore, ProposalCreateStore, UserDataStore } from '@/modules/Governance/stores'
import { EverWalletService } from '@/stores/EverWalletService'

export function useProposalCreate(
    wallet: EverWalletService,
    userData: UserDataStore,
    daoConfig: DaoConfigStore,
): ProposalCreateStore {
    const ref = React.useRef<ProposalCreateStore>()
    ref.current = ref.current || new ProposalCreateStore(wallet, userData, daoConfig)
    return ref.current
}
