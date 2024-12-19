import { type Provider, type ProviderAdapter, ProviderRpcClient } from 'everscale-inpage-provider'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'

class StandaloneClientAdapter implements ProviderAdapter {

    private _provider: Provider | undefined

    public async getProvider(): Promise<Provider | undefined> {
        if (this._provider) {
            return this._provider
        }

        this._provider = await EverscaleStandaloneClient.create({ connection: 'mainnetJrpc' })

        return this._provider
    }

    public async hasProvider(): Promise<boolean> {
        return this._provider != null
    }

}

const rpc = new ProviderRpcClient({
    provider: new StandaloneClientAdapter(),
})

export default rpc
