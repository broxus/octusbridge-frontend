import { AddressLiteral } from 'everscale-inpage-provider'

import { type NetworkShape } from '@/types'

export const networks: NetworkShape[] = [
    {
        chainId: '42',
        currencySymbol: 'EVER',
        explorerBaseUrl: 'https://everscan.io/',
        id: 'tvm-42',
        label: 'Everscale',
        name: 'Everscale',
        rpcUrl: '',
        type: 'tvm',
    },
    {
        chainId: '1',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        explorerLabel: 'Etherscan',
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
        explorerLabel: 'BscScan',
        id: 'evm-56',
        label: 'BSC',
        name: 'Binance Smart Chain',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '250',
        currencySymbol: 'FTM',
        explorerBaseUrl: 'https://ftmscan.com/',
        explorerLabel: 'FTMScan',
        id: 'evm-250',
        label: 'Fantom Opera',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpcapi.fantom.network',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        badge: 'Soon',
        chainId: '8217',
        currencySymbol: 'KLAY',
        disabled: true,
        explorerBaseUrl: 'https://scope.klaytn.com/',
        explorerLabel: 'Klaytn Scope',
        id: 'evm-8217',
        label: 'Klaytn',
        name: 'Klaytn Mainnet Cypress',
        rpcUrl: 'https://klaytn.blockpi.network/v1/rpc/public',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '137',
        currencySymbol: 'MATIC',
        explorerBaseUrl: 'https://polygonscan.com/',
        explorerLabel: 'PolygonScan',
        id: 'evm-137',
        label: 'Polygon',
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com/',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '43114',
        currencySymbol: 'AVAX',
        explorerBaseUrl: 'https://snowtrace.io/',
        explorerLabel: 'SnowTrace',
        id: 'evm-43114',
        label: 'Avalanche',
        name: 'Avalanche Network',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        type: 'evm',
    },
    {
        chainId: '1',
        currencySymbol: 'SOL',
        explorerBaseUrl: 'https://solscan.io/',
        explorerLabel: 'Solscan',
        id: 'solana-1',
        label: 'Solana',
        name: 'Solana',
        rpcUrl: 'https://solana-mainnet.g.alchemy.com/v2/nC7pcn16LDUJTPPMN2chpuAXorAc7jNB',
        type: 'solana',
    },
]

export const DexRootAddress = new AddressLiteral('0:5eb5713ea9b4a0f3a13bc91b282cde809636eb1e68d2fcb6427b9ad78a5a9008')

export const WEVERVaultAddress = new AddressLiteral('0:557957cba74ab1dc544b4081be81f1208ad73997d74ab3b72d95864a41b779a4',)

export const WEVERRootAddress = new AddressLiteral('0:a49cd4e158a9a15555e624759e2e4e766d22600b7800d891e46f9291f044a93d')

export const WEVEREvmRoots = [
    '0x1ffEFD8036409Cb6d652bd610DE465933b226917', // 1, 56, 137, 250, 43114
]

export const Compounder = new AddressLiteral('0:8707c99c2e4a98642ba29a9d389656e804bd5b3cbe11a426ca12335792168d8a')

export const EventClosers = [
    new AddressLiteral('0:07abe0b552242744ef7efb200a021bd2d86662b8c3e0a5bef126d439c89f37f8'),
    new AddressLiteral('0:7cc9d475a9c947120cb7b098f32275ec085a48655d39a4857f8d18b85ea9d57b'),
]

export const Mediator = new AddressLiteral('0:fc0794367a1597b988aeaa23f405aa305fcda8b6d7f17f89a600f492372b9df7')

export const DexMiddleware = new AddressLiteral('0:7ab8004fe2941a5793447cf28c86237a3f43827a15de399a2eb315215632eb28')

export const Unwrapper = '0xa5cf4c57a7756943559B6B65f6cC67Aa834F79F5'

export const EverSafeAmount = '10000000000'

export const GasToStaking = '11500000000'

export const GasToCastVote = '11500000000'

export const MinGasToUnlockCastedVotes = '11000000000'

export const GasToUnlockCastedVote = '200000000'

export const RelayEvmNetworkChainId = '1'

export const StakingAccountAddress = new AddressLiteral(
    '0:ec6a2fd6c3732e494684d016f1addec1a1828b6b7ecfcd30b34e8e5ad2d421d0',
)

export const DaoRootContractAddress = new AddressLiteral(
    '0:6da8defd136c0227dfa24edde79728142d2bfb74bc9edf66ad86ae7cd8e56a86',
)

export const AlienTokenListURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/multitoken-5/tokenlist/common.json'

export const BridgeAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/multitoken-5/main.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json'

export const UpgradeTokenListURI = 'https://raw.githubusercontent.com/broxus/everscale-assets-upgrade/master/main.json'

export const Web3Url = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'

export const IndexerApiBaseUrl = 'https://api.octusbridge.io/v1'

export const DaoIndexerApiBaseUrl = 'https://dao.octusbridge.io/v1'

export const DexIndexerApiBaseUrl = 'https://api.flatqube.io/v1'

export const CurrenciesListURI = '/assets/currencies.json'

export const WalletConnectProjectId = 'ec260171b28013443ebb9472c9560543'
