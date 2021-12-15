import * as React from 'react'

import { ProposalCreateStore } from '@/modules/Governance/stores'
import { useTonWallet } from '@/stores/TonWalletService'
import { useTokensCache } from '@/stores/TokensCacheService'

export function useProposalCreate(): ProposalCreateStore {
    const ref = React.useRef<ProposalCreateStore>()
    ref.current = ref.current || new ProposalCreateStore(
        useTonWallet(),
        useTokensCache(),
    )
    return ref.current
}
