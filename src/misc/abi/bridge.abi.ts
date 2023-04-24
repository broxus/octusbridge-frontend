export abstract class BridgeAbi {

    static EthereumEverscaleEventConfiguration = {
        'ABI version': 2,
        version: '2.2',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMeta',
                inputs: [{ name: '_meta', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'setEndBlockNumber',
                inputs: [{ name: 'endBlockNumber', type: 'uint32' }],
                outputs: [],
            },
            {
                name: 'setFlags',
                inputs: [{ name: '_flags', type: 'uint64' }],
                outputs: [],
            },
            {
                name: 'setEventInitialBalance',
                inputs: [{ name: 'eventInitialBalance', type: 'uint64' }],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [
                    {
                        components: [
                            { name: 'eventTransaction', type: 'uint256' },
                            { name: 'eventIndex', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                            { name: 'eventBlockNumber', type: 'uint32' },
                            { name: 'eventBlock', type: 'uint256' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'deployEvents',
                inputs: [
                    {
                        components: [
                            { name: 'eventTransaction', type: 'uint256' },
                            { name: 'eventIndex', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                            { name: 'eventBlockNumber', type: 'uint32' },
                            { name: 'eventBlock', type: 'uint256' },
                        ],
                        name: 'eventsVoteData',
                        type: 'tuple[]',
                    },
                    { name: 'values', type: 'uint128[]' },
                ],
                outputs: [],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    {
                        components: [
                            { name: 'eventTransaction', type: 'uint256' },
                            { name: 'eventIndex', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                            { name: 'eventBlockNumber', type: 'uint32' },
                            { name: 'eventBlock', type: 'uint256' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [{ name: 'eventContract', type: 'address' }],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: '_basicConfiguration',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'chainId', type: 'uint32' },
                            { name: 'eventEmitter', type: 'uint160' },
                            { name: 'eventBlocksToConfirm', type: 'uint16' },
                            { name: 'proxy', type: 'address' },
                            { name: 'startBlockNumber', type: 'uint32' },
                            { name: 'endBlockNumber', type: 'uint32' },
                        ],
                        name: '_networkConfiguration',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_type', type: 'uint8' }],
            },
            {
                name: 'getFlags',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_flags', type: 'uint64' }],
            },
            {
                name: 'onEventConfirmed',
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
                        name: 'eventInitData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
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
                        name: 'eventInitData',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                    { name: 'gasBackAddress', type: 'address' },
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
                name: 'basicConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: 'basicConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'chainId', type: 'uint32' },
                            { name: 'eventEmitter', type: 'uint160' },
                            { name: 'eventBlocksToConfirm', type: 'uint16' },
                            { name: 'proxy', type: 'address' },
                            { name: 'startBlockNumber', type: 'uint32' },
                            { name: 'endBlockNumber', type: 'uint32' },
                        ],
                        name: 'networkConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'flags',
                inputs: [],
                outputs: [{ name: 'flags', type: 'uint64' }],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
        ],
        data: [
            {
                components: [
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                key: 1,
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'chainId', type: 'uint32' },
                    { name: 'eventEmitter', type: 'uint160' },
                    { name: 'eventBlocksToConfirm', type: 'uint16' },
                    { name: 'proxy', type: 'address' },
                    { name: 'startBlockNumber', type: 'uint32' },
                    { name: 'endBlockNumber', type: 'uint32' },
                ],
                key: 2,
                name: 'networkConfiguration',
                type: 'tuple',
            },
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
            {
                name: 'NewEventContract',
                inputs: [{ name: 'eventContract', type: 'address' }],
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
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'chainId', type: 'uint32' },
                    { name: 'eventEmitter', type: 'uint160' },
                    { name: 'eventBlocksToConfirm', type: 'uint16' },
                    { name: 'proxy', type: 'address' },
                    { name: 'startBlockNumber', type: 'uint32' },
                    { name: 'endBlockNumber', type: 'uint32' },
                ],
                name: 'networkConfiguration',
                type: 'tuple',
            },
            { name: 'flags', type: 'uint64' },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static EverscaleEthereumEventConfiguration = {
        'ABI version': 2,
        version: '2.2',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMeta',
                inputs: [{ name: '_meta', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'setEndTimestamp',
                inputs: [{ name: 'endTimestamp', type: 'uint32' }],
                outputs: [],
            },
            {
                name: 'setFlags',
                inputs: [{ name: '_flags', type: 'uint64' }],
                outputs: [],
            },
            {
                name: 'setEventInitialBalance',
                inputs: [{ name: 'eventInitialBalance', type: 'uint64' }],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [{ name: 'eventContract', type: 'address' }],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: '_basicConfiguration',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'eventEmitter', type: 'address' },
                            { name: 'proxy', type: 'uint160' },
                            { name: 'startTimestamp', type: 'uint32' },
                            { name: 'endTimestamp', type: 'uint32' },
                        ],
                        name: '_networkConfiguration',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_type', type: 'uint8' }],
            },
            {
                name: 'getFlags',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_flags', type: 'uint64' }],
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
                name: 'basicConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: 'basicConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'eventEmitter', type: 'address' },
                            { name: 'proxy', type: 'uint160' },
                            { name: 'startTimestamp', type: 'uint32' },
                            { name: 'endTimestamp', type: 'uint32' },
                        ],
                        name: 'networkConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
            {
                name: 'flags',
                inputs: [],
                outputs: [{ name: 'flags', type: 'uint64' }],
            },
        ],
        data: [
            {
                components: [
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                key: 1,
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'eventEmitter', type: 'address' },
                    { name: 'proxy', type: 'uint160' },
                    { name: 'startTimestamp', type: 'uint32' },
                    { name: 'endTimestamp', type: 'uint32' },
                ],
                key: 2,
                name: 'networkConfiguration',
                type: 'tuple',
            },
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
            {
                name: 'NewEventContract',
                inputs: [{ name: 'eventContract', type: 'address' }],
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
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'eventEmitter', type: 'address' },
                    { name: 'proxy', type: 'uint160' },
                    { name: 'startTimestamp', type: 'uint32' },
                    { name: 'endTimestamp', type: 'uint32' },
                ],
                name: 'networkConfiguration',
                type: 'tuple',
            },
            { name: 'meta', type: 'cell' },
            { name: 'flags', type: 'uint64' },
        ],
    } as const

    static EverscaleProxyTokenTransfer = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [{ name: 'owner_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [],
                outputs: [{ name: 'API_VERSION', type: 'string' }],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [{ name: 'wallet', type: 'address' }],
                outputs: [],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransaction', type: 'uint256' },
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
                        name: 'eventData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
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
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'root', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                            { name: 'settingsTransferGrams', type: 'uint128' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: '_owner', type: 'address' },
                    { name: '_received_count', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                    { name: '_token_wallet', type: 'address' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'getConfiguration',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'root', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                            { name: 'settingsTransferGrams', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'root', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                            { name: 'settingsTransferGrams', type: 'uint128' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
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
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeEverscaleEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
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
                name: 'token_wallet',
                inputs: [],
                outputs: [{ name: 'token_wallet', type: 'address' }],
            },
        ],
        data: [{ key: 1, name: '_randomNonce', type: 'uint256' }],
        events: [
            {
                name: 'Withdraw',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [],
            },
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
                    { name: 'tonConfiguration', type: 'address' },
                    { name: 'ethereumConfigurations', type: 'address[]' },
                    { name: 'root', type: 'address' },
                    { name: 'settingsDeployWalletGrams', type: 'uint128' },
                    { name: 'settingsTransferGrams', type: 'uint128' },
                ],
                name: 'config',
                type: 'tuple',
            },
            { name: 'received_count', type: 'uint128' },
            { name: 'transferred_count', type: 'uint128' },
            { name: 'token_wallet', type: 'address' },
        ],
    } as const

    static EthereumProxyTokenTransfer = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [{ name: 'owner_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransaction', type: 'uint256' },
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
                        name: 'eventData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensBurn',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'value2', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'uint128' },
                    { name: 'value3', type: 'bool' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'getConfiguration',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'tonConfiguration', type: 'address' },
                            { name: 'ethereumConfigurations', type: 'address[]' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'transferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'legacyTransferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
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
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeEverscaleEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
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
        ],
        data: [{ key: 1, name: '_randomNonce', type: 'uint256' }],
        events: [
            {
                name: 'Withdraw',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [],
            },
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
                    { name: 'tonConfiguration', type: 'address' },
                    { name: 'ethereumConfigurations', type: 'address[]' },
                    { name: 'outdatedTokenRoots', type: 'address[]' },
                    { name: 'tokenRoot', type: 'address' },
                    { name: 'settingsDeployWalletGrams', type: 'uint128' },
                ],
                name: 'config',
                type: 'tuple',
            },
            { name: 'burnedCount', type: 'uint128' },
            { name: 'paused', type: 'bool' },
        ],
    } as const

    static TokenTransferEthereumEverscaleEvent = {
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
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                    { name: 'owner_address', type: 'address' },
                ],
            },
            {
                name: 'encodeEthereumEverscaleEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeSolanaEverscaleEventData',
                inputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'decodeSolanaEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEverscaleEthereumEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeEverscaleSolanaEventData',
                inputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'decodeEverscaleSolanaEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
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
                ],
            },
            {
                name: 'confirm',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
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
                        name: '_eventInitData',
                        type: 'tuple',
                    },
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
        ],
        data: [
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransaction', type: 'uint256' },
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
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [{ name: 'relay', type: 'uint256' }],
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
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransaction', type: 'uint256' },
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
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
    } as const

    static TokenTransferEverscaleEthereumEvent = {
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
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'owner_address', type: 'address' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'encodeEthereumEverscaleEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeSolanaEverscaleEventData',
                inputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'decodeSolanaEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEverscaleEthereumEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeEverscaleSolanaEventData',
                inputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'decodeEverscaleSolanaEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
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
        ],
    } as const

    static EverscaleSolanaEventConfiguration = {
        'ABI version': 2,
        version: '2.2',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMeta',
                inputs: [{ name: '_meta', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'setEndTimestamp',
                inputs: [{ name: 'endTimestamp', type: 'uint32' }],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            {
                                components: [
                                    { name: 'account', type: 'uint256' },
                                    { name: 'readOnly', type: 'bool' },
                                    { name: 'isSigner', type: 'bool' },
                                ],
                                name: 'executeAccounts',
                                type: 'tuple[]',
                            },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            {
                                components: [
                                    { name: 'account', type: 'uint256' },
                                    { name: 'readOnly', type: 'bool' },
                                    { name: 'isSigner', type: 'bool' },
                                ],
                                name: 'executeAccounts',
                                type: 'tuple[]',
                            },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [{ name: 'eventContract', type: 'address' }],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: '_basicConfiguration',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'program', type: 'uint256' },
                            { name: 'settings', type: 'uint256' },
                            { name: 'eventEmitter', type: 'address' },
                            { name: 'instruction', type: 'uint8' },
                            { name: 'startTimestamp', type: 'uint32' },
                            { name: 'endTimestamp', type: 'uint32' },
                            { name: 'executeNeeded', type: 'bool' },
                            { name: 'executeInstruction', type: 'uint8' },
                        ],
                        name: '_networkConfiguration',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_type', type: 'uint8' }],
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
                name: 'basicConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: 'basicConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'program', type: 'uint256' },
                            { name: 'settings', type: 'uint256' },
                            { name: 'eventEmitter', type: 'address' },
                            { name: 'instruction', type: 'uint8' },
                            { name: 'startTimestamp', type: 'uint32' },
                            { name: 'endTimestamp', type: 'uint32' },
                            { name: 'executeNeeded', type: 'bool' },
                            { name: 'executeInstruction', type: 'uint8' },
                        ],
                        name: 'networkConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
        ],
        data: [
            {
                components: [
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                key: 1,
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'program', type: 'uint256' },
                    { name: 'settings', type: 'uint256' },
                    { name: 'eventEmitter', type: 'address' },
                    { name: 'instruction', type: 'uint8' },
                    { name: 'startTimestamp', type: 'uint32' },
                    { name: 'endTimestamp', type: 'uint32' },
                    { name: 'executeNeeded', type: 'bool' },
                    { name: 'executeInstruction', type: 'uint8' },
                ],
                key: 2,
                name: 'networkConfiguration',
                type: 'tuple',
            },
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
            {
                name: 'NewEventContract',
                inputs: [{ name: 'eventContract', type: 'address' }],
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
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'program', type: 'uint256' },
                    { name: 'settings', type: 'uint256' },
                    { name: 'eventEmitter', type: 'address' },
                    { name: 'instruction', type: 'uint8' },
                    { name: 'startTimestamp', type: 'uint32' },
                    { name: 'endTimestamp', type: 'uint32' },
                    { name: 'executeNeeded', type: 'bool' },
                    { name: 'executeInstruction', type: 'uint8' },
                ],
                name: 'networkConfiguration',
                type: 'tuple',
            },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static SolanaEverscaleEventConfiguration = {
        'ABI version': 2,
        version: '2.2',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMeta',
                inputs: [{ name: '_meta', type: 'cell' }],
                outputs: [],
            },
            {
                name: 'setEndTimestamp',
                inputs: [{ name: 'endTimestamp', type: 'uint64' }],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [
                    {
                        components: [
                            { name: 'accountSeed', type: 'uint128' },
                            { name: 'slot', type: 'uint64' },
                            { name: 'blockTime', type: 'uint64' },
                            { name: 'txSignature', type: 'string' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    {
                        components: [
                            { name: 'accountSeed', type: 'uint128' },
                            { name: 'slot', type: 'uint64' },
                            { name: 'blockTime', type: 'uint64' },
                            { name: 'txSignature', type: 'string' },
                            { name: 'eventData', type: 'cell' },
                        ],
                        name: 'eventVoteData',
                        type: 'tuple',
                    },
                ],
                outputs: [{ name: 'eventContract', type: 'address' }],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: '_basicConfiguration',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { name: 'program', type: 'uint256' },
                            { name: 'settings', type: 'uint256' },
                            { name: 'proxy', type: 'address' },
                            { name: 'startTimestamp', type: 'uint64' },
                            { name: 'endTimestamp', type: 'uint64' },
                        ],
                        name: '_networkConfiguration',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: '_type', type: 'uint8' }],
            },
            {
                name: 'onSolanaEventConfirmed',
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
                        name: 'eventInitData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
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
                        name: 'eventInitData',
                        type: 'tuple',
                    },
                    { name: '_meta', type: 'cell' },
                    { name: 'gasBackAddress', type: 'address' },
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
                name: 'basicConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'eventABI', type: 'bytes' },
                            { name: 'staking', type: 'address' },
                            { name: 'eventInitialBalance', type: 'uint64' },
                            { name: 'eventCode', type: 'cell' },
                        ],
                        name: 'basicConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [],
                outputs: [
                    {
                        components: [
                            { name: 'program', type: 'uint256' },
                            { name: 'settings', type: 'uint256' },
                            { name: 'proxy', type: 'address' },
                            { name: 'startTimestamp', type: 'uint64' },
                            { name: 'endTimestamp', type: 'uint64' },
                        ],
                        name: 'networkConfiguration',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [{ name: 'meta', type: 'cell' }],
            },
        ],
        data: [
            {
                components: [
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                key: 1,
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'program', type: 'uint256' },
                    { name: 'settings', type: 'uint256' },
                    { name: 'proxy', type: 'address' },
                    { name: 'startTimestamp', type: 'uint64' },
                    { name: 'endTimestamp', type: 'uint64' },
                ],
                key: 2,
                name: 'networkConfiguration',
                type: 'tuple',
            },
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
            {
                name: 'NewEventContract',
                inputs: [{ name: 'eventContract', type: 'address' }],
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
                    { name: 'eventABI', type: 'bytes' },
                    { name: 'staking', type: 'address' },
                    { name: 'eventInitialBalance', type: 'uint64' },
                    { name: 'eventCode', type: 'cell' },
                ],
                name: 'basicConfiguration',
                type: 'tuple',
            },
            {
                components: [
                    { name: 'program', type: 'uint256' },
                    { name: 'settings', type: 'uint256' },
                    { name: 'proxy', type: 'address' },
                    { name: 'startTimestamp', type: 'uint64' },
                    { name: 'endTimestamp', type: 'uint64' },
                ],
                name: 'networkConfiguration',
                type: 'tuple',
            },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static SolanaProxyTokenTransfer = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [{ name: 'owner_', type: 'address' }],
                outputs: [],
            },
            {
                name: 'onSolanaEventConfirmed',
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
                        name: 'eventData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    {
                        components: [
                            {
                                components: [
                                    { name: 'eventTransaction', type: 'uint256' },
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
                        name: 'eventData',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensBurn',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'value2', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'everscaleEthereumConfiguration', type: 'address' },
                            { name: 'ethereumEverscaleConfigurations', type: 'address[]' },
                            { name: 'everscaleSolanaConfiguration', type: 'address' },
                            { name: 'solanaEverscaleConfiguration', type: 'address' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'uint128' },
                    { name: 'value3', type: 'bool' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [{ name: 'value0', type: 'address' }],
            },
            {
                name: 'getConfiguration',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    {
                        components: [
                            { name: 'everscaleEthereumConfiguration', type: 'address' },
                            { name: 'ethereumEverscaleConfigurations', type: 'address[]' },
                            { name: 'everscaleSolanaConfiguration', type: 'address' },
                            { name: 'solanaEverscaleConfiguration', type: 'address' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    {
                        components: [
                            { name: 'everscaleEthereumConfiguration', type: 'address' },
                            { name: 'ethereumEverscaleConfigurations', type: 'address[]' },
                            { name: 'everscaleSolanaConfiguration', type: 'address' },
                            { name: 'solanaEverscaleConfiguration', type: 'address' },
                            { name: 'tokenRoot', type: 'address' },
                            { name: 'outdatedTokenRoots', type: 'address[]' },
                            { name: 'settingsDeployWalletGrams', type: 'uint128' },
                        ],
                        name: '_config',
                        type: 'tuple',
                    },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'transferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'legacyTransferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [{ name: 'code', type: 'cell' }],
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
                name: 'encodeEthereumEverscaleEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeSolanaEverscaleEventData',
                inputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'decodeSolanaEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEverscaleEthereumEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeEverscaleSolanaEventData',
                inputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'decodeEverscaleSolanaEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
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
                name: 'WithdrawSolana',
                inputs: [
                    { name: 'addr', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solana_addr', type: 'uint256' },
                ],
                outputs: [],
            },
            {
                name: 'WithdrawEthereum',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
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
                    { name: 'everscaleEthereumConfiguration', type: 'address' },
                    { name: 'ethereumEverscaleConfigurations', type: 'address[]' },
                    { name: 'everscaleSolanaConfiguration', type: 'address' },
                    { name: 'solanaEverscaleConfiguration', type: 'address' },
                    { name: 'tokenRoot', type: 'address' },
                    { name: 'outdatedTokenRoots', type: 'address[]' },
                    { name: 'settingsDeployWalletGrams', type: 'uint128' },
                ],
                name: 'config',
                type: 'tuple',
            },
            { name: 'burnedCount', type: 'uint128' },
            { name: 'mintedCount', type: 'uint128' },
            { name: 'paused', type: 'bool' },
        ],
    } as const

    static TokenTransferEverscaleSolanaEvent = {
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
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
            },
            {
                name: 'encodeEthereumEverscaleEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeSolanaEverscaleEventData',
                inputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'decodeSolanaEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEverscaleEthereumEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeEverscaleSolanaEventData',
                inputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'decodeEverscaleSolanaEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
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
                                    {
                                        components: [
                                            { name: 'account', type: 'uint256' },
                                            { name: 'readOnly', type: 'bool' },
                                            { name: 'isSigner', type: 'bool' },
                                        ],
                                        name: 'executeAccounts',
                                        type: 'tuple[]',
                                    },
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
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
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
                                    {
                                        components: [
                                            { name: 'account', type: 'uint256' },
                                            { name: 'readOnly', type: 'bool' },
                                            { name: 'isSigner', type: 'bool' },
                                        ],
                                        name: 'executeAccounts',
                                        type: 'tuple[]',
                                    },
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
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
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
                name: 'status',
                inputs: [],
                outputs: [{ name: 'status', type: 'uint8' }],
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
        ],
        data: [
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            {
                                components: [
                                    { name: 'account', type: 'uint256' },
                                    { name: 'readOnly', type: 'bool' },
                                    { name: 'isSigner', type: 'bool' },
                                ],
                                name: 'executeAccounts',
                                type: 'tuple[]',
                            },
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
                inputs: [{ name: 'relay', type: 'uint256' }],
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
            { name: 'createdAt', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { name: 'eventTransactionLt', type: 'uint64' },
                            { name: 'eventTimestamp', type: 'uint32' },
                            {
                                components: [
                                    { name: 'account', type: 'uint256' },
                                    { name: 'readOnly', type: 'bool' },
                                    { name: 'isSigner', type: 'bool' },
                                ],
                                name: 'executeAccounts',
                                type: 'tuple[]',
                            },
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
        ],
    } as const

    static TokenTransferSolanaEverscaleEvent = {
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
                name: 'getDecodedData',
                inputs: [{ name: 'answerId', type: 'uint32' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEthereumEverscaleEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeSolanaEverscaleEventData',
                inputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEthereumEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'decodeSolanaEverscaleEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'sender_addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'receiver_addr', type: 'address' },
                ],
            },
            {
                name: 'encodeEverscaleEthereumEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'encodeEverscaleSolanaEventData',
                inputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
                ],
                outputs: [{ name: 'data', type: 'cell' }],
            },
            {
                name: 'decodeEverscaleEthereumEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'decodeEverscaleSolanaEventData',
                inputs: [{ name: 'data', type: 'cell' }],
                outputs: [
                    { name: 'senderAddress', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'solanaOwnerAddress', type: 'uint256' },
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
                ],
            },
            {
                name: 'confirm',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
                outputs: [],
            },
            {
                name: 'reject',
                inputs: [{ name: 'voteReceiver', type: 'address' }],
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
                        name: '_eventInitData',
                        type: 'tuple',
                    },
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
                name: 'status',
                inputs: [],
                outputs: [{ name: 'status', type: 'uint8' }],
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
        ],
        data: [
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
                key: 1,
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [{ name: 'relay', type: 'uint256' }],
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
                name: 'eventInitData',
                type: 'tuple',
            },
        ],
    } as const

}
