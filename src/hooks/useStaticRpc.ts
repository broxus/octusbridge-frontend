import { ProviderRpcClient } from 'everscale-inpage-provider'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'

const rpc = new ProviderRpcClient({
    fallback: () => EverscaleStandaloneClient.create({
        connection: 'mainnetJrpc',
    }),
    forceUseFallback: true,
})

export default rpc
