import { NetworkShape } from '@/bridge'


export const networks: NetworkShape[] = [
    {
        chainId: '3',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://ropsten.etherscan.io/',
        id: 'evm-1',
        label: 'Ropsten',
        name: 'Ropsten',
        rpcUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
        type: 'evm',
    },
    {
        chainId: '5',
        currencySymbol: 'ETH',
        explorerBaseUrl: 'https://goerli.etherscan.io/',
        id: 'evm-5',
        label: 'Goerli',
        name: 'Goerli',
        rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161/',
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

export const RelayEvmNetworkChainId = '5'
