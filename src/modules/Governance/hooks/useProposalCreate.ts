import * as React from 'react'

import { ProposalCreateStore } from '@/modules/Governance/stores'
import { useDaoConfig } from '@/modules/Governance/hooks/useDaoConfig'
import { useUserData } from '@/modules/Governance/hooks/useUserData'
import { useTonWallet } from '@/stores/TonWalletService'

export function useProposalCreate(): ProposalCreateStore {
    const ref = React.useRef<ProposalCreateStore>()
    ref.current = ref.current || new ProposalCreateStore(
        useTonWallet(),
        useUserData(),
        useDaoConfig(),
    )
    return ref.current
}
