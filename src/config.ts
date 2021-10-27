import { NetworkShape } from '@/bridge'

export const networks: NetworkShape[] = [
    {
        chainId: '1',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://etherscan.io/',
        id: 'evm-1',
        label: 'Ethereum',
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
        type: 'evm',
    },
    {
        chainId: '56',
        currencySymbol: 'BNB',
        explorerBaseUrl: 'https://bcsscan.io/',
        id: 'evm-56',
        label: 'Binance Smart Chain',
        name: 'BSC',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        type: 'evm',
    },
    {
        chainId: '250',
        currencySymbol: 'FTM',
        explorerBaseUrl: 'https://ftmscan.io/',
        id: 'evm-250',
        label: 'Fantom Opera',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpc.ftm.tools/',
        type: 'evm',
    },
    {
        chainId: '137',
        currencySymbol: 'MATIC',
        explorerBaseUrl: 'https://polygonscan.io/',
        id: 'evm-137',
        label: 'Polygon',
        name: 'Polygon',
        rpcUrl: 'https://matic-mainnet.chainstacklabs.com/',
        type: 'evm',
    },
    {
        chainId: '3',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://ropsten.etherscan.io/',
        id: 'evm-3',
        label: 'Ropsten',
        name: 'Ropsten',
        rpcUrl: '',
        type: 'evm',
    },
    {
        chainId: '5',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://goerli.etherscan.io/',
        id: 'evm-5',
        label: 'Goerli',
        name: 'Goerli',
        rpcUrl: '',
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

export const TokenAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/master/test.json'

export const TokenListURI = 'https://raw.githubusercontent.com/broxus/ton-assets/master/test.json'

export const StakingAccountAddress = '0:6fdaa8f199d372c9f1ec8b3b20bc0e5ef72df412dd25f1d6ee8eb9db1e39fadc'

export const Web3Url = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'

export const GazToStaking = '55000000000'
