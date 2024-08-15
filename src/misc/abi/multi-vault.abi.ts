export abstract class MultiVaultAbi {

    static AlienProxy = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time'],
        functions: [
            {
                name: 'constructor',
                inputs: [{ name: 'owner_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'upgrade',
                inputs: [{ name: 'code', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'deriveMergeRouter',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'token', type: 'address' },
                ],
                outputs: [{ name: 'router', type: 'address' }],
            },
            {
                name: 'deployMergeRouter',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'setMergeRouter',
                inputs: [{ name: '_mergeRouter', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'deriveMergePool',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'nonce', type: 'uint256' },
                ],
                outputs: [{ name: 'pool', type: 'address' }],
            },
            {
                name: 'deployMergePool',
                inputs: [
                    { name: 'nonce', type: 'uint256' },
                    { name: 'tokens', type: 'address[]' },
                    { name: 'canonId', type: 'uint256' },
                ],
                outputs: [],
            },
            {
                name: 'mintTokensByMergePool',
                inputs: [
                    { name: 'nonce', type: 'uint256' },
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'withdrawTokensToEVMByMergePool',
                inputs: [
                    { name: 'nonce', type: 'uint256' },
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint160' },
                    { name: 'remainingGasTo', type: 'address' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'bytes' },
                            { name: 'strict', type: 'bool' },
                        ],
                        name: 'callback',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'withdrawTokensToSolanaByMergePool',
                inputs: [
                    { name: 'nonce', type: 'uint256' },
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint256' },
                    { name: 'remainingGasTo', type: 'address' },
                    {
                        components: [
                            { name: 'account', type: 'uint256' },
                            { name: 'readOnly', type: 'bool' },
                            { name: 'isSigner', type: 'bool' },
                        ],
                        name: 'executeAccounts',
                        type: 'tuple[]',
                    },
                ],
                outputs: [],
            },
            {
                name: 'upgradeMergePool',
                inputs: [{ name: 'pool', type: 'address' }],
                outputs: [],
            },
            {
                name: 'setMergePoolPlatform',
                inputs: [{ name: '_mergePoolPlatform', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'setMergePool',
                inputs: [{ name: '_mergePool', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'onAcceptTokensBurn',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmedExtended',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransaction',
                                        type: 'uint256',
                                    },
                                    { name: 'eventIndex', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                    { name: 'eventBlockNumber', type: 'uint32' },
                                    { name: 'eventBlock', type: 'uint256' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                            { name: 'chainId', type: 'uint32' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onSolanaEventConfirmedExtended',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'accountSeed', type: 'uint128' },
                                    { name: 'slot', type: 'uint64' },
                                    { name: 'blockTime', type: 'uint64' },
                                    { name: 'txSignature', type: 'string' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'mint',
                inputs: [
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'burn',
                inputs: [
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deployEVMAlienToken',
                inputs: [
                    { name: 'chainId', type: 'uint256' },
                    { name: 'token', type: 'uint160' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deploySolanaAlienToken',
                inputs: [
                    { name: 'token', type: 'uint256' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deriveEVMAlienTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'token', type: 'uint160' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                ],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'deriveSolanaAlienTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'token', type: 'uint256' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                ],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'getConfiguration',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'evmConfigurations', type: 'address[]' },
                            { name: 'alienTokenRootCode', type: 'cell' },
                            { name: 'alienTokenWalletCode', type: 'cell' },
                            { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'solanaConfiguration', type: 'address' },
                            { name: 'alienTokenRootCode', type: 'cell' },
                            { name: 'alienTokenWalletCode', type: 'cell' },
                            { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                        ],
                        name: 'value1',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'setEVMConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'evmConfigurations', type: 'address[]' },
                            { name: 'alienTokenRootCode', type: 'cell' },
                            { name: 'alienTokenWalletCode', type: 'cell' },
                            { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setSolanaConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'solanaConfiguration', type: 'address' },
                            { name: 'alienTokenRootCode', type: 'cell' },
                            { name: 'alienTokenWalletCode', type: 'cell' },
                            { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setManager',
                inputs: [{ name: '_manager', type: 'address' }],
                outputs: [],
            },
            {
                name: 'sendMessage',
                inputs: [
                    { name: 'recipient', type: 'address' },
                    { name: 'message', type: 'cell' },
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
                name: 'owner',
                inputs: [],
                outputs: [{ name: 'owner', type: 'address' }],
            },
            {
                name: 'manager',
                inputs: [],
                outputs: [{ name: 'manager', type: 'address' }],
            },
            {
                name: 'mergeRouter',
                inputs: [],
                outputs: [{ name: 'mergeRouter', type: 'cell' }],
            },
            {
                name: 'mergePool',
                inputs: [],
                outputs: [{ name: 'mergePool', type: 'cell' }],
            },
            {
                name: 'mergePoolPlatform',
                inputs: [],
                outputs: [{ name: 'mergePoolPlatform', type: 'cell' }],
            },
            {
                name: 'mergePoolVersion',
                inputs: [],
                outputs: [{ name: 'mergePoolVersion', type: 'uint8' }],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [{ name: '_randomNonce', type: 'uint256' }],
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
            {
                name: 'SolanaAlienTransfer',
                inputs: [
                    { name: 'base_token', type: 'uint256' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'sol_amount', type: 'uint64' },
                    { name: 'recipient', type: 'address' },
                    { name: 'payload', type: 'bytes' },
                ],
                outputs: [],
            },
            {
                name: 'EVMAlienTransfer',
                inputs: [
                    { name: 'token', type: 'uint160' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'callback_recipient', type: 'uint160' },
                    { name: 'callback_payload', type: 'bytes' },
                    { name: 'callback_strict', type: 'bool' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            {
                components: [
                    { name: 'everscaleConfiguration', type: 'address' },
                    { name: 'solanaConfiguration', type: 'address' },
                    { name: 'alienTokenRootCode', type: 'cell' },
                    { name: 'alienTokenWalletCode', type: 'cell' },
                    { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                ],
                name: 'solanaConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'everscaleConfiguration', type: 'address' },
                    { name: 'evmConfigurations', type: 'address[]' },
                    { name: 'alienTokenRootCode', type: 'cell' },
                    { name: 'alienTokenWalletCode', type: 'cell' },
                    { name: 'alienTokenWalletPlatformCode', type: 'cell' },
                ],
                name: 'evmConfiguration',
                type: 'tuple',
            },
            { name: 'api_version', type: 'uint8' },
            { name: 'manager', type: 'address' },
            { name: 'mergeRouter', type: 'cell' },
            { name: 'mergePool', type: 'cell' },
            { name: 'mergePoolPlatform', type: 'cell' },
            { name: 'mergePoolVersion', type: 'uint8' },
            { name: '_randomNonce', type: 'uint256' },
        ],
    } as const

    static EverscaleEVMEventAlien = {
        'ABI version': 2,
        data: [
            {
                components: [
                    {
                        components: [
                            {
                                name: 'eventTransactionLt',
                                type: 'uint64',
                            },
                            {
                                name: 'eventTimestamp',
                                type: 'uint32',
                            },
                            {
                                name: 'eventData',
                                type: 'cell',
                            },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    {
                        name: 'configuration',
                        type: 'address',
                    },
                    {
                        name: 'staking',
                        type: 'address',
                    },
                ],
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                inputs: [
                    {
                        name: 'relay',
                        type: 'uint256',
                    },
                    {
                        name: 'signature',
                        type: 'bytes',
                    },
                ],
                name: 'Confirm',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'relay',
                        type: 'uint256',
                    },
                ],
                name: 'Reject',
                outputs: [],
            },
            {
                inputs: [],
                name: 'Closed',
                outputs: [],
            },
            {
                inputs: [],
                name: 'Confirmed',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'reason',
                        type: 'uint32',
                    },
                ],
                name: 'Rejected',
                outputs: [],
            },
        ],
        fields: [
            {
                name: '_pubkey',
                type: 'uint256',
            },
            {
                name: '_constructorFlag',
                type: 'bool',
            },
            {
                name: '_status',
                type: 'uint8',
            },
            {
                name: 'votes',
                type: 'map(uint256,uint8)',
            },
            {
                name: 'initializer',
                type: 'address',
            },
            {
                name: 'meta',
                type: 'cell',
            },
            {
                name: 'requiredVotes',
                type: 'uint32',
            },
            {
                name: 'confirms',
                type: 'uint16',
            },
            {
                name: 'rejects',
                type: 'uint16',
            },
            {
                name: 'relay_round',
                type: 'address',
            },
            {
                name: 'round_number',
                type: 'uint32',
            },
            {
                name: 'createdAt',
                type: 'uint32',
            },
            {
                components: [
                    {
                        components: [
                            {
                                name: 'eventTransactionLt',
                                type: 'uint64',
                            },
                            {
                                name: 'eventTimestamp',
                                type: 'uint32',
                            },
                            {
                                name: 'eventData',
                                type: 'cell',
                            },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    {
                        name: 'configuration',
                        type: 'address',
                    },
                    {
                        name: 'staking',
                        type: 'address',
                    },
                ],
                name: 'eventInitData',
                type: 'tuple',
            },
            {
                name: 'signatures',
                type: 'map(uint256,bytes)',
            },
            {
                name: 'nonce',
                type: 'uint32',
            },
            {
                name: 'proxy',
                type: 'address',
            },
            {
                name: 'token',
                type: 'address',
            },
            {
                name: 'remainingGasTo',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint128',
            },
            {
                name: 'recipient',
                type: 'uint160',
            },
            {
                name: 'sender',
                type: 'address',
            },
            {
                name: 'initial_balance',
                type: 'uint128',
            },
            {
                name: 'callback_recipient',
                type: 'uint160',
            },
            {
                name: 'callback_payload',
                type: 'bytes',
            },
            {
                name: 'callback_strict',
                type: 'bool',
            },
            {
                name: 'base_chainId',
                type: 'uint256',
            },
            {
                name: 'base_token',
                type: 'uint160',
            },
            {
                name: 'expectedToken',
                type: 'address',
            },
        ],
        functions: [
            {
                inputs: [
                    {
                        name: '_initializer',
                        type: 'address',
                    },
                    {
                        name: '_meta',
                        type: 'cell',
                    },
                ],
                name: 'constructor',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'base_chainId_',
                        type: 'uint256',
                    },
                    {
                        name: 'base_token_',
                        type: 'uint160',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        name: 'decimals',
                        type: 'uint8',
                    },
                ],
                name: 'receiveTokenMeta',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'token_',
                        type: 'address',
                    },
                ],
                name: 'receiveAlienTokenRoot',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getDecodedData',
                outputs: [
                    {
                        name: 'proxy_',
                        type: 'address',
                    },
                    {
                        name: 'token_',
                        type: 'address',
                    },
                    {
                        name: 'remainingGasTo_',
                        type: 'address',
                    },
                    {
                        name: 'amount_',
                        type: 'uint128',
                    },
                    {
                        name: 'recipient_',
                        type: 'uint160',
                    },
                    {
                        components: [
                            {
                                name: 'recipient',
                                type: 'uint160',
                            },
                            {
                                name: 'payload',
                                type: 'bytes',
                            },
                            {
                                name: 'strict',
                                type: 'bool',
                            },
                        ],
                        name: 'callback',
                        type: 'tuple',
                    },
                    {
                        name: 'base_chainId_',
                        type: 'uint256',
                    },
                    {
                        name: 'base_token_',
                        type: 'uint160',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getEventInitData',
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransactionLt',
                                        type: 'uint64',
                                    },
                                    {
                                        name: 'eventTimestamp',
                                        type: 'uint32',
                                    },
                                    {
                                        name: 'eventData',
                                        type: 'cell',
                                    },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            {
                                name: 'configuration',
                                type: 'address',
                            },
                            {
                                name: 'staking',
                                type: 'address',
                            },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'signature',
                        type: 'bytes',
                    },
                    {
                        name: 'voteReceiver',
                        type: 'address',
                    },
                ],
                name: 'confirm',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'voteReceiver',
                        type: 'address',
                    },
                ],
                name: 'reject',
                outputs: [],
            },
            {
                inputs: [],
                name: 'close',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getDetails',
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransactionLt',
                                        type: 'uint64',
                                    },
                                    {
                                        name: 'eventTimestamp',
                                        type: 'uint32',
                                    },
                                    {
                                        name: 'eventData',
                                        type: 'cell',
                                    },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            {
                                name: 'configuration',
                                type: 'address',
                            },
                            {
                                name: 'staking',
                                type: 'address',
                            },
                        ],
                        name: '_eventInitData',
                        type: 'tuple',
                    },
                    {
                        name: '_status',
                        type: 'uint8',
                    },
                    {
                        name: '_confirms',
                        type: 'uint256[]',
                    },
                    {
                        name: '_rejects',
                        type: 'uint256[]',
                    },
                    {
                        name: 'empty',
                        type: 'uint256[]',
                    },
                    {
                        name: '_signatures',
                        type: 'bytes[]',
                    },
                    {
                        name: 'balance',
                        type: 'uint128',
                    },
                    {
                        name: '_initializer',
                        type: 'address',
                    },
                    {
                        name: '_meta',
                        type: 'cell',
                    },
                    {
                        name: '_requiredVotes',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'status',
                outputs: [
                    {
                        name: 'value0',
                        type: 'uint8',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'roundContract',
                        type: 'address',
                    },
                    {
                        name: 'roundNum',
                        type: 'uint32',
                    },
                ],
                name: 'receiveRoundAddress',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'keys',
                        type: 'uint256[]',
                    },
                ],
                name: 'receiveRoundRelays',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                    {
                        name: 'vote',
                        type: 'uint8',
                    },
                ],
                name: 'getVoters',
                outputs: [
                    {
                        name: 'voters',
                        type: 'uint256[]',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                    {
                        name: 'voter',
                        type: 'uint256',
                    },
                ],
                name: 'getVote',
                outputs: [
                    {
                        name: 'vote',
                        type: 'optional(uint8)',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getApiVersion',
                outputs: [
                    {
                        name: 'value0',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'votes',
                outputs: [
                    {
                        name: 'votes',
                        type: 'map(uint256,uint8)',
                    },
                ],
            },
            {
                inputs: [],
                name: 'initializer',
                outputs: [
                    {
                        name: 'initializer',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'meta',
                outputs: [
                    {
                        name: 'meta',
                        type: 'cell',
                    },
                ],
            },
            {
                inputs: [],
                name: 'requiredVotes',
                outputs: [
                    {
                        name: 'requiredVotes',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'confirms',
                outputs: [
                    {
                        name: 'confirms',
                        type: 'uint16',
                    },
                ],
            },
            {
                inputs: [],
                name: 'rejects',
                outputs: [
                    {
                        name: 'rejects',
                        type: 'uint16',
                    },
                ],
            },
            {
                inputs: [],
                name: 'relay_round',
                outputs: [
                    {
                        name: 'relay_round',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'round_number',
                outputs: [
                    {
                        name: 'round_number',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'createdAt',
                outputs: [
                    {
                        name: 'createdAt',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'signatures',
                outputs: [
                    {
                        name: 'signatures',
                        type: 'map(uint256,bytes)',
                    },
                ],
            },
            {
                inputs: [],
                name: 'nonce',
                outputs: [
                    {
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
            },
            {
                inputs: [],
                name: 'proxy',
                outputs: [
                    {
                        name: 'proxy',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'token',
                outputs: [
                    {
                        name: 'token',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'remainingGasTo',
                outputs: [
                    {
                        name: 'remainingGasTo',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'amount',
                outputs: [
                    {
                        name: 'amount',
                        type: 'uint128',
                    },
                ],
            },
            {
                inputs: [],
                name: 'recipient',
                outputs: [
                    {
                        name: 'recipient',
                        type: 'uint160',
                    },
                ],
            },
            {
                inputs: [],
                name: 'sender',
                outputs: [
                    {
                        name: 'sender',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'initial_balance',
                outputs: [
                    {
                        name: 'initial_balance',
                        type: 'uint128',
                    },
                ],
            },
            {
                inputs: [],
                name: 'callback_recipient',
                outputs: [
                    {
                        name: 'callback_recipient',
                        type: 'uint160',
                    },
                ],
            },
            {
                inputs: [],
                name: 'callback_payload',
                outputs: [
                    {
                        name: 'callback_payload',
                        type: 'bytes',
                    },
                ],
            },
            {
                inputs: [],
                name: 'callback_strict',
                outputs: [
                    {
                        name: 'callback_strict',
                        type: 'bool',
                    },
                ],
            },
            {
                inputs: [],
                name: 'base_chainId',
                outputs: [
                    {
                        name: 'base_chainId',
                        type: 'uint256',
                    },
                ],
            },
            {
                inputs: [],
                name: 'base_token',
                outputs: [
                    {
                        name: 'base_token',
                        type: 'uint160',
                    },
                ],
            },
            {
                inputs: [],
                name: 'expectedToken',
                outputs: [
                    {
                        name: 'expectedToken',
                        type: 'address',
                    },
                ],
            },
        ],
        header: [
            'pubkey',
            'time',
            'expire',
        ],
        version: '2.2',
    } as const

    static EverscaleEVMEventNative = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenName',
                inputs: [{ name: 'name_', type: 'string' }],
                outputs: [],
            },
            {
                name: 'receiveTokenSymbol',
                inputs: [{ name: 'symbol_', type: 'string' }],
                outputs: [],
            },
            {
                name: 'receiveTokenDecimals',
                inputs: [{ name: 'decimals_', type: 'uint8' }],
                outputs: [],
            },
            {
                name: 'receiveProxyTokenWallet',
                inputs: [{ name: 'tokenWallet_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'proxy_', type: 'address' },
                    { name: 'tokenWallet_', type: 'address' },
                    { name: 'token_', type: 'address' },
                    { name: 'remainingGasTo_', type: 'address' },
                    { name: 'amount_', type: 'uint128' },
                    { name: 'recipient_', type: 'uint160' },
                    { name: 'chainId_', type: 'uint256' },
                    {
                        components: [
                            { name: 'recipient', type: 'uint160' },
                            { name: 'payload', type: 'bytes' },
                            { name: 'strict', type: 'bool' },
                        ],
                        name: 'callback',
                        type: 'tuple',
                    },
                    { name: 'name_', type: 'string' },
                    { name: 'symbol_', type: 'string' },
                    { name: 'decimals_', type: 'uint8' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransactionLt',
                                        type: 'uint64',
                                    },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                    { name: 'signature', type: 'bytes' },
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransactionLt',
                                        type: 'uint64',
                                    },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: '_eventInitData',
                        type: 'tuple',
                    },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: '_signatures', type: 'bytes[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [{ name: 'keys', type: 'uint256[]' }],
                outputs: [],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [{ name: 'voters', type: 'uint256[]' }],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [{ name: 'vote', type: 'optional(uint8)' }],
            },
            {
                name: 'getApiVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint32' }],
            },
            {
                name: 'votes',
                inputs: [],
                outputs: [{ name: 'votes', type: 'map(uint256,uint8)' }],
            },
            {
                name: 'initializer',
                inputs: [],
                outputs: [{ name: 'initializer', type: 'address' }],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
            {
                name: 'requiredVotes',
                inputs: [],
                outputs: [{ name: 'requiredVotes', type: 'uint32' }],
            },
            {
                name: 'confirms',
                inputs: [],
                outputs: [{ name: 'confirms', type: 'uint16' }],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [{ name: 'rejects', type: 'uint16' }],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [{ name: 'relay_round', type: 'address' }],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [{ name: 'round_number', type: 'uint32' }],
            },
            {
                name: 'createdAt',
                inputs: [],
                outputs: [{ name: 'createdAt', type: 'uint32' }],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [{ name: 'signatures', type: 'map(uint256,bytes)' }],
            },
            {
                name: 'nonce',
                inputs: [],
                outputs: [{ name: 'nonce', type: 'uint32' }],
            },
            {
                name: 'proxy',
                inputs: [],
                outputs: [{ name: 'proxy', type: 'address' }],
            },
            {
                name: 'tokenWallet',
                inputs: [],
                outputs: [{ name: 'tokenWallet', type: 'address' }],
            },
            {
                name: 'token',
                inputs: [],
                outputs: [{ name: 'token', type: 'address' }],
            },
            {
                name: 'remainingGasTo',
                inputs: [],
                outputs: [{ name: 'remainingGasTo', type: 'address' }],
            },
            {
                name: 'amount',
                inputs: [],
                outputs: [{ name: 'amount', type: 'uint128' }],
            },
            {
                name: 'recipient',
                inputs: [],
                outputs: [{ name: 'recipient', type: 'uint160' }],
            },
            {
                name: 'chainId',
                inputs: [],
                outputs: [{ name: 'chainId', type: 'uint256' }],
            },
            {
                name: 'sender',
                inputs: [],
                outputs: [{ name: 'sender', type: 'address' }],
            },
            {
                name: 'initial_balance',
                inputs: [],
                outputs: [{ name: 'initial_balance', type: 'uint128' }],
            },
            {
                name: 'callback_recipient',
                inputs: [],
                outputs: [{ name: 'callback_recipient', type: 'uint160' }],
            },
            {
                name: 'callback_payload',
                inputs: [],
                outputs: [{ name: 'callback_payload', type: 'bytes' }],
            },
            {
                name: 'callback_strict',
                inputs: [],
                outputs: [{ name: 'callback_strict', type: 'bool' }],
            },
            {
                name: 'name',
                inputs: [],
                outputs: [{ name: 'name', type: 'string' }],
            },
            {
                name: 'symbol',
                inputs: [],
                outputs: [{ name: 'symbol', type: 'string' }],
            },
            {
                name: 'decimals',
                inputs: [],
                outputs: [{ name: 'decimals', type: 'uint8' }],
            },
            {
                name: 'expectedTokenWallet',
                inputs: [],
                outputs: [{ name: 'expectedTokenWallet', type: 'address' }],
            },
        ],
        data: [
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                    { name: 'signature', type: 'bytes' },
                ],
                outputs: [],
            },
            {
                name: 'Reject',
                inputs: [{ name: 'relay', type: 'uint256' }],
                outputs: [],
            },
            {
                name: 'Closed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Confirmed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Rejected',
                inputs: [{ name: 'reason', type: 'uint32' }],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { name: 'createdAt', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                name: 'eventInitData',
                type: 'tuple',
            },
            { name: 'signatures', type: 'map(uint256,bytes)' },
            { name: 'nonce', type: 'uint32' },
            { name: 'proxy', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'token', type: 'address' },
            { name: 'remainingGasTo', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'recipient', type: 'uint160' },
            { name: 'chainId', type: 'uint256' },
            { name: 'sender', type: 'address' },
            { name: 'initial_balance', type: 'uint128' },
            { name: 'callback_recipient', type: 'uint160' },
            { name: 'callback_payload', type: 'bytes' },
            { name: 'callback_strict', type: 'bool' },
            { name: 'name', type: 'string' },
            { name: 'symbol', type: 'string' },
            { name: 'decimals', type: 'uint8' },
            { name: 'expectedTokenWallet', type: 'address' },
        ],
    } as const

    static LegacyEverscaleEventAlien = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenMeta',
                inputs: [
                    { name: 'base_chainId_', type: 'uint256' },
                    { name: 'base_token_', type: 'uint160' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                ],
                outputs: [],
            },
            {
                name: 'receiveAlienTokenRoot',
                inputs: [{ name: 'token_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'proxy_', type: 'address' },
                    { name: 'token_', type: 'address' },
                    { name: 'remainingGasTo_', type: 'address' },
                    { name: 'amount_', type: 'uint128' },
                    { name: 'recipient_', type: 'uint160' },
                    { name: 'base_chainId_', type: 'uint256' },
                    { name: 'base_token_', type: 'uint160' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransactionLt', type: 'uint64' },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                    { name: 'signature', type: 'bytes' },
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransactionLt', type: 'uint64' },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: '_eventInitData',
                        type: 'tuple',
                    },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: '_signatures', type: 'bytes[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [{ name: 'keys', type: 'uint256[]' }],
                outputs: [],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [{ name: 'voters', type: 'uint256[]' }],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [{ name: 'vote', type: 'optional(uint8)' }],
            },
            {
                name: 'getApiVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint32' }],
            },
            {
                name: 'votes',
                inputs: [],
                outputs: [{ name: 'votes', type: 'map(uint256,uint8)' }],
            },
            {
                name: 'initializer',
                inputs: [],
                outputs: [{ name: 'initializer', type: 'address' }],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
            {
                name: 'requiredVotes',
                inputs: [],
                outputs: [{ name: 'requiredVotes', type: 'uint32' }],
            },
            {
                name: 'confirms',
                inputs: [],
                outputs: [{ name: 'confirms', type: 'uint16' }],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [{ name: 'rejects', type: 'uint16' }],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [{ name: 'relay_round', type: 'address' }],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [{ name: 'round_number', type: 'uint32' }],
            },
            {
                name: 'createdAt',
                inputs: [],
                outputs: [{ name: 'createdAt', type: 'uint32' }],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [{ name: 'signatures', type: 'map(uint256,bytes)' }],
            },
        ],
        data: [
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                    { name: 'signature', type: 'bytes' },
                ],
                outputs: [],
            },
            {
                name: 'Reject',
                inputs: [{ name: 'relay', type: 'uint256' }],
                outputs: [],
            },
            {
                name: 'Closed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Confirmed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Rejected',
                inputs: [{ name: 'reason', type: 'uint32' }],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { name: 'createdAt', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                name: 'eventInitData',
                type: 'tuple',
            },
            { name: 'signatures', type: 'map(uint256,bytes)' },
            { name: 'proxy', type: 'address' },
            { name: 'token', type: 'address' },
            { name: 'remainingGasTo', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'recipient', type: 'uint160' },
            { name: 'base_chainId', type: 'uint256' },
            { name: 'base_token', type: 'uint160' },
            { name: 'expectedToken', type: 'address' },
        ],
    } as const

    static LegacyEverscaleEventNative = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenName',
                inputs: [{ name: 'name_', type: 'string' }],
                outputs: [],
            },
            {
                name: 'receiveTokenSymbol',
                inputs: [{ name: 'symbol_', type: 'string' }],
                outputs: [],
            },
            {
                name: 'receiveTokenDecimals',
                inputs: [{ name: 'decimals_', type: 'uint8' }],
                outputs: [],
            },
            {
                name: 'receiveProxyTokenWallet',
                inputs: [{ name: 'tokenWallet_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'proxy_', type: 'address' },
                    { name: 'tokenWallet_', type: 'address' },
                    { name: 'token_', type: 'address' },
                    { name: 'remainingGasTo_', type: 'address' },
                    { name: 'amount_', type: 'uint128' },
                    { name: 'recipient_', type: 'uint160' },
                    { name: 'chainId_', type: 'uint256' },
                    { name: 'name_', type: 'string' },
                    { name: 'symbol_', type: 'string' },
                    { name: 'decimals_', type: 'uint8' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransactionLt', type: 'uint64' },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                    { name: 'signature', type: 'bytes' },
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransactionLt', type: 'uint64' },
                                    { name: 'eventTimestamp', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: '_eventInitData',
                        type: 'tuple',
                    },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: '_signatures', type: 'bytes[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [{ name: 'keys', type: 'uint256[]' }],
                outputs: [],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [{ name: 'voters', type: 'uint256[]' }],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [{ name: 'vote', type: 'optional(uint8)' }],
            },
            {
                name: 'getApiVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint32' }],
            },
            {
                name: 'votes',
                inputs: [],
                outputs: [{ name: 'votes', type: 'map(uint256,uint8)' }],
            },
            {
                name: 'initializer',
                inputs: [],
                outputs: [{ name: 'initializer', type: 'address' }],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
            {
                name: 'requiredVotes',
                inputs: [],
                outputs: [{ name: 'requiredVotes', type: 'uint32' }],
            },
            {
                name: 'confirms',
                inputs: [],
                outputs: [{ name: 'confirms', type: 'uint16' }],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [{ name: 'rejects', type: 'uint16' }],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [{ name: 'relay_round', type: 'address' }],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [{ name: 'round_number', type: 'uint32' }],
            },
            {
                name: 'createdAt',
                inputs: [],
                outputs: [{ name: 'createdAt', type: 'uint32' }],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [{ name: 'signatures', type: 'map(uint256,bytes)' }],
            },
        ],
        data: [
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                    { name: 'signature', type: 'bytes' },
                ],
                outputs: [],
            },
            {
                name: 'Reject',
                inputs: [{ name: 'relay', type: 'uint256' }],
                outputs: [],
            },
            {
                name: 'Closed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Confirmed',
                inputs: [],
                outputs: [],
            },
            {
                name: 'Rejected',
                inputs: [{ name: 'reason', type: 'uint32' }],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { name: 'createdAt', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'voteData',
                        type: 'tuple',
                    },
                    { name: 'configuration', type: 'address' },
                    { name: 'staking', type: 'address' },
                ],
                name: 'eventInitData',
                type: 'tuple',
            },
            { name: 'signatures', type: 'map(uint256,bytes)' },
            { name: 'proxy', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'token', type: 'address' },
            { name: 'remainingGasTo', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'recipient', type: 'uint160' },
            { name: 'chainId', type: 'uint256' },
            { name: 'name', type: 'string' },
            { name: 'symbol', type: 'string' },
            { name: 'decimals', type: 'uint8' },
            { name: 'expectedTokenWallet', type: 'address' },
        ],
    } as const

    static MergePool = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time'],
        functions: [
            {
                name: 'constructor',
                inputs: [],
                outputs: [],
            },
            {
                name: 'acceptUpgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'newVersion', type: 'uint8' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenDecimals',
                inputs: [{ name: 'decimals', type: 'uint8' }],
                outputs: [],
            },
            {
                name: 'setManager',
                inputs: [{ name: '_manager', type: 'address' }],
                outputs: [],
            },
            {
                name: 'removeToken',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'addToken',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'setCanon',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'enableToken',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'enableAll',
                inputs: [],
                outputs: [],
            },
            {
                name: 'disableToken',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [],
            },
            {
                name: 'disableAll',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getCanon',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'value0', type: 'address' },
                    {
                        components: [
                            { name: 'decimals', type: 'uint8' },
                            { name: 'enabled', type: 'bool' },
                        ],
                        name: 'value1',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'getTokens',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'decimals', type: 'uint8' },
                            { name: 'enabled', type: 'bool' },
                        ],
                        name: '_tokens',
                        type: 'map(address,tuple)',
                    },
                    { name: '_canon', type: 'address' },
                ],
            },
            {
                name: 'onAcceptTokensBurn',
                inputs: [
                    { name: '_amount', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'value2', type: 'address' },
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
                name: 'owner',
                inputs: [],
                outputs: [{ name: 'owner', type: 'address' }],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [{ name: '_randomNonce', type: 'uint256' }],
            },
            {
                name: 'version',
                inputs: [],
                outputs: [{ name: 'version', type: 'uint8' }],
            },
            {
                name: 'manager',
                inputs: [],
                outputs: [{ name: 'manager', type: 'address' }],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
            { key: 2, name: 'proxy', type: 'address' },
        ],
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
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'proxy', type: 'address' },
            { name: 'version', type: 'uint8' },
            {
                components: [
                    { name: 'decimals', type: 'uint8' },
                    { name: 'enabled', type: 'bool' },
                ],
                name: 'tokens',
                type: 'map(address,tuple)',
            },
            { name: 'manager', type: 'address' },
            { name: 'canon', type: 'address' },
        ],
    } as const

    static MergeRouter = {
        'ABI version': 2,
        data: [
            {
                key: 1,
                name: 'proxy',
                type: 'address',
            },
            {
                key: 2,
                name: 'token',
                type: 'address',
            },
        ],
        events: [
            {
                inputs: [
                    {
                        name: 'previousOwner',
                        type: 'address',
                    },
                    {
                        name: 'newOwner',
                        type: 'address',
                    },
                ],
                name: 'OwnershipTransferred',
                outputs: [],
            },
        ],
        fields: [
            {
                name: '_pubkey',
                type: 'uint256',
            },
            {
                name: '_timestamp',
                type: 'uint64',
            },
            {
                name: '_constructorFlag',
                type: 'bool',
            },
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'proxy',
                type: 'address',
            },
            {
                name: 'token',
                type: 'address',
            },
            {
                name: 'pool',
                type: 'address',
            },
            {
                name: 'manager',
                type: 'address',
            },
        ],
        functions: [
            {
                inputs: [
                    {
                        name: '_owner',
                        type: 'address',
                    },
                    {
                        name: '_manager',
                        type: 'address',
                    },
                ],
                name: 'constructor',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'pool_',
                        type: 'address',
                    },
                ],
                name: 'setPool',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: '_manager',
                        type: 'address',
                    },
                ],
                name: 'setManager',
                outputs: [],
            },
            {
                inputs: [],
                name: 'disablePool',
                outputs: [],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getPool',
                outputs: [
                    {
                        name: 'value0',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'answerId',
                        type: 'uint32',
                    },
                ],
                name: 'getDetails',
                outputs: [
                    {
                        name: '_proxy',
                        type: 'address',
                    },
                    {
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_pool',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [
                    {
                        name: 'newOwner',
                        type: 'address',
                    },
                ],
                name: 'transferOwnership',
                outputs: [],
            },
            {
                inputs: [],
                name: 'renounceOwnership',
                outputs: [],
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [
                    {
                        name: 'owner',
                        type: 'address',
                    },
                ],
            },
            {
                inputs: [],
                name: 'manager',
                outputs: [
                    {
                        name: 'manager',
                        type: 'address',
                    },
                ],
            },
        ],
        header: ['pubkey', 'time', 'expire'],
        version: '2.2',
    } as const

    static NativeProxy = {
        'ABI version': 2,
        version: '2.2',
        header: ['time'],
        functions: [
            {
                name: 'constructor',
                inputs: [{ name: 'owner_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [{ name: 'code', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'onEventConfirmedExtended',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        name: 'eventTransaction',
                                        type: 'uint256',
                                    },
                                    { name: 'eventIndex', type: 'uint32' },
                                    { name: 'eventData', type: 'cell' },
                                    { name: 'eventBlockNumber', type: 'uint32' },
                                    { name: 'eventBlock', type: 'uint256' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                            { name: 'chainId', type: 'uint32' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onSolanaEventConfirmedExtended',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'accountSeed', type: 'uint128' },
                                    { name: 'slot', type: 'uint64' },
                                    { name: 'blockTime', type: 'uint64' },
                                    { name: 'txSignature', type: 'string' },
                                    { name: 'eventData', type: 'cell' },
                                ],
                                name: 'voteData',
                                type: 'tuple',
                            },
                            { name: 'configuration', type: 'address' },
                            { name: 'staking', type: 'address' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: 'tokenRoot', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'value2', type: 'address' },
                    { name: 'value3', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'transferPayload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'getConfiguration',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'evmConfigurations', type: 'address[]' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'solanaConfiguration', type: 'address' },
                        ],
                        name: 'value1',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'setEVMConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'evmConfigurations', type: 'address[]' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setSolanaConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'everscaleConfiguration', type: 'address' },
                            { name: 'solanaConfiguration', type: 'address' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'sendMessage',
                inputs: [
                    { name: 'recipient', type: 'address' },
                    { name: 'message', type: 'cell' },
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
                name: 'owner',
                inputs: [],
                outputs: [{ name: 'owner', type: 'address' }],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [{ name: '_randomNonce', type: 'uint256' }],
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
            {
                name: 'SolanaNativeTransfer',
                inputs: [
                    { name: 'base_token', type: 'uint256' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'sol_amount', type: 'uint64' },
                    { name: 'recipient', type: 'address' },
                    { name: 'payload', type: 'bytes' },
                ],
                outputs: [],
            },
            {
                name: 'EVMNativeTransfer',
                inputs: [
                    { name: 'token_wid', type: 'int8' },
                    { name: 'token_addr', type: 'uint256' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            {
                components: [
                    { name: 'everscaleConfiguration', type: 'address' },
                    { name: 'evmConfigurations', type: 'address[]' },
                ],
                name: 'evmConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'everscaleConfiguration', type: 'address' },
                    { name: 'solanaConfiguration', type: 'address' },
                ],
                name: 'solanaConfiguration',
                type: 'tuple',
            },
            { name: 'api_version', type: 'uint8' },
            { name: '_randomNonce', type: 'uint256' },
        ],
    } as const

    static TokenRootAlienEvm = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'initialSupplyTo', type: 'address' },
                    { name: 'initialSupply', type: 'uint128' },
                    { name: 'deployWalletValue', type: 'uint128' },
                    { name: 'mintDisabled', type: 'bool' },
                    { name: 'burnByRootDisabled', type: 'bool' },
                    { name: 'burnPaused', type: 'bool' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'meta',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'base_chainId', type: 'uint256' },
                    { name: 'base_token', type: 'uint160' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                ],
            },
            {
                name: 'supportsInterface',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'interfaceID', type: 'uint32' },
                ],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'walletVersion',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint32' }],
            },
            {
                name: 'platformCode',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'cell' }],
            },
            {
                name: 'requestUpgradeWallet',
                inputs: [
                    { name: 'currentVersion', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setWalletCode',
                inputs: [{ name: 'code', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [{ name: 'code', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'disableMint',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'mintDisabled',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'burnTokens',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'callbackTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'disableBurnByRoot',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'burnByRootDisabled',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'burnPaused',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'setBurnPaused',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'paused', type: 'bool' },
                ],
                outputs: [{ name: 'value0', type: 'bool' }],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    {
                        components: [
                            { name: 'value', type: 'uint128' },
                            { name: 'payload', type: 'cell' },
                        ],
                        name: 'callbacks',
                        type: 'map(address,tuple)',
                    },
                ],
                outputs: [],
            },
            {
                name: 'name',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'string' }],
            },
            {
                name: 'symbol',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'string' }],
            },
            {
                name: 'decimals',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint8' }],
            },
            {
                name: 'totalSupply',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'uint128' }],
            },
            {
                name: 'walletCode',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'cell' }],
            },
            {
                name: 'rootOwner',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'walletOf',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                ],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'deployWallet',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'deployWalletValue', type: 'uint128' },
                ],
                outputs: [{ name: 'tokenWallet', type: 'address' }],
            },
            {
                name: 'mint',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
                    { name: 'deployWalletValue', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'notify', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'acceptBurn',
                id: '0x192B51B1',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'callbackTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'sendSurplusGas',
                inputs: [{ name: 'to', type: 'address' }],
                outputs: [],
            },
        ],
        data: [
            { key: 1, name: 'name_', type: 'string' },
            { key: 2, name: 'symbol_', type: 'string' },
            { key: 3, name: 'decimals_', type: 'uint8' },
            { key: 4, name: 'rootOwner_', type: 'address' },
            { key: 5, name: 'walletCode_', type: 'cell' },
            { key: 6, name: 'randomNonce_', type: 'uint256' },
            { key: 7, name: 'deployer_', type: 'address' },
            { key: 8, name: 'platformCode_', type: 'cell' },
            { key: 9, name: 'base_chainId_', type: 'uint256' },
            { key: 10, name: 'base_token_', type: 'uint160' },
        ],
        events: [],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'name_', type: 'string' },
            { name: 'symbol_', type: 'string' },
            { name: 'decimals_', type: 'uint8' },
            { name: 'rootOwner_', type: 'address' },
            { name: 'walletCode_', type: 'cell' },
            { name: 'totalSupply_', type: 'uint128' },
            { name: 'burnPaused_', type: 'bool' },
            { name: 'burnByRootDisabled_', type: 'bool' },
            { name: 'mintDisabled_', type: 'bool' },
            { name: 'randomNonce_', type: 'uint256' },
            { name: 'deployer_', type: 'address' },
            { name: 'platformCode_', type: 'cell' },
            { name: 'walletVersion_', type: 'uint32' },
            { name: 'base_chainId_', type: 'uint256' },
            { name: 'base_token_', type: 'uint160' },
        ],
    } as const

}
