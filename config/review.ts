import { AddressLiteral } from 'everscale-inpage-provider'

import { NetworkShape } from '@/types'


export const networks: NetworkShape[] = [
    {
        chainId: '1',
        currencySymbol: 'EVER',
        explorerBaseUrl: 'https://everscan.io/',
        id: 'everscale-1',
        label: 'Everscale',
        name: 'Everscale',
        rpcUrl: '',
        type: 'everscale',
    },
    {
        chainId: '1',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        id: 'evm-1',
        label: 'Ethereum',
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        transactionType: '0x2',
        type: 'evm',
    },
    {
        chainId: '56',
        currencySymbol: 'BNB',
        explorerBaseUrl: 'https://bscscan.com/',
        id: 'evm-56',
        label: 'BNB Chain (Binance Smart Chain)',
        name: 'BNB Chain',
        rpcUrl: 'https://rpc.ankr.com/bsc/',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '250',
        currencySymbol: 'FTM',
        explorerBaseUrl: 'https://ftmscan.com/',
        id: 'evm-250',
        label: 'Fantom Opera',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpc.ankr.com/fantom/',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '137',
        currencySymbol: 'MATIC',
        explorerBaseUrl: 'https://polygonscan.com/',
        id: 'evm-137',
        label: 'Polygon',
        name: 'Polygon',
        rpcUrl: 'https://matic-mainnet.chainstacklabs.com/',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '43114',
        currencySymbol: 'AVAX',
        explorerBaseUrl: 'https://snowtrace.io/',
        id: 'evm-43114',
        label: 'Avalanche',
        name: 'Avalanche Network',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        type: 'evm',
    },
    {
        chainId: '2001',
        currencySymbol: 'mADA',
        explorerBaseUrl: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com/',
        id: 'evm-2001',
        label: 'Milkomeda',
        name: 'Milkomeda C1 Mainnet',
        rpcUrl: 'https://rpc-mainnet-cardano-evm.c1.milkomeda.com',
        type: 'evm',
    },
    {
        badge: 'Soon',
        chainId: '1',
        currencySymbol: 'SOL',
        disabled: true,
        explorerBaseUrl: '',
        id: 'solana-1',
        label: 'Solana',
        name: 'Solana',
        rpcUrl: '',
        type: 'solana',
    },
]


export const AirdropContractAddress = new AddressLiteral('0:b321058503889a78fe0954cfb67564b218cff1eac1467dc48e4c80118dd6719f')

export const DexRootAddress = new AddressLiteral('0:5eb5713ea9b4a0f3a13bc91b282cde809636eb1e68d2fcb6427b9ad78a5a9008')

export const WEVERRootAddress = new AddressLiteral('0:a49cd4e158a9a15555e624759e2e4e766d22600b7800d891e46f9291f044a93d')

export const CreditBody = '5800000000'

export const EmptyWalletMinEversAmount = '10000000000'

export const CreditFactoryAddress = new AddressLiteral('0:5ae128e08b2c17428629e092c1a7bd5c77a83a27fa3b833a31c2eb3d704d7f68')

export const DepositToFactoryMaxSlippage = 10

export const DepositToFactoryMinSlippageNumerator = '1'

export const DepositToFactoryMinSlippageDenominator = '100'

export const GasToStaking = '11500000000'

export const GasToCastVote = '11500000000'

export const MinGasToUnlockCastedVotes = '11000000000'

export const GasToUnlockCastedVote = '200000000'

export const HiddenBridgeStrategyGas = '2500000000'

export const HiddenBridgeStrategyFactory = new AddressLiteral('0:18e1dfffa7c13122c993c94b205b68905c14b77ce03d3cbcb1fd6f52664fbf2d')

export const RelayEvmNetworkChainId = '1'

export const StakingAccountAddress = new AddressLiteral('0:ec6a2fd6c3732e494684d016f1addec1a1828b6b7ecfcd30b34e8e5ad2d421d0')

export const DaoRootContractAddress = new AddressLiteral('0:6da8defd136c0227dfa24edde79728142d2bfb74bc9edf66ad86ae7cd8e56a86')

export const AlienTokenListURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/multitoken-1/tokenlist/common.json'

export const BridgeAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/multitoken-1/tokenlist/octus.json'

export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/multitoken-1/main.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json'

export const UpgradeTokenListURI = 'https://raw.githubusercontent.com/broxus/everscale-assets-upgrade/master/main.json'

export const Web3Url = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'

export const IndexerApiBaseUrl = 'https://api.octusbridge.io/v1'

export const DaoIndexerApiBaseUrl = 'https://dao.octusbridge.io/v1'

export const TonSwapIndexerApiBaseUrl = 'https://api.flatqube.io/v1'
