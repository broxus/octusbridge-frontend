import { Address } from 'everscale-inpage-provider'

export function resolveEverscaleAddress(address: Address | string): Address {
    return address instanceof Address ? address : new Address(address)
}
