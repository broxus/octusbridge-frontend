import BigNumber from 'bignumber.js'

import {
    CreditBody,
    CreditFactoryAddress,
    DepositToFactoryAddress,
    DepositToFactoryMaxSlippage,
    DepositToFactoryMinSlippageDenominator,
    DepositToFactoryMinSlippageNumerator,
    EmptyWalletMinTonsAmount,
    StakingAccountAddress,
    TokenAssetsURI,
    TokenListURI,
} from '@/config'

export class BridgeConstants {

    static CreditBody = CreditBody

    static EmptyWalletMinTonsAmount = EmptyWalletMinTonsAmount

    static CreditFactoryAddress = CreditFactoryAddress

    static DepositToFactoryAddress = DepositToFactoryAddress

    static DepositToFactoryMinSlippageNumerator = DepositToFactoryMinSlippageNumerator

    static DepositToFactoryMinSlippageDenominator = DepositToFactoryMinSlippageDenominator

    static DepositToFactoryMaxSlippage = DepositToFactoryMaxSlippage

    // eslint-disable-next-line max-len
    static DepositToFactoryMinSlippage = new BigNumber(DepositToFactoryMinSlippageNumerator).div(DepositToFactoryMinSlippageDenominator).toFixed()

    static StakingAccountAddress = StakingAccountAddress

    static TokenAssetsURI = TokenAssetsURI

    static TokenListURI = TokenListURI

}
