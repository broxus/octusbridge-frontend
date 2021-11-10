import { AddressLiteral } from 'ton-inpage-provider'

import { NetworkShape } from '@/types'


export const networks: NetworkShape[] = [
    {
        chainId: '1',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        id: 'evm-1',
        label: 'Ethereum',
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
        transactionType: '0x02',
        type: 'evm',
    },
    {
        chainId: '56',
        currencySymbol: 'BNB',
        explorerBaseUrl: 'https://bscscan.com/',
        id: 'evm-56',
        label: 'Binance Smart Chain',
        name: 'BSC',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        transactionType: '0x00',
        type: 'evm',
    },
    {
        chainId: '250',
        currencySymbol: 'FTM',
        explorerBaseUrl: 'https://ftmscan.com/',
        id: 'evm-250',
        label: 'Fantom Opera',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpc.ftm.tools/',
        transactionType: '0x00',
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
        transactionType: '0x00',
        type: 'evm',
    },
    {
        chainId: '1',
        currencySymbol: 'TON',
        explorerBaseUrl: 'https://tonscan.io/',
        id: 'ton-1',
        label: 'Free TON',
        name: 'Free TON',
        rpcUrl: '',
        type: 'ton',
    },
]

export const CreditBody = '5000000000'

export const EmptyWalletMinTonsAmount = '10000000000'

export const CreditFactoryAddress = new AddressLiteral('0:92190de9b79fe5640b9449aff336cf33e6270075b26fdce9f3d9be520043608a')

export const DepositToFactoryAddress = '0x92190de9b79fe5640b9449aff336cf33e6270075b26fdce9f3d9be520043608a'

export const DepositToFactoryMaxSlippage = 10

export const DepositToFactoryMinSlippageNumerator = '1'

export const DepositToFactoryMinSlippageDenominator = '100'

export const GazToStaking = '11500000000'

export const RelayEvmNetworkChainId = '1'

export const StakingAccountAddress = '0:7727ca13859ee381892ee6a0435165d36053188900550cdb02b93ea6bc81c075'

export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/master/main.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json'

export const Web3Url = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'


// export const networks: NetworkShape[] = [
//     {
//         chainId: '3',
//         currencySymbol: 'ETH',
//         explorerBaseUrl: 'https://ropsten.etherscan.io/',
//         id: 'evm-1',
//         label: 'Ropsten',
//         name: 'Ropsten',
//         rpcUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
//         type: 'evm',
//     },
//     {
//         chainId: '5',
//         currencySymbol: 'ETH',
//         explorerBaseUrl: 'https://goerli.etherscan.io/',
//         id: 'evm-5',
//         label: 'Goerli',
//         name: 'Goerli',
//         rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
//         type: 'evm',
//     },
//     {
//         chainId: '1',
//         currencySymbol: 'TON',
//         explorerBaseUrl: 'https://tonscan.io/',
//         id: 'ton-1',
//         label: 'Free TON',
//         name: 'Free TON',
//         rpcUrl: '',
//         type: 'ton',
//     },
// ]
//
// export const CreditBody = '5000000000'
//
// export const CreditFactoryAddress = new AddressLiteral('0:d51a53b4e50e4c0cd8c56554274f7367dcc3aa901e9b351881f2729b3b726d93')
//
// export const DepositToFactoryAddress = '0xd51a53b4e50e4c0cd8c56554274f7367dcc3aa901e9b351881f2729b3b726d93'
//
// export const DepositToFactoryMaxSlippage = 10
//
// export const DepositToFactoryMinSlippage = 5
//
// export const GazToStaking = '55000000000'
//
// export const RelayEvmNetworkChainId = '5'
//
// // todo: to AddressLiteral
// export const StakingAccountAddress = '0:6fdaa8f199d372c9f1ec8b3b20bc0e5ef72df412dd25f1d6ee8eb9db1e39fadc'
//
// export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/master/test.json'
//
// export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/test.json'
//
// export const Web3Url = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
