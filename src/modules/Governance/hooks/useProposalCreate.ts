import * as React from 'react'

import { ProposalCreateStore } from '@/modules/Governance/stores'
import { useDaoConfig } from '@/modules/Governance/hooks/useDaoConfig'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useEverWallet } from '@/stores/EverWalletService'

export function useProposalCreate(): ProposalCreateStore {
    const ref = React.useRef<ProposalCreateStore>()
    ref.current = ref.current || new ProposalCreateStore(
        useEverWallet(),
        useUserData(),
        useDaoConfig(),
    )
    return ref.current
}
