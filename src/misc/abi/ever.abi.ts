export abstract class EverAbi {

    static WeverVault = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owner_', type: 'address' },
                    { name: 'root', type: 'address' },
                    { name: 'root_tunnel', type: 'address' },
                    { name: 'receive_safe_fee', type: 'uint128' },
                    { name: 'settings_deploy_wallet_grams', type: 'uint128' },
                    { name: 'initial_balance', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [{ name: 'wallet', type: 'address' }],
                outputs: [],
            },
            {
                name: 'drain',
                inputs: [{ name: 'receiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'root_tunnel', type: 'address' },
                            { name: 'root', type: 'address' },
                            { name: 'receive_safe_fee', type: 'uint128' },
                            { name: 'settings_deploy_wallet_grams', type: 'uint128' },
                            { name: 'initial_balance', type: 'uint128' },
                        ],
                        name: '_configuration',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'withdraw',
                inputs: [{ name: 'amount', type: 'uint128' }],
                outputs: [],
            },
            {
                name: 'grant',
                inputs: [{ name: 'amount', type: 'uint128' }],
                outputs: [],
            },
            {
                name: 'wrap',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'owner_address', type: 'address' },
                    { name: 'gas_back_address', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: 'tokenRoot', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'sender', type: 'address' },
                    { name: 'senderWallet', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'transferOwnership',
                inputs: [{ name: 'newOwner', type: 'address' }],
                outputs: [],
            },
            {
                name: 'renounceOwnership',
                inputs: [],
                outputs: [],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [{ name: '_randomNonce', type: 'uint256' }],
            },
            {
                name: 'owner',
                inputs: [],
                outputs: [{ name: 'owner', type: 'address' }],
            },
            {
                name: 'configuration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'root_tunnel', type: 'address' },
                            { name: 'root', type: 'address' },
                            { name: 'receive_safe_fee', type: 'uint128' },
                            { name: 'settings_deploy_wallet_grams', type: 'uint128' },
                            { name: 'initial_balance', type: 'uint128' },
                        ],
                        name: 'configuration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'token_wallet',
                inputs: [],
                outputs: [{ name: 'token_wallet', type: 'address' }],
            },
            {
                name: 'total_wrapped',
                inputs: [],
                outputs: [{ name: 'total_wrapped', type: 'uint128' }],
            },
        ],
        data: [{ key: 1, name: '_randomNonce', type: 'uint256' }],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'owner', type: 'address' },
            {
                components: [
                    { name: 'root_tunnel', type: 'address' },
                    { name: 'root', type: 'address' },
                    { name: 'receive_safe_fee', type: 'uint128' },
                    { name: 'settings_deploy_wallet_grams', type: 'uint128' },
                    { name: 'initial_balance', type: 'uint128' },
                ],
                name: 'configuration',
                type: 'tuple',
            },
            { name: 'token_wallet', type: 'address' },
            { name: 'total_wrapped', type: 'uint128' },
        ],
    } as const

}
