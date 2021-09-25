/* eslint-disable max-classes-per-file */
import { AbiItem } from 'web3-utils'

export class TokenAbi {

    static Root = {
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
    } as const;

    static Wallet = {
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
    } as const;

    static TokenTransferEthEvent = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: '_eventInitData', type: 'tuple' },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'getDecodedData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                    { name: 'owner_address', type: 'address' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'reject',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [
                    { name: 'voters', type: 'uint256[]' },
                ],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [
                    { name: 'vote', type: 'optional(uint8)' },
                ],
            },
            {
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeTonEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeTonEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [
                ],
                outputs: [
                    { name: 'status', type: 'uint8' },
                ],
            },
            {
                name: 'votes',
                inputs: [
                ],
                outputs: [
                    { name: 'votes', type: 'map(uint256,uint8)' },
                ],
            },
            {
                name: 'initializer',
                inputs: [
                ],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
            {
                name: 'requiredVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'confirms',
                inputs: [
                ],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [
                ],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [
                ],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [
                ],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], key: 1, name: 'eventInitData', type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Reject',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Closed',
                inputs: [
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
        ],
    } as const;

    static EthEventConfig = {
        'ABI version': 2,
        version: '2.1',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setMeta',
                inputs: [
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setEndBlockNumber',
                inputs: [
                    { name: 'endBlockNumber', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployEvent',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                    { name: 'eventContract', type: 'address' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: '_basicConfiguration', type: 'tuple' },
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: '_type', type: 'uint8' },
                ],
            },
            {
                name: 'broxusBridgeCallback',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
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
                name: 'basicConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
        ],
        data: [
            {
                components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], key: 1, name: 'basicConfiguration', type: 'tuple',
            },
            {
                components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], key: 2, name: 'networkConfiguration', type: 'tuple',
            },
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
            {
                name: 'NewEventContract',
                inputs: [
                    { name: 'eventContract', type: 'address' },
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
            { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
            { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
            { name: 'meta', type: 'cell' },
        ],
    } as const;

}

export class EthAbi {

    static Bridge: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'relay',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'status',
                    type: 'bool',
                },
            ],
            name: 'BanRelay',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool',
                },
            ],
            name: 'EmergencyShutdown',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    components: [
                        {
                            internalType: 'uint32',
                            name: 'end',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'ttl',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'relays',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'requiredSignatures',
                            type: 'uint32',
                        },
                    ],
                    indexed: false,
                    internalType: 'struct IBridge.Round',
                    name: 'meta',
                    type: 'tuple',
                },
            ],
            name: 'NewRound',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'previousOwner',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Paused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'relay',
                    type: 'address',
                },
            ],
            name: 'RoundRelay',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Unpaused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint32',
                    name: 'value',
                    type: 'uint32',
                },
            ],
            name: 'UpdateMinimumRequiredSignatures',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int8',
                            name: 'wid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    indexed: false,
                    internalType: 'struct IBridge.TONAddress',
                    name: 'configuration',
                    type: 'tuple',
                },
            ],
            name: 'UpdateRoundRelaysConfiguration',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
            ],
            name: 'UpdateRoundSubmitter',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint32',
                    name: 'value',
                    type: 'uint32',
                },
            ],
            name: 'UpdateRoundTTL',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: '_relays',
                    type: 'address[]',
                },
            ],
            name: 'banRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'blacklist',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'cache',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeRoundRelaysEventData',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
                {
                    internalType: 'uint32',
                    name: 'roundEnd',
                    type: 'uint32',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeTonEvent',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint64',
                            name: 'eventTransactionLt',
                            type: 'uint64',
                        },
                        {
                            internalType: 'uint32',
                            name: 'eventTimestamp',
                            type: 'uint32',
                        },
                        {
                            internalType: 'bytes',
                            name: 'eventData',
                            type: 'bytes',
                        },
                        {
                            internalType: 'int8',
                            name: 'configurationWid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'configurationAddress',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int8',
                            name: 'eventContractWid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'eventContractAddress',
                            type: 'uint256',
                        },
                        {
                            internalType: 'address',
                            name: 'proxy',
                            type: 'address',
                        },
                        {
                            internalType: 'uint32',
                            name: 'round',
                            type: 'uint32',
                        },
                    ],
                    internalType: 'struct IBridge.TONEvent',
                    name: 'tonEvent',
                    type: 'tuple',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [],
            name: 'emergencyShutdown',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
                {
                    internalType: 'uint32',
                    name: 'roundEnd',
                    type: 'uint32',
                },
            ],
            name: 'forceRoundRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'initialRound',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
                {
                    internalType: 'uint32',
                    name: '_minimumRequiredSignatures',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_roundTTL',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_initialRound',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_initialRoundEnd',
                    type: 'uint32',
                },
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'candidate',
                    type: 'address',
                },
            ],
            name: 'isBanned',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    internalType: 'address',
                    name: 'candidate',
                    type: 'address',
                },
            ],
            name: 'isRelay',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
            ],
            name: 'isRoundRotten',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'lastRound',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'minimumRequiredSignatures',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'pause',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'signature',
                    type: 'bytes',
                },
            ],
            name: 'recoverSignature',
            outputs: [
                {
                    internalType: 'address',
                    name: 'signer',
                    type: 'address',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'relays',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundRelaysConfiguration',
            outputs: [
                {
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundSubmitter',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundTTL',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            name: 'rounds',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'end',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'ttl',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'relays',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'requiredSignatures',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
            ],
            name: 'setRoundRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
            ],
            name: 'setRoundSubmitter',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: '_relays',
                    type: 'address[]',
                },
            ],
            name: 'unbanRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'unpause',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '_minimumRequiredSignatures',
                    type: 'uint32',
                },
            ],
            name: 'updateMinimumRequiredSignatures',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int8',
                            name: 'wid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IBridge.TONAddress',
                    name: '_roundRelaysConfiguration',
                    type: 'tuple',
                },
            ],
            name: 'updateRoundRelaysConfiguration',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '_roundTTL',
                    type: 'uint32',
                },
            ],
            name: 'updateRoundTTL',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
            ],
            name: 'verifySignedTonEvent',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'errorCode',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ];

    static ERC20: AbiItem[] = [
        {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_spender',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'approve',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_from',
                    type: 'address',
                },
                {
                    name: '_to',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'transferFrom',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'balanceOf',
            outputs: [
                {
                    name: 'balance',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'symbol',
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_to',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'transfer',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
                {
                    name: '_spender',
                    type: 'address',
                },
            ],
            name: 'allowance',
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            payable: true,
            stateMutability: 'payable',
            type: 'fallback',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'owner',
                    type: 'address',
                },
                {
                    indexed: true,
                    name: 'spender',
                    type: 'address',
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Approval',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address',
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Transfer',
            type: 'event',
        },
    ];

    static Vault: AbiItem[] = [
        {
            name: 'Deposit',
            inputs: [
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'wid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'addr',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'PendingWithdrawalUpdate',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'open',
                    type: 'bool',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateBridge',
            inputs: [
                {
                    name: 'bridge',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWrapper',
            inputs: [
                {
                    name: 'wrapper',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateConfiguration',
            inputs: [
                {
                    name: 'configuration',
                    type: '(int128,uint256)',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateRewards',
            inputs: [
                {
                    name: 'rewards',
                    type: '(int128,uint256)',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateStrategyRewards',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'rewards',
                    type: '(int128,uint256)',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateDepositFee',
            inputs: [
                {
                    name: 'fee',
                    type: '(uint256,uint256)',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWithdrawFee',
            inputs: [
                {
                    name: 'fee',
                    type: '(uint256,uint256)',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyAdded',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyReported',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'gain',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'loss',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtPaid',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalGain',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalSkim',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalLoss',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalDebt',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtAdded',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'NewPendingGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateManagement',
            inputs: [
                {
                    name: 'management',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateDepositLimit',
            inputs: [
                {
                    name: 'depositLimit',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdatePerformanceFee',
            inputs: [
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateManagementFee',
            inputs: [
                {
                    name: 'managementFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateGuardian',
            inputs: [
                {
                    name: 'guardian',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'EmergencyShutdown',
            inputs: [
                {
                    name: 'active',
                    type: 'bool',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWithdrawalQueue',
            inputs: [
                {
                    name: 'queue',
                    type: 'address[20]',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateDebtRatio',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateMinDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateMaxDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdatePerformanceFee',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyMigrated',
            inputs: [
                {
                    name: 'oldVersion',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'newVersion',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyRevoked',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyRemovedFromQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyAddedToQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'initialize',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
                {
                    name: 'governance',
                    type: 'address',
                },
                {
                    name: 'bridge',
                    type: 'address',
                },
                {
                    name: 'wrapper',
                    type: 'address',
                },
                {
                    name: 'guardian',
                    type: 'address',
                },
                {
                    name: 'management',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 367155,
        },
        {
            stateMutability: 'pure',
            type: 'function',
            name: 'apiVersion',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            gas: 5946,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setDepositFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'tuple',
                    components: [
                        {
                            name: 'step',
                            type: 'uint256',
                        },
                        {
                            name: 'size',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 76514,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWithdrawFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'tuple',
                    components: [
                        {
                            name: 'step',
                            type: 'uint256',
                        },
                        {
                            name: 'size',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 76544,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWrapper',
            inputs: [
                {
                    name: 'wrapper',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 38805,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setConfiguration',
            inputs: [
                {
                    name: 'configuration',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 74089,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 39071,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'acceptGovernance',
            inputs: [],
            outputs: [],
            gas: 38997,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setManagement',
            inputs: [
                {
                    name: 'management',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 39135,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setStrategyRewards',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 82246,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setRewards',
            inputs: [
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 74239,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setLockedProfitDegradation',
            inputs: [
                {
                    name: 'degradation',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 37879,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setDepositLimit',
            inputs: [
                {
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39155,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setPerformanceFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39289,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setManagementFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39319,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setGuardian',
            inputs: [
                {
                    name: 'guardian',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 41863,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setEmergencyShutdown',
            inputs: [
                {
                    name: 'active',
                    type: 'bool',
                },
            ],
            outputs: [],
            gas: 41934,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWithdrawalQueue',
            inputs: [
                {
                    name: 'queue',
                    type: 'address[20]',
                },
            ],
            outputs: [],
            gas: 1348979,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setPendingWithdrawalBounty',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 49722,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'totalAssets',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 8578,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'deposit',
            inputs: [
                {
                    name: 'sender',
                    type: 'address',
                },
                {
                    name: 'recipient',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
                {
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                    components: [
                        {
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            name: 'id',
                            type: 'uint256',
                        },
                    ],
                },
                {
                    name: 'sendTransferToTon',
                    type: 'bool',
                },
            ],
            outputs: [],
            gas: 196701,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'saveWithdraw',
            inputs: [
                {
                    name: 'payloadId',
                    type: 'bytes32',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 246913,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'cancelPendingWithdrawal',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 80444,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: 'maxLoss',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'addStrategy',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 1638399,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyDebtRatio',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 121685,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyMinDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 47551,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyMaxDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 47581,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyPerformanceFee',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 42794,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'migrateStrategy',
            inputs: [
                {
                    name: 'oldVersion',
                    type: 'address',
                },
                {
                    name: 'newVersion',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 1324247,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revokeStrategy',
            inputs: [],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revokeStrategy',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'addStrategyToQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 1255524,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'removeStrategyFromQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 23635413,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtOutstanding',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtOutstanding',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'creditAvailable',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'creditAvailable',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'availableDepositLimit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 21201,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'expectedReturn',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'expectedReturn',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'report',
            inputs: [
                {
                    name: 'gain',
                    type: 'uint256',
                },
                {
                    name: 'loss',
                    type: 'uint256',
                },
                {
                    name: '_debtPayment',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 660170,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'sweep',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'sweep',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
                {
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'emergencyWithdrawAndRevoke',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'emergencyWithdrawAndRevoke',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: '_amountNeeded',
                    type: 'uint256',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'skim',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 59036,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'token',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3618,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'governance',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3648,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'management',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3678,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'guardian',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3708,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawalsPerUser',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 3953,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawals',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
                {
                    name: 'arg1',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
                {
                    name: 'open',
                    type: 'bool',
                },
            ],
            gas: 8914,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawalsTotal',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 3798,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawIds',
            inputs: [
                {
                    name: 'arg0',
                    type: 'bytes32',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            gas: 3943,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'wrapper',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3858,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'bridge',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3888,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'configuration',
            inputs: [],
            outputs: [
                {
                    name: 'wid',
                    type: 'int128',
                },
                {
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            gas: 6452,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'rewards',
            inputs: [],
            outputs: [
                {
                    name: 'wid',
                    type: 'int128',
                },
                {
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            gas: 6482,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'depositFee',
            inputs: [],
            outputs: [
                {
                    name: 'step',
                    type: 'uint256',
                },
                {
                    name: 'size',
                    type: 'uint256',
                },
            ],
            gas: 6512,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawFee',
            inputs: [],
            outputs: [
                {
                    name: 'step',
                    type: 'uint256',
                },
                {
                    name: 'size',
                    type: 'uint256',
                },
            ],
            gas: 6542,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'strategies',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
                {
                    name: 'activation',
                    type: 'uint256',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'lastReport',
                    type: 'uint256',
                },
                {
                    name: 'totalDebt',
                    type: 'uint256',
                },
                {
                    name: 'totalGain',
                    type: 'uint256',
                },
                {
                    name: 'totalSkim',
                    type: 'uint256',
                },
                {
                    name: 'totalLoss',
                    type: 'uint256',
                },
                {
                    name: 'rewardsManager',
                    type: 'address',
                },
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            gas: 32100,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawalQueue',
            inputs: [
                {
                    name: 'arg0',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 4177,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'emergencyShutdown',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            gas: 4098,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'depositLimit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4128,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtRatio',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4158,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'totalDebt',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4188,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lastReport',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4218,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'activation',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4248,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lockedProfit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4278,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lockedProfitDegradation',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4308,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'managementFee',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4338,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'performanceFee',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4368,
        },
    ];

    static VaultWrapper: AbiItem[] = [
        {
            inputs: [],
            name: 'apiVersion',
            outputs: [
                {
                    internalType: 'string',
                    name: 'api_version',
                    type: 'string',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeWithdrawEventData',
            outputs: [
                {
                    internalType: 'int8',
                    name: 'sender_wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'sender_addr',
                    type: 'uint256',
                },
                {
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint160',
                    name: '_recipient',
                    type: 'uint160',
                },
                {
                    internalType: 'uint32',
                    name: 'chainId',
                    type: 'uint32',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int128',
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.TONAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int128',
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.TONAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'id',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalsIdsToFill',
                    type: 'tuple[]',
                },
            ],
            name: 'depositWithFillings',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'getChainID',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_vault',
                    type: 'address',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'saveWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'vault',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ];

}
