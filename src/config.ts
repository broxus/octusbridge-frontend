import { NetworkShape } from '@/bridge'

export const networks: NetworkShape[] = [
    {
        chainId: '1',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        label: 'Ethereum Mainnet',
        name: 'Ethereum Mainnet',
        rpcUrl: '',
        type: 'evm',
    },
    {
        chainId: '56',
        currencySymbol: 'BNB',
        explorerBaseUrl: 'https://bcsscan.io/',
        label: 'Binance Smart Chain',
        name: 'Binance Smart Chain',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        type: 'evm',
    },
    {
        chainId: '250',
        currencySymbol: 'FTM',
        explorerBaseUrl: 'https://ftmscan.io/',
        label: 'Fantom Opera',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpc.ftm.tools/',
        type: 'evm',
    },
    {
        chainId: '137',
        currencySymbol: 'MATIC',
        explorerBaseUrl: 'https://polygonscan.io/',
        label: 'Polygon',
        name: 'Polygon',
        rpcUrl: 'https://rpc-mainnet.matic.network',
        type: 'evm',
    },
    {
        chainId: '3',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        label: 'Ropsten',
        name: 'Ropsten',
        rpcUrl: '',
        type: 'evm',
    },
    {
        chainId: '5',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        label: 'Goerli',
        name: 'Goerli',
        rpcUrl: '',
        type: 'evm',
    },
    {
        chainId: '1',
        currencySymbol: 'TON',
        explorerBaseUrl: 'https://tonscan.io/',
        label: 'Free TON',
        name: 'Free TON',
        rpcUrl: '',
        type: 'ton',
    },
]

export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/master/test.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/test.json'
