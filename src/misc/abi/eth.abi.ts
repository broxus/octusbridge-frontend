import type { AbiItem } from 'web3-utils'

export abstract class EthAbi {

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
                    indexed: false,
                    internalType: 'struct IEverscale.EverscaleAddress',
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
            name: 'decodeEverscaleEvent',
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
                    internalType: 'struct IEverscale.EverscaleEvent',
                    name: '_event',
                    type: 'tuple',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_roundRelaysConfiguration',
                    type: 'tuple',
                },
            ],
            name: 'setConfiguration',
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
            name: 'verifySignedEverscaleEvent',
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
    ]

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
    ]

    static MultiVault: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'base_chainId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint160',
                    name: 'base_token',
                    type: 'uint160',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'symbol',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'uint8',
                    name: 'decimals',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'recipient_wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipient_addr',
                    type: 'uint256',
                },
            ],
            name: 'AlienTransfer',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'BlacklistTokenAdded',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'BlacklistTokenRemoved',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum IMultiVault.TokenType',
                    name: '_type',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'sender',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'recipient_wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipient_addr',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'Deposit',
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
                    indexed: false,
                    internalType: 'int8',
                    name: 'native_wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'native_addr',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'recipient_wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipient_addr',
                    type: 'uint256',
                },
            ],
            name: 'NativeTransfer',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'governance',
                    type: 'address',
                },
            ],
            name: 'NewPendingGovernance',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'skim_to_everscale',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'SkimFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'activation',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'isNative',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'depositFee',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'withdrawFee',
                    type: 'uint256',
                },
            ],
            name: 'TokenActivated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'native_wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'native_addr',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'name_prefix',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'symbol_prefix',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'name',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'symbol',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'uint8',
                    name: 'decimals',
                    type: 'uint8',
                },
            ],
            name: 'TokenCreated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'vault',
                    type: 'address',
                },
            ],
            name: 'TokenMigrated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'bridge',
                    type: 'address',
                },
            ],
            name: 'UpdateBridge',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum IMultiVault.TokenType',
                    name: '_type',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'UpdateConfiguration',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDefaultAlienDepositFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDefaultAlienWithdrawFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDefaultNativeDepositFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDefaultNativeWithdrawFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'governance',
                    type: 'address',
                },
            ],
            name: 'UpdateGovernance',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'guardian',
                    type: 'address',
                },
            ],
            name: 'UpdateGuardian',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'management',
                    type: 'address',
                },
            ],
            name: 'UpdateManagement',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'UpdateRewards',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTokenDepositFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'name_prefix',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'symbol_prefix',
                    type: 'string',
                },
            ],
            name: 'UpdateTokenPrefix',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTokenWithdrawFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum IMultiVault.TokenType',
                    name: '_type',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'payloadId',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'Withdraw',
            type: 'event',
        },
        {
            inputs: [],
            name: 'acceptGovernance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'blacklistAddToken',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'blacklistRemoveToken',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'bridge',
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
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
                {
                    internalType: 'enum IMultiVault.Fee',
                    name: 'fee',
                    type: 'uint8',
                },
            ],
            name: 'calculateMovementFee',
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
            inputs: [],
            name: 'configurationAlien',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'configurationNative',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'defaultAlienDepositFee',
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
            inputs: [],
            name: 'defaultAlienWithdrawFee',
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
            inputs: [],
            name: 'defaultNativeDepositFee',
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
            inputs: [],
            name: 'defaultNativeWithdrawFee',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
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
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'fees',
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
            inputs: [],
            name: 'getInitHash',
            outputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'int8',
                    name: 'native_wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'native_addr',
                    type: 'uint256',
                },
            ],
            name: 'getNativeToken',
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
            name: 'governance',
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
            name: 'guardian',
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
            inputs: [
                {
                    internalType: 'address',
                    name: '_bridge',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_governance',
                    type: 'address',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'management',
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
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'vault',
                    type: 'address',
                },
            ],
            name: 'migrateAlienTokenToVault',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
            ],
            name: 'natives',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
            ],
            name: 'prefixes',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'activation',
                            type: 'uint256',
                        },
                        {
                            internalType: 'string',
                            name: 'name',
                            type: 'string',
                        },
                        {
                            internalType: 'string',
                            name: 'symbol',
                            type: 'string',
                        },
                    ],
                    internalType: 'struct IMultiVault.TokenPrefix',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rewards',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
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
            name: 'saveWithdrawAlien',
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
            name: 'saveWithdrawNative',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_configuration',
                    type: 'tuple',
                },
            ],
            name: 'setConfigurationAlien',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_configuration',
                    type: 'tuple',
                },
            ],
            name: 'setConfigurationNative',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setDefaultAlienDepositFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setDefaultAlienWithdrawFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setDefaultNativeDepositFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setDefaultNativeWithdrawFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool',
                },
            ],
            name: 'setEmergencyShutdown',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_governance',
                    type: 'address',
                },
            ],
            name: 'setGovernance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_guardian',
                    type: 'address',
                },
            ],
            name: 'setGuardian',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_management',
                    type: 'address',
                },
            ],
            name: 'setManagement',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'string',
                    name: 'name_prefix',
                    type: 'string',
                },
                {
                    internalType: 'string',
                    name: 'symbol_prefix',
                    type: 'string',
                },
            ],
            name: 'setPrefix',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_rewards',
                    type: 'tuple',
                },
            ],
            name: 'setRewards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_depositFee',
                    type: 'uint256',
                },
            ],
            name: 'setTokenDepositFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_withdrawFee',
                    type: 'uint256',
                },
            ],
            name: 'setTokenWithdrawFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'skim_to_everscale',
                    type: 'bool',
                },
            ],
            name: 'skim',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
            ],
            name: 'tokens',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'activation',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'blacklisted',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'depositFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'withdrawFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'isNative',
                            type: 'bool',
                        },
                    ],
                    internalType: 'struct IMultiVault.Token',
                    name: '',
                    type: 'tuple',
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
            name: 'withdrawalIds',
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
    ]

    static Vault: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'Deposit',
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
                    indexed: false,
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'user',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'creditor',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipient',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'tokenAmount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'tonAmount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint8',
                    name: 'swapType',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'slippageNumerator',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'slippageDenominator',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'bytes1',
                    name: 'separator',
                    type: 'bytes1',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'level3',
                    type: 'bytes',
                },
            ],
            name: 'FactoryDeposit',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'payloadId',
                    type: 'bytes32',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'InstantWithdrawal',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'governance',
                    type: 'address',
                },
            ],
            name: 'NewPendingGovernance',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'PendingWithdrawalCancel',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: 'payloadId',
                    type: 'bytes32',
                },
            ],
            name: 'PendingWithdrawalCreated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
            ],
            name: 'PendingWithdrawalForce',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'enum IVault.ApproveStatus',
                    name: 'approveStatus',
                    type: 'uint8',
                },
            ],
            name: 'PendingWithdrawalUpdateApproveStatus',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'PendingWithdrawalUpdateBounty',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'requestedAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'redeemedAmount',
                    type: 'uint256',
                },
            ],
            name: 'PendingWithdrawalWithdraw',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'debtRatio',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            name: 'StrategyAdded',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
            ],
            name: 'StrategyAddedToQueue',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'oldVersion',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'newVersion',
                    type: 'address',
                },
            ],
            name: 'StrategyMigrated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
            ],
            name: 'StrategyRemovedFromQueue',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'gain',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'loss',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'debtPaid',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalGain',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalSkim',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalLoss',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalDebt',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'debtAdded',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'debtRatio',
                    type: 'uint256',
                },
            ],
            name: 'StrategyReported',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
            ],
            name: 'StrategyRevoked',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'debtRatio',
                    type: 'uint256',
                },
            ],
            name: 'StrategyUpdateDebtRatio',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            name: 'StrategyUpdateMaxDebtPerHarvest',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            name: 'StrategyUpdateMinDebtPerHarvest',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'strategy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            name: 'StrategyUpdatePerformanceFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'StrategyUpdateRewards',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'bridge',
                    type: 'address',
                },
            ],
            name: 'UpdateBridge',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'UpdateConfiguration',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDepositFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'depositLimit',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDepositLimit',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'governance',
                    type: 'address',
                },
            ],
            name: 'UpdateGovernance',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'guardian',
                    type: 'address',
                },
            ],
            name: 'UpdateGuardian',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'management',
                    type: 'address',
                },
            ],
            name: 'UpdateManagement',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'managenentFee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateManagementFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            name: 'UpdatePerformanceFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'wid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            name: 'UpdateRewards',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'targetDecimals',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTargetDecimals',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'undeclaredWithdrawLimit',
                    type: 'uint256',
                },
            ],
            name: 'UpdateUndeclaredWithdrawLimit',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateWithdrawFee',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'withdrawGuardian',
                    type: 'address',
                },
            ],
            name: 'UpdateWithdrawGuardian',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'withdrawLimitPerPeriod',
                    type: 'uint256',
                },
            ],
            name: 'UpdateWithdrawLimitPerPeriod',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address[20]',
                    name: 'queue',
                    type: 'address[20]',
                },
            ],
            name: 'UpdateWithdrawalQueue',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'sender',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'int128',
                    name: 'recipientWid',
                    type: 'int128',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipientAddr',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'withdrawalRecipient',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'withdrawalId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'UserDeposit',
            type: 'event',
        },
        {
            inputs: [],
            name: 'acceptGovernance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_debtRatio',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_performanceFee',
                    type: 'uint256',
                },
            ],
            name: 'addStrategy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
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
            inputs: [],
            name: 'availableDepositLimit',
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
            inputs: [],
            name: 'bridge',
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
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'cancelPendingWithdrawal',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'configuration',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'convertFromTargetDecimals',
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
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'convertToTargetDecimals',
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
            inputs: [],
            name: 'creditAvailable',
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
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'creditAvailable',
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
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'debtOutstanding',
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
            inputs: [],
            name: 'debtOutstanding',
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
            inputs: [],
            name: 'debtRatio',
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
                    internalType: 'bytes',
                    name: 'eventData',
                    type: 'bytes',
                },
            ],
            name: 'decodeWithdrawalEventData',
            outputs: [
                {
                    components: [
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
                            internalType: 'struct IEverscale.EverscaleAddress',
                            name: 'sender',
                            type: 'tuple',
                        },
                        {
                            internalType: 'uint256',
                            name: 'amount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'address',
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            internalType: 'uint32',
                            name: 'chainId',
                            type: 'uint32',
                        },
                    ],
                    internalType: 'struct IVaultBasic.WithdrawalParams',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedMinBounty',
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
                    name: 'pendingWithdrawalIds',
                    type: 'tuple[]',
                },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'depositFee',
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
            inputs: [],
            name: 'depositLimit',
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
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'user',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'creditor',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'recipient',
                    type: 'uint256',
                },
                {
                    internalType: 'uint128',
                    name: 'tokenAmount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint128',
                    name: 'tonAmount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint8',
                    name: 'swapType',
                    type: 'uint8',
                },
                {
                    internalType: 'uint128',
                    name: 'slippageNumerator',
                    type: 'uint128',
                },
                {
                    internalType: 'uint128',
                    name: 'slippageDenominator',
                    type: 'uint128',
                },
                {
                    internalType: 'bytes',
                    name: 'level3',
                    type: 'bytes',
                },
            ],
            name: 'depositToFactory',
            outputs: [],
            stateMutability: 'nonpayable',
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
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'expectedReturn',
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
            inputs: [],
            name: 'fees',
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
                    internalType: 'struct IVault.PendingWithdrawalId',
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                },
            ],
            name: 'forceWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
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
                    name: 'pendingWithdrawalId',
                    type: 'tuple[]',
                },
            ],
            name: 'forceWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'governance',
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
            name: 'guardian',
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
            inputs: [
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_bridge',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_governance',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_targetDecimals',
                    type: 'uint256',
                },
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_rewards',
                    type: 'tuple',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'lastReport',
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
            inputs: [],
            name: 'lockedProfit',
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
            inputs: [],
            name: 'lockedProfitDegradation',
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
            inputs: [],
            name: 'management',
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
            name: 'managementFee',
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
                    name: 'oldVersion',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: 'newVersion',
                    type: 'address',
                },
            ],
            name: 'migrateStrategy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
            ],
            name: 'pendingWithdrawals',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'amount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'bounty',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'timestamp',
                            type: 'uint256',
                        },
                        {
                            internalType: 'enum IVault.ApproveStatus',
                            name: 'approveStatus',
                            type: 'uint8',
                        },
                    ],
                    internalType: 'struct IVault.PendingWithdrawalParams',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
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
            name: 'pendingWithdrawalsPerUser',
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
            inputs: [],
            name: 'pendingWithdrawalsTotal',
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
            inputs: [],
            name: 'performanceFee',
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
                    internalType: 'uint256',
                    name: 'gain',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'loss',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_debtPayment',
                    type: 'uint256',
                },
            ],
            name: 'report',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'revokeStrategy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'revokeStrategy',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rewards',
            outputs: [
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '',
                    type: 'tuple',
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
            name: 'saveWithdraw',
            outputs: [
                {
                    internalType: 'bool',
                    name: 'instantWithdrawal',
                    type: 'bool',
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
                    internalType: 'struct IVault.PendingWithdrawalId',
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                },
            ],
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_configuration',
                    type: 'tuple',
                },
            ],
            name: 'setConfiguration',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_depositFee',
                    type: 'uint256',
                },
            ],
            name: 'setDepositFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            name: 'setDepositLimit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool',
                },
            ],
            name: 'setEmergencyShutdown',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_governance',
                    type: 'address',
                },
            ],
            name: 'setGovernance',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_guardian',
                    type: 'address',
                },
            ],
            name: 'setGuardian',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'degradation',
                    type: 'uint256',
                },
            ],
            name: 'setLockedProfitDegradation',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_management',
                    type: 'address',
                },
            ],
            name: 'setManagement',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setManagementFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
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
                    name: 'pendingWithdrawalId',
                    type: 'tuple[]',
                },
                {
                    internalType: 'enum IVault.ApproveStatus[]',
                    name: 'approveStatus',
                    type: 'uint8[]',
                },
            ],
            name: 'setPendingWithdrawalApprove',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
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
                    internalType: 'struct IVault.PendingWithdrawalId',
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                },
                {
                    internalType: 'enum IVault.ApproveStatus',
                    name: 'approveStatus',
                    type: 'uint8',
                },
            ],
            name: 'setPendingWithdrawalApprove',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'setPendingWithdrawalBounty',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'setPerformanceFee',
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_rewards',
                    type: 'tuple',
                },
            ],
            name: 'setRewards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
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
                    internalType: 'struct IEverscale.EverscaleAddress',
                    name: '_rewards',
                    type: 'tuple',
                },
            ],
            name: 'setStrategyRewards',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_undeclaredWithdrawLimit',
                    type: 'uint256',
                },
            ],
            name: 'setUndeclaredWithdrawLimit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_withdrawFee',
                    type: 'uint256',
                },
            ],
            name: 'setWithdrawFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_withdrawGuardian',
                    type: 'address',
                },
            ],
            name: 'setWithdrawGuardian',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_withdrawLimitPerPeriod',
                    type: 'uint256',
                },
            ],
            name: 'setWithdrawLimitPerPeriod',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[20]',
                    name: 'queue',
                    type: 'address[20]',
                },
            ],
            name: 'setWithdrawalQueue',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'skim',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: 'skim_to_everscale',
                    type: 'bool',
                },
            ],
            name: 'skimFees',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
            ],
            name: 'strategies',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'performanceFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'activation',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'debtRatio',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'minDebtPerHarvest',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'maxDebtPerHarvest',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'lastReport',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalDebt',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalGain',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalSkim',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalLoss',
                            type: 'uint256',
                        },
                        {
                            internalType: 'address',
                            name: 'rewardsManager',
                            type: 'address',
                        },
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
                            internalType: 'struct IEverscale.EverscaleAddress',
                            name: 'rewards',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct IVault.StrategyParams',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_token',
                    type: 'address',
                },
            ],
            name: 'sweep',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'targetDecimals',
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
            inputs: [],
            name: 'token',
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
            name: 'tokenDecimals',
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
            inputs: [],
            name: 'totalAssets',
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
            inputs: [],
            name: 'totalDebt',
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
            inputs: [],
            name: 'undeclaredWithdrawLimit',
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
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_debtRatio',
                    type: 'uint256',
                },
            ],
            name: 'updateStrategyDebtRatio',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            name: 'updateStrategyMaxDebtPerHarvest',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            name: 'updateStrategyMinDebtPerHarvest',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'strategyId',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_performanceFee',
                    type: 'uint256',
                },
            ],
            name: 'updateStrategyPerformanceFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'amountRequested',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'maxLoss',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'withdraw',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'amountAdjusted',
                    type: 'uint256',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'withdrawFee',
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
            inputs: [],
            name: 'withdrawGuardian',
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
            name: 'withdrawLimitPerPeriod',
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
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'withdrawalIds',
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
                    internalType: 'uint256',
                    name: 'withdrawalPeriodId',
                    type: 'uint256',
                },
            ],
            name: 'withdrawalPeriods',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'total',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'considered',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.WithdrawalPeriodParams',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'withdrawalQueue',
            outputs: [
                {
                    internalType: 'address[20]',
                    name: '',
                    type: 'address[20]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ]

    static StakingRelayVerifier: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint160',
                    name: 'eth_addr',
                    type: 'uint160',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'workchain_id',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr_body',
                    type: 'uint256',
                },
            ],
            name: 'RelayAddressVerified',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'int8',
                    name: 'workchain_id',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'address_body',
                    type: 'uint256',
                },
            ],
            name: 'verify_relay_staker_address',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ]

}
