import * as React from 'react'

import {
    useAccountData, useClaimFormStore, useRedeemForm, useStakingForm,
} from '@/modules/Staking/hooks'
import {
    AccountDataStore, ClaimFormStore, RedeemFormStore, StakingFormStore,
} from '@/modules/Staking/stores'

type CurrentUser = {
    accountData: AccountDataStore;
    stakingForm: StakingFormStore;
    redeemForm: RedeemFormStore;
    claimForm: ClaimFormStore;
}

export const CurrentUserContext = React.createContext<CurrentUser | undefined>(undefined)

export function useCurrentUserContext(): CurrentUser {
    const currentUserContext = React.useContext(CurrentUserContext)

    if (!currentUserContext) {
        throw new Error('CurrentUserContext must be defined')
    }

    return currentUserContext
}

type Props = {
    children: React.ReactNode;
}

export function CurrentUserProvider({
    children,
}: Props): JSX.Element {
    const accountData = useAccountData()
    const stakingForm = useStakingForm(accountData)
    const redeemForm = useRedeemForm(accountData)
    const claimForm = useClaimFormStore(accountData)

    React.useEffect(() => {
        accountData.init()

        return () => {
            accountData.dispose()
        }
    }, [])

    return (
        <CurrentUserContext.Provider
            value={{
                accountData,
                stakingForm,
                redeemForm,
                claimForm,
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    )
}
