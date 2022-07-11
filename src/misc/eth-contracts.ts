import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

import { EthAbi } from './abi'


export function evmMultiVaultContract(address: string, rpcUrl: string): Contract {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
    return new web3.eth.Contract(EthAbi.MultiVault, address)
}

export function evmVaultContract(address: string, rpcUrl: string): Contract {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
    return new web3.eth.Contract(EthAbi.Vault, address)
}

export function erc20TokenContract(address: string, rpcUrl: string): Contract {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
    return new web3.eth.Contract(EthAbi.ERC20, address)
}

export function evmBridgeContract(address: string, rpcUrl: string): Contract {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
    return new web3.eth.Contract(EthAbi.Bridge, address)
}
