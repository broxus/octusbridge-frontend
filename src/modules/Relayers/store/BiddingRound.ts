import { makeAutoObservable, runInAction, toJS } from 'mobx'

import { BiddingRoundStoreData, BiddingRoundStoreState } from '@/modules/Relayers/types'
import { handleRoundInfo, handleRoundsCalendar } from '@/modules/Relayers/utils'
import { RelayersDataStore } from '@/modules/Relayers/store/RelayersData'
import { error } from '@/utils'
import { RelayConfig } from '@/misc'

export class BiddingRoundStore {

    protected state: BiddingRoundStoreState = {}

    protected data: BiddingRoundStoreData = {}

    protected readonly relayersData = new RelayersDataStore()

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(roundNum: number): Promise<void> {
        try {
            runInAction(() => {
                this.state.isLoading = true
            })

            const [result, lastRound] = await Promise.all([
                handleRoundsCalendar({
                    fromRoundNum: roundNum - 1,
                    toRoundNum: roundNum + 1,
                }),
                handleRoundInfo({}),
                this.relayersData.fetchRelayConfig(),
            ])

            runInAction(() => {
                this.data.roundsCalendar = result
                this.data.lastRound = lastRound
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

    public get isLoading(): boolean | undefined {
        return this.state.isLoading
    }

    public get roundNum(): number | undefined {
        const { roundsCalendar } = this.data

        if (!roundsCalendar || !roundsCalendar.length) {
            return undefined
        }

        const [current, next] = toJS(roundsCalendar)

        if (next?.roundNum) {
            return next.roundNum
        }

        if (current?.roundNum) {
            return current.roundNum + 1
        }

        return undefined
    }

    public get electionStartTime(): number | undefined {
        const { roundsCalendar } = this.data

        if (!roundsCalendar || !roundsCalendar.length) {
            return undefined
        }

        const [prev, current] = toJS(roundsCalendar)

        if (current?.electionStartTime) {
            return current.electionStartTime
        }

        const { relayConfig } = this.relayersData

        if (prev?.startTime && relayConfig) {
            return prev.startTime + (parseInt(relayConfig.timeBeforeElection, 10) * 1000)
        }

        return undefined
    }

    public get electionEndTime(): number | undefined {
        const { roundsCalendar } = this.data

        if (!roundsCalendar || !roundsCalendar.length) {
            return undefined
        }

        const [prev, current] = toJS(roundsCalendar)

        if (current?.electionEndTime) {
            return current.electionEndTime
        }

        const { relayConfig } = this.relayersData

        if (prev?.startTime && relayConfig) {
            return prev.startTime + (parseInt(relayConfig.timeBeforeElection, 10) * 1000)
                + (parseInt(relayConfig.electionTime, 10) * 1000)
        }

        return undefined
    }

    public get lastRoundNum(): number | undefined {
        if (!this.data.lastRound?.roundNum) {
            return undefined
        }

        return this.data.lastRound.roundNum + 1
    }

    public get relayConfig(): RelayConfig | undefined {
        return this.relayersData.relayConfig
    }

}
