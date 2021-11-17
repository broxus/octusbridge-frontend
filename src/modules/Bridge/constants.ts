import BigNumber from 'bignumber.js'


import { BridgeConstants, DexConstants } from '@/misc'
import {
    CrosschainBridgeStep,
    CrosschainBridgeStoreData,
    CrosschainBridgeStoreState,
    TransferSummaryData,
} from '@/modules/Bridge/types'


export const creditBody = new BigNumber(BridgeConstants.CreditBody).shiftedBy(-DexConstants.TONDecimals)
// FIXME брать это из CreditFactory.getDetails.fee
export const fee = new BigNumber('0.1')
export const debt = creditBody.plus(fee)
export const emptyWalletMinTonsAmount = new BigNumber(
    BridgeConstants.EmptyWalletMinTonsAmount,
).shiftedBy(-DexConstants.TONDecimals)
export const maxSlippage = BridgeConstants.DepositToFactoryMaxSlippage
export const minSlippage = BridgeConstants.DepositToFactoryMinSlippage


export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_DATA: CrosschainBridgeStoreData = {
    amount: '',
    depositType: 'default',
    leftAddress: '',
    rightAddress: '',
    swapType: '0',
    tokensAmount: '',
    tonsAmount: '',
}

export const DEFAULT_CROSSCHAIN_BRIDGE_STORE_STATE: CrosschainBridgeStoreState = {
    approvalStrategy: 'infinity',
    isSwapEnabled: false,
    isPendingAllowance: false,
    isPendingApproval: false,
    isProcessing: false,
    step: CrosschainBridgeStep.SELECT_ROUTE,
}

export const DEFAULT_TRANSFER_SUMMARY_STORE_DATA: TransferSummaryData = {
    amount: '',
    leftAddress: '',
    rightAddress: '',
}
