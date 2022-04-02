// @ts-nocheck
/* eslint-disable */

import { makeAutoObservable } from 'mobx'

import { Status } from '@/modules/Relayers/types'

export class RelayerStore {

    constructor() {
        makeAutoObservable(this)
    }

    public async fetch(address: string) {

    }

    public get address(): string | undefined {
        return '0:ef8635871613be03181667d967fceda1b4a1d98e6811552d2c31adfc2cbcf9b1'
    }

    public get status(): Status | undefined {
        return 'slashed'
    }

    public get slashedProposalId(): number | undefined {
        return 123
    }

    public get rank(): number | undefined {
        return 18
    }

    public get explorerLink(): string | undefined {
        return 'https://everscan.io/accounts/0:ce3f2b748de60355ba885dd88614c61f8698806cd05a66dc349de43b9b60f259'
    }

    public get isAdmin(): boolean | undefined {
        return true
    }

    public get isStakeBalanceLow(): boolean | undefined {
        return true
    }

    public get stakeTokenDecimals(): number | undefined {
        return 9
    }

    public get frozenStake(): string | undefined {
        return '123550000000'
    }

    public get defrostTime(): number | undefined {
        return new Date().getTime() +  88440000
    }

    public get latestReward(): string | undefined {
        return '103550000000'
    }

    public get totalReward(): string | undefined {
        return '3003550000000'
    }

    public get successRounds(): number | undefined {
        return 34
    }

    public get totalRounds(): number | undefined {
        return 99
    }

    public get successRoundsRate(): string | undefined {
        return '12.54'
    }

    public get dayEvents(): number | undefined {
        return 113025
    }

}
