import * as React from 'react'

import { ProposalCreateStore, useUserData } from '@/modules/Governance/stores'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposalCreate(): ProposalCreateStore {
    const ref = React.useRef<ProposalCreateStore>()
    ref.current = ref.current || new ProposalCreateStore(
        useTonWallet(),
        useUserData(),
    )
    return ref.current
}
