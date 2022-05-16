import { action, makeAutoObservable, runInAction } from 'mobx'

import { RoundInfoListStoreData } from '@/modules/Relayers/types'
import { RoundInfoStore } from '@/modules/Relayers/store/RoundInfo'
import { RelayRoundInfoStore } from '@/modules/Relayers/store/RelayRoundInfo'
import { error } from '@/utils'

export class RoundInfoListStore {

    protected data: RoundInfoListStoreData = {}

    public readonly roundInfo = new RoundInfoStore()

    public readonly relayRoundInfo = new RelayRoundInfoStore()

    public readonly relayAddress?: string = undefined

    constructor(relayAddress?: string) {
        makeAutoObservable(this, {
            current: action.bound,
            select: action.bound,
        })

        this.relayAddress = relayAddress
    }

    public async current(): Promise<void> {
        try {
            await this.roundInfo.fetch({})

            if (this.relayAddress) {
                await this.relayRoundInfo.fetch({
                    relayAddress: this.relayAddress,
                })
            }

            runInAction(() => {
                this.data.currentRoundNum = this.roundInfo.info?.roundNum
            })
        }
        catch (e) {
            error(e)
        }
    }

    public async select(roundNum: number): Promise<void> {
        try {
            await this.roundInfo.fetch({
                roundNum,
            })

            if (this.relayAddress) {
                await this.relayRoundInfo.fetch({
                    roundNum,
                    relayAddress: this.relayAddress,
                })
            }
        }
        catch (e) {
            error(e)
        }
    }

    public get currentRoundNum(): number | undefined {
        return this.data.currentRoundNum
    }

}
