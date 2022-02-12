import { AddressLiteral } from 'everscale-inpage-provider'

import { NetworkShape } from '@/types'


export const networks: NetworkShape[] = [
    {
        chainId: '5',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://goerli.etherscan.io/',
        id: 'evm-5',
        label: 'Goerli',
        name: 'Ethereum Testnet Goerli',
        rpcUrl: 'https://goerli.infura.io/v3/f3ca4333bf4a41308d0a277ae1c09336',
        transactionType: '0x2',
        type: 'evm',
    },
    {
        chainId: '1',
        currencySymbol: 'TON',
        explorerBaseUrl: 'https://tonscan.io/',
        id: 'ton-1',
        label: 'Everscale',
        name: 'Everscale',
        rpcUrl: '',
        type: 'ton',
    },
]

export const AirdropContractAddress = new AddressLiteral('0:b321058503889a78fe0954cfb67564b218cff1eac1467dc48e4c80118dd6719f')

export const CreditBody = '5800000000'

export const EmptyWalletMinTonsAmount = '10000000000'

export const CreditFactoryAddress = new AddressLiteral('0:48b1daf7ff5c10ec590628e65702dcd01d947b36660a6348e5360f92c8b7bae5')

export const DepositToFactoryMaxSlippage = 10

export const DepositToFactoryMinSlippageNumerator = '1'

export const DepositToFactoryMinSlippageDenominator = '100'

export const GasToStaking = '11500000000'

export const GasToCastVote = '11500000000'

export const MinGasToUnlockCastedVotes = '11000000000'

export const GasToUnlockCastedVote = '200000000'

export const HiddenBridgeStrategyGas = '2500000000'

export const HiddenBridgeStrategyFactory = new AddressLiteral('0:0a6655e74d9f92ce088cbb68659d3d8a2aa1bc546899d42abf46cc16132cd591')

export const RelayEvmNetworkChainId = '1'

export const StakingAccountAddress = new AddressLiteral('0:4465015903ea512bea517492aa5036620505d26e0ef6942f446e2df4e038ee49')

export const DaoRootContractAddress = new AddressLiteral('0:3c7a7ea44b60ea62822c40ecd6d2766b938180f63fc28da9c4f6dc89dc034199')

export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/migration-1/test.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/migration-1/test.json'

export const Web3Url = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'

export const IndexerApiBaseUrl = 'https://bridge-indexer.broxus.com/v1'

export const DaoIndexerApiBaseUrl = 'https://bridge-dao-indexer.broxus.com/v1'
