import { ProviderRpcClient } from 'everscale-inpage-provider'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'

const rpc = new ProviderRpcClient({
    fallback: () => EverscaleStandaloneClient.create({
        connection: 'mainnet',
    }),
    forceUseFallback: true,
})

export default rpc
