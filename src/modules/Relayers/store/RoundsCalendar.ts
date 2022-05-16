import { makeAutoObservable, runInAction } from 'mobx'

import { handleRoundsCalendar } from '@/modules/Relayers/utils'
import { RoundInfoStore } from '@/modules/Relayers/store/RoundInfo'
import { RoundCalendarValid, RoundsCalendarStoreData } from '@/modules/Relayers/types'
import { RelayersDataStore } from '@/modules/Relayers/store/RelayersData'
import { error } from '@/utils'

function time(value: string) {
    return parseInt(value, 10) * 1000
}

export class RoundsCalendarStore {

    protected data: RoundsCalendarStoreData = {}

    protected readonly lastRound = new RoundInfoStore()

    protected readonly relayersData = new RelayersDataStore()

    constructor() {
        makeAutoObservable(this)
    }

    public async fetchCurrent(): Promise<void> {
        try {
            await this.lastRound.fetch({})

            if (this.lastRound.info?.roundNum) {
                await this.fetchRound(this.lastRound.info.roundNum)
            }
            else {
                throw new Error('RoundNum must be defined in current round')
            }
        }
        catch (e) {
            error(e)
        }
    }

    public async fetchRound(roundNum: number): Promise<void> {
        try {
            const _roundNum = roundNum < 0 ? 0 : roundNum

            const [result] = await Promise.all([
                handleRoundsCalendar({
                    fromRoundNum: _roundNum,
                    toRoundNum: _roundNum + 2,
                }),
                this.relayersData.fetchRelayConfig(),
            ])

            runInAction(() => {
                this.data.roundsCalendar = result
            })
        }
        catch (e) {
            error(e)
        }
    }

    public get rounds(): RoundCalendarValid[] | undefined {
        const { roundsCalendar } = this.data
        const { relayConfig } = this.relayersData

        if (!roundsCalendar || !relayConfig) {
            return undefined
        }

        let current: RoundCalendarValid | undefined,
            next: RoundCalendarValid | undefined

        if (roundsCalendar[1] && roundsCalendar[1].endTime && roundsCalendar[1].startTime) {
            next = {
                roundNum: roundsCalendar[1].roundNum,
                startTime: roundsCalendar[1].startTime,
                endTime: roundsCalendar[1].endTime,
                electionStartTime: roundsCalendar[1].electionStartTime,
                electionEndTime: roundsCalendar[1].electionEndTime,
            }
        }

        if (roundsCalendar[0] && roundsCalendar[0].endTime && roundsCalendar[0].startTime) {
            current = {
                roundNum: roundsCalendar[0].roundNum,
                startTime: roundsCalendar[0].startTime,
                endTime: roundsCalendar[0].endTime,
                electionStartTime: roundsCalendar[0].electionStartTime,
                electionEndTime: roundsCalendar[0].electionEndTime,
            }
        }

        if (!next && current) {
            next = {
                roundNum: current.roundNum + 1,
                startTime: current.endTime,
                endTime: current.endTime + time(relayConfig.relayRoundTime),
                electionStartTime: current.startTime + time(relayConfig.timeBeforeElection),
                electionEndTime: current.startTime + time(relayConfig.timeBeforeElection)
                    + time(relayConfig.electionTime),
            }
        }

        if (current && next) {
            return [current, next]
        }

        return undefined
    }

}
