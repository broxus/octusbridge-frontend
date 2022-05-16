import { makeAutoObservable, runInAction } from 'mobx'

import { handleRoundInfo, handleRoundsCalendar } from '@/modules/Relayers/utils'
import { RoundCalendar, ValidationRoundStoreData, ValidationRoundStoreState } from '@/modules/Relayers/types'
import { error } from '@/utils'

export class ValidationRoundStore {

    protected data: ValidationRoundStoreData = {}

    protected state: ValidationRoundStoreState = {}

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(roundNum: number): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const [roundCalendar] = await handleRoundsCalendar({
                fromRoundNum: roundNum,
                toRoundNum: roundNum + 1,
            })
            const lastRound = await handleRoundInfo({})

            runInAction(() => {
                this.data.roundCalendar = roundCalendar
                this.data.lastRoundNum = lastRound.roundNum
            })
        }
        catch (e) {
            error(e)
        }
        finally {
            runInAction(() => {
                this.state.isLoading = false
            })
        }
    }

    public get lastRoundNum(): number | undefined {
        return this.data.lastRoundNum
    }

    public get roundCalendar(): RoundCalendar | undefined {
        return this.data.roundCalendar
    }

    public get isLoading(): boolean | undefined {
        return this.state.isLoading
    }

}
