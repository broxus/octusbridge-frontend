export abstract class TonAirdrop {

    static Airdrop = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_token', type: 'address' },
                    { name: '_owner', type: 'address' },
                    { name: '_start_timestamp', type: 'uint32' },
                    { name: '_claim_period_in_seconds', type: 'uint32' },
                    { name: '_claim_periods_amount', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                ],
                outputs: [
                    { name: '_token', type: 'address' },
                    { name: '_token_wallet', type: 'address' },
                    { name: '_claim_required_value', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                    { name: '_start_timestamp', type: 'uint32' },
                    { name: '_claim_period_in_seconds', type: 'uint32' },
                    { name: '_claim_periods_amount', type: 'uint32' },
                    { components: [{ name: 'start', type: 'uint32' }, { name: 'end', type: 'uint32' }, { name: 'id', type: 'uint32' }], name: '_periods', type: 'tuple[]' },
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getReceiverDetails',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { components: [{ name: 'last_claimed_period_id', type: 'uint32' }, { name: 'reward_per_period', type: 'uint128' }], name: 'receiver', type: 'tuple' },
                ],
            },
            {
                name: 'getCurrentClaimable',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: '_amount', type: 'uint128' },
                    { name: '_last_claimed_period_id', type: 'uint32' },
                ],
            },
            {
                name: 'claim',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setChunk',
                inputs: [
                    { name: '_users', type: 'address[]' },
                    { name: '_rewards_per_period', type: 'uint128[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { components: [{ name: 'last_claimed_period_id', type: 'uint32' }, { name: 'reward_per_period', type: 'uint128' }], name: 'receivers', type: 'map(address,tuple)' },
            { name: 'token', type: 'address' },
            { name: 'token_wallet', type: 'address' },
            { name: 'start_timestamp', type: 'uint32' },
            { name: 'claim_period_in_seconds', type: 'uint32' },
            { name: 'claim_periods_amount', type: 'uint32' },
            { name: 'transferred_count', type: 'uint128' },
            { components: [{ name: 'start', type: 'uint32' }, { name: 'end', type: 'uint32' }, { name: 'id', type: 'uint32' }], name: 'periods', type: 'tuple[]' },
        ],
    } as const

    static Wallet = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_token', type: 'address' },
                    { name: '_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                ],
                outputs: [
                    { name: '_token', type: 'address' },
                    { name: '_token_wallet', type: 'address' },
                    { name: '_claim_required_value', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getClaimable',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'claim',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setChunk',
                inputs: [
                    { name: '_users', type: 'address[]' },
                    { name: '_amounts', type: 'uint128[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'receivers', type: 'map(address,uint128)' },
            { name: 'token', type: 'address' },
            { name: 'token_wallet', type: 'address' },
            { name: 'transferred_count', type: 'uint128' },
        ],
    } as const

}
