/* eslint-disable class-methods-use-this */

import type IEthereumProvider from '@walletconnect/ethereum-provider'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import Web3 from 'web3'

import { WalletConnectProjectId, networks } from '@/config'
import { error, storage } from '@/utils'

const WALLET_TYPE_STORAGE_KEY = 'wallet_type'

const evmNetworks = networks.filter(network => network.type === 'evm')

export enum EvmWalletType {
    WalletConnect = 'wallet_connect',
    MetaMask = 'metamask'
}

export class EvmProvider {

    public provider: IEthereumProvider | null = null

    public walletType: EvmWalletType | null = null

    constructor(
        protected onAccountsChanged: (e: string[]) => void,
        protected onChainChanged: (chainId: string) => void,
        protected onDisconnect: () => void,
    ) {
    }

    protected restoreWalletType(): EvmWalletType | null {
        const walletType = storage.get(WALLET_TYPE_STORAGE_KEY)

        switch (walletType) {
            case EvmWalletType.MetaMask:
                return EvmWalletType.MetaMask
            case EvmWalletType.WalletConnect:
                return EvmWalletType.WalletConnect
            default:
                return null
        }
    }

    public async init(): Promise<void> {
        const walletType = this.restoreWalletType()

        if (walletType) {
            await this.connect(walletType)
        }
    }

    public async connect(walletType: EvmWalletType): Promise<void> {
        await this.disconnect()

        let provider: IEthereumProvider | null = null

        if (walletType === EvmWalletType.WalletConnect) {
            const testProvider = await this.walletConnect()

            testProvider.on('accountsChanged', this.onAccountsChanged)
            testProvider.on('chainChanged', this.onChainChanged)
            testProvider.on('disconnect', this.onDisconnect)

            if (testProvider.session) {
                try {
                    await testProvider.enable()
                    provider = testProvider
                }
                catch (e) {
                    error('Wallet connect session enable error', e)
                    await this.disconnect()
                }
            }

            if (!testProvider.session) {
                try {
                    await testProvider.connect({
                        chains: [1],
                        optionalChains: evmNetworks.map(network => Number(network.chainId)),
                        rpcMap: evmNetworks.reduce<Record<number, string>>((acc, value) => {
                            acc[Number(value.chainId)] = value.rpcUrl
                            return acc
                        }, {}),
                    })
                    provider = testProvider
                }
                catch (e) {
                    testProvider.removeListener('accountsChanged', this.onAccountsChanged)
                    testProvider.removeListener('chainChanged', this.onChainChanged)
                    testProvider.removeListener('disconnect', this.onDisconnect)

                    throw new Error('Wallet connect reject')
                }
            }
        }
        else if (walletType === EvmWalletType.MetaMask) {
            const testProvider = await this.metamask()

            testProvider.on('accountsChanged', this.onAccountsChanged)
            testProvider.on('chainChanged', this.onChainChanged)
            testProvider.on('disconnect', this.onDisconnect)

            try {
                await testProvider.request({ method: 'eth_requestAccounts' })
                provider = testProvider
            }
            catch (e) {
                testProvider.removeListener('accountsChanged', this.onAccountsChanged)
                testProvider.removeListener('chainChanged', this.onChainChanged)
                testProvider.removeListener('disconnect', this.onDisconnect)

                throw new Error('User Rejected')
            }
        }

        if (provider) {
            this.walletType = walletType
            storage.set(WALLET_TYPE_STORAGE_KEY, walletType)
        }

        this.provider = provider
    }

    public async disconnect(): Promise<void> {
        storage.remove(WALLET_TYPE_STORAGE_KEY)

        this.provider?.removeListener('accountsChanged', this.onAccountsChanged)
        this.provider?.removeListener('chainChanged', this.onChainChanged)
        this.provider?.removeListener('disconnect', this.onDisconnect)

        if (this.walletType === EvmWalletType.WalletConnect) {
            await this.provider?.disconnect()
        }

        this.walletType = null
        this.provider = null
    }

    protected async metamask(): Promise<IEthereumProvider> {
        let provider = Web3.givenProvider

        if (typeof window.ethereum !== 'undefined') {
            provider = window.ethereum.providers?.find((p: any) => p.isMetaMask)

            if (provider == null && window.ethereum.isMetaMask) {
                provider = window.ethereum
            }
        }

        if (!provider) {
            throw new Error('No MetaMask Provider found')
        }

        return provider
    }

    protected async walletConnect(): Promise<IEthereumProvider> {
        const chains = evmNetworks.map(network => Number(network.chainId))

        const provider = await EthereumProvider.init({
            projectId: WalletConnectProjectId,
            chains,
            methods: [
                'eth_sendTransaction',
                'personal_sign',
                'wallet_switchEthereumChain',
                'wallet_addEthereumChain',
                'wallet_watchAsset',
            ],
            events: ['chainChanged', 'accountsChanged'],
            metadata: {
                name: 'Octus Bridge',
                description: 'Everscale powered gateway to the world of interchain transactions.',
                icons: [],
                url: 'https://octusbridge.io/',
            },
            showQrModal: true,
            qrModalOptions: {
                explorerRecommendedWalletIds: [
                    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Metamask
                ],
            },
        })

        return provider
    }

}
