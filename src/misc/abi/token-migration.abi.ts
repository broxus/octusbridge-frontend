export abstract class MigrationTokenAbi {

    static RootV4 = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'root_public_key_', type: 'uint256' },
                    { name: 'root_owner_address_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [
                            { name: 'name', type: 'bytes' },
                            { name: 'symbol', type: 'bytes' },
                            { name: 'decimals', type: 'uint8' },
                            { name: 'root_public_key', type: 'uint256' },
                            { name: 'root_owner_address', type: 'address' },
                            { name: 'total_supply', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'getTotalSupply',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'getWalletCode',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'getWalletAddress',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'sendExpectedWalletAddress',
                inputs: [
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployWallet',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'gas_back_address', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployEmptyWallet',
                inputs: [
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'gas_back_address', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'mint',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'proxyBurn',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensBurned',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendSurplusGas',
                inputs: [
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setPaused',
                inputs: [
                    { name: 'value', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendPausedCallbackTo',
                inputs: [
                    { name: 'callback_id', type: 'uint64' },
                    { name: 'callback_addr', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwner',
                inputs: [
                    { name: 'root_public_key_', type: 'uint256' },
                    { name: 'root_owner_address_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'name',
                inputs: [
                ],
                outputs: [
                    { name: 'name', type: 'bytes' },
                ],
            },
            {
                name: 'symbol',
                inputs: [
                ],
                outputs: [
                    { name: 'symbol', type: 'bytes' },
                ],
            },
            {
                name: 'decimals',
                inputs: [
                ],
                outputs: [
                    { name: 'decimals', type: 'uint8' },
                ],
            },
            {
                name: 'start_gas_balance',
                inputs: [
                ],
                outputs: [
                    { name: 'start_gas_balance', type: 'uint128' },
                ],
            },
            {
                name: 'paused',
                inputs: [
                ],
                outputs: [
                    { name: 'paused', type: 'bool' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
            { key: 2, name: 'name', type: 'bytes' },
            { key: 3, name: 'symbol', type: 'bytes' },
            { key: 4, name: 'decimals', type: 'uint8' },
            { key: 5, name: 'wallet_code', type: 'cell' },
        ],
        events: [
        ],
    } as const

    static WalletV4 = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'balance',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [{ name: 'root_address', type: 'address' },
                            { name: 'wallet_public_key', type: 'uint256' },
                            { name: 'owner_address', type: 'address' },
                            { name: 'balance', type: 'uint128' },
                            { name: 'receive_callback', type: 'address' },
                            { name: 'bounced_callback', type: 'address' },
                            { name: 'allow_non_notifiable', type: 'bool' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'getWalletCode',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'accept',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'allowance',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [{ name: 'remaining_tokens', type: 'uint128' },
                            { name: 'spender', type: 'address' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'approve',
                inputs: [
                    { name: 'spender', type: 'address' },
                    { name: 'remaining_tokens', type: 'uint128' },
                    { name: 'tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'disapprove',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'transferToRecipient',
                inputs: [
                    { name: 'recipient_public_key', type: 'uint256' },
                    { name: 'recipient_address', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'transfer_grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transfer',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferFrom',
                inputs: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'internalTransfer',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'internalTransferFrom',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnByOwner',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnByRoot',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setReceiveCallback',
                inputs: [
                    { name: 'receive_callback_', type: 'address' },
                    { name: 'allow_non_notifiable_', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBouncedCallback',
                inputs: [
                    { name: 'bounced_callback_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'destroy',
                inputs: [
                    { name: 'gas_dest', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        data: [
            { key: 1, name: 'root_address', type: 'address' },
            { key: 2, name: 'code', type: 'cell' },
            { key: 3, name: 'wallet_public_key', type: 'uint256' },
            { key: 4, name: 'owner_address', type: 'address' },
        ],
        events: [
        ],
    } as const

}
