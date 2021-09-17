import ton, { hasTonProvider } from 'ton-inpage-provider'


export async function connectToWallet(): Promise<void> {
    const hasProvider = await hasTonProvider()

    if (hasProvider) {
        await ton.ensureInitialized()
        await ton.requestPermissions({
            permissions: ['tonClient', 'accountInteraction'],
        })
    }
}
