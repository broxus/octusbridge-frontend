import {
    EverscaleProviderAdapter,
    ProviderRpcClient,
    SparxProviderAdapter,
} from 'everscale-inpage-provider'

let isSparxWallet = false

try {
    isSparxWallet = navigator.userAgent.includes('SparXWalletBrowser')
}
catch {}

const rpc = new ProviderRpcClient({
    provider: isSparxWallet ? new SparxProviderAdapter() : new EverscaleProviderAdapter(),
})

export default rpc
