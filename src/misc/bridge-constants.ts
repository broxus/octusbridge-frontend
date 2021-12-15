import BigNumber from 'bignumber.js'

import {
    CreditBody,
    CreditFactoryAddress,
    DaoRootContractAddress,
    DepositToFactoryMaxSlippage,
    DepositToFactoryMinSlippageDenominator,
    DepositToFactoryMinSlippageNumerator, EmptyWalletMinTonsAmount,
    HiddenBridgeStrategyFactory,
    HiddenBridgeStrategyGas,
    StakingAccountAddress,
    TokenAssetsURI,
    TokenListURI,
} from '@/config'

export class BridgeConstants {

    static CreditBody = CreditBody

    static EmptyWalletMinTonsAmount = EmptyWalletMinTonsAmount

    static CreditFactoryAddress = CreditFactoryAddress

    static DepositToFactoryMinSlippageNumerator = DepositToFactoryMinSlippageNumerator

    static DepositToFactoryMinSlippageDenominator = DepositToFactoryMinSlippageDenominator

    static DepositToFactoryMaxSlippage = DepositToFactoryMaxSlippage

    static DepositToFactoryMinSlippage = new BigNumber(DepositToFactoryMinSlippageNumerator)
        .div(DepositToFactoryMinSlippageDenominator).toFixed()

    static HiddenBridgeStrategyGas = HiddenBridgeStrategyGas

    static HiddenBridgeStrategyFactory = HiddenBridgeStrategyFactory

    static StakingAccountAddress = StakingAccountAddress

    static TokenAssetsURI = TokenAssetsURI

    static TokenListURI = TokenListURI

    static DaoRootContractAddress = DaoRootContractAddress

}
