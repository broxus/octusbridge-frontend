import { ProviderRpcClient } from 'everscale-inpage-provider'
import { type ConnectionProperties, EverscaleStandaloneClient, checkConnection } from 'everscale-standalone-client'

const MAINNET_JRPC: ConnectionProperties = 'mainnetJrpc'
const MAINNET_GQL: ConnectionProperties = {
    data: {
        endpoints: ['https://mainnet.evercloud.dev/89a3b8f46a484f2ea3bdd364ddaee3a3/graphql'],
    },
    id: 42,
    type: 'graphql',
}

const rpc = new ProviderRpcClient({
    fallback: () => checkConnection('mainnetJrpc')
        .then(() => MAINNET_JRPC)
        .catch(() => MAINNET_GQL)
        .then(connection => EverscaleStandaloneClient.create({ connection })),
    forceUseFallback: true,
})

export default rpc
