import { type AbiItem } from 'web3-utils'

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
                    components: [
                        {
                            internalType: 'address',
                            name: 'facetAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'enum IDiamondCut.FacetCutAction',
                            name: 'action',
                            type: 'uint8',
                        },
                        {
                            internalType: 'bytes4[]',
                            name: 'functionSelectors',
                            type: 'bytes4[]',
                        },
                    ],
                    indexed: false,
                    internalType: 'struct IDiamondCut.FacetCut[]',
                    name: '_diamondCut',
                    type: 'tuple[]',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_init',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: '_calldata',
                    type: 'bytes',
                },
            ],
            name: 'DiamondCut',
            type: 'event',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'facetAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'enum IDiamondCut.FacetCutAction',
                            name: 'action',
                            type: 'uint8',
                        },
                        {
                            internalType: 'bytes4[]',
                            name: 'functionSelectors',
                            type: 'bytes4[]',
                        },
                    ],
                    internalType: 'struct IDiamondCut.FacetCut[]',
                    name: '_diamondCut',
                    type: 'tuple[]',
                },
                {
                    internalType: 'address',
                    name: '_init',
                    type: 'address',
                },
                {
                    internalType: 'bytes',
                    name: '_calldata',
                    type: 'bytes',
                },
            ],
            name: 'diamondCut',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes4',
                    name: '_functionSelector',
                    type: 'bytes4',
                },
            ],
            name: 'facetAddress',
            outputs: [
                {
                    internalType: 'address',
                    name: 'facetAddress_',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'facetAddresses',
            outputs: [
                {
                    internalType: 'address[]',
                    name: 'facetAddresses_',
                    type: 'address[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_facet',
                    type: 'address',
                },
            ],
            name: 'facetFunctionSelectors',
            outputs: [
                {
                    internalType: 'bytes4[]',
                    name: 'facetFunctionSelectors_',
                    type: 'bytes4[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'facets',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'facetAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'bytes4[]',
                            name: 'functionSelectors',
                            type: 'bytes4[]',
                        },
                    ],
                    internalType: 'struct IDiamondLoupe.Facet[]',
                    name: 'facets_',
                    type: 'tuple[]',
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
                        {
                            internalType: 'uint256',
                            name: 'expected_evers',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bytes',
                            name: 'payload',
                            type: 'bytes',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetDeposit.DepositParams',
                    name: 'd',
                    type: 'tuple',
                },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
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
                        {
                            internalType: 'uint256',
                            name: 'expected_evers',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bytes',
                            name: 'payload',
                            type: 'bytes',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetDeposit.DepositParams',
                    name: 'd',
                    type: 'tuple',
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalIds',
                    type: 'tuple[]',
                },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
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
                            internalType: 'uint256',
                            name: 'amount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'expected_evers',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bytes',
                            name: 'payload',
                            type: 'bytes',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetDeposit.DepositNativeTokenParams',
                    name: 'd',
                    type: 'tuple',
                },
            ],
            name: 'depositByNativeToken',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
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
                            internalType: 'uint256',
                            name: 'amount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'expected_evers',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bytes',
                            name: 'payload',
                            type: 'bytes',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetDeposit.DepositNativeTokenParams',
                    name: 'd',
                    type: 'tuple',
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalIds',
                    type: 'tuple[]',
                },
            ],
            name: 'depositByNativeToken',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
        },
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
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'expected_evers',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
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
                    internalType: 'enum IMultiVaultFacetTokens.TokenType',
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
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'value',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'expected_evers',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'NativeTransfer',
            type: 'event',
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
                    internalType: 'address',
                    name: 'token',
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
            ],
            name: 'skim',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
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
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'EarnTokenFee',
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
                    internalType: 'uint256',
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTokenWithdrawFee',
            type: 'event',
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
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'convertLPToUnderlying',
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
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'convertUnderlyingToLP',
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
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'exchangeRateCurrent',
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
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'getCash',
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
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'getSupply',
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
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'liquidity',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'activation',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'supply',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'cash',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'interest',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetLiquidity.Liquidity',
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
                    name: 'token',
                    type: 'address',
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
            ],
            name: 'mintLP',
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
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                },
            ],
            name: 'redeemLP',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'interest',
                    type: 'uint256',
                },
            ],
            name: 'setDefaultInterest',
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
                    name: 'interest',
                    type: 'uint256',
                },
            ],
            name: 'setTokenInterest',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
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
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'EarnTokenCash',
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
                    internalType: 'address',
                    name: 'token',
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
                    name: 'lp_amount',
                    type: 'uint256',
                },
            ],
            name: 'MintLiquidity',
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
                    internalType: 'address',
                    name: 'token',
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
                    name: 'underlying_amount',
                    type: 'uint256',
                },
            ],
            name: 'RedeemLiquidity',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'inetrest',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDefaultLiquidityInterest',
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
                    name: 'interest',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTokenLiquidityInterest',
            type: 'event',
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
                    internalType: 'uint256',
                    name: 'expected_evers',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'cancelPendingWithdrawal',
            outputs: [],
            stateMutability: 'payable',
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalIds',
                    type: 'tuple[]',
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
                            internalType: 'address',
                            name: 'token',
                            type: 'address',
                        },
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
                            internalType: 'enum IMultiVaultFacetPendingWithdrawals.ApproveStatus',
                            name: 'approveStatus',
                            type: 'uint8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'chainId',
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
                                    internalType: 'bytes',
                                    name: 'payload',
                                    type: 'bytes',
                                },
                                {
                                    internalType: 'bool',
                                    name: 'strict',
                                    type: 'bool',
                                },
                            ],
                            internalType: 'struct IMultiVaultFacetWithdraw.Callback',
                            name: 'callback',
                            type: 'tuple',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalParams',
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
                    name: 'user',
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
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalId',
                    type: 'tuple[]',
                },
                {
                    internalType: 'enum IMultiVaultFacetPendingWithdrawals.ApproveStatus[]',
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.PendingWithdrawalId',
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                },
                {
                    internalType: 'enum IMultiVaultFacetPendingWithdrawals.ApproveStatus',
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'withdrawalLimits',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'undeclared',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'daily',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'enabled',
                            type: 'bool',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.WithdrawalLimits',
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
                    name: 'token',
                    type: 'address',
                },
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
                    internalType: 'struct IMultiVaultFacetPendingWithdrawals.WithdrawalPeriodParams',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
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
                    internalType: 'address',
                    name: 'token',
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
            name: 'PendingWithdrawalFill',
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
                    internalType: 'enum IMultiVaultFacetPendingWithdrawals.ApproveStatus',
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
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'PendingWithdrawalWithdraw',
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
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'disableWithdrawalLimits',
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
                    name: 'token',
                    type: 'address',
                },
            ],
            name: 'enableWithdrawalLimits',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'gasDonor',
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
                {
                    internalType: 'address',
                    name: '_weth',
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'daily',
                    type: 'uint256',
                },
            ],
            name: 'setDailyWithdrawalLimits',
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
                    name: '_gasDonor',
                    type: 'address',
                },
            ],
            name: 'setGasDonor',
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
            name: 'setGovernance',
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
            name: 'setGuardian',
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
                    internalType: 'uint256',
                    name: 'undeclared',
                    type: 'uint256',
                },
            ],
            name: 'setUndeclaredWithdrawalLimits',
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
                    internalType: 'enum IMultiVaultFacetTokens.TokenType',
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            name: 'UpdateDailyWithdrawalLimits',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'gasDonor',
                    type: 'address',
                },
            ],
            name: 'UpdateGasDonor',
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
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            name: 'UpdateUndeclaredWithdrawalLimits',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'weth',
                    type: 'address',
                },
            ],
            name: 'UpdateWeth',
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'status',
                    type: 'bool',
                },
            ],
            name: 'UpdateWithdrawalLimitStatus',
            type: 'event',
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
                    name: 'owner',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'burn',
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
            name: 'deployLPToken',
            outputs: [
                {
                    internalType: 'address',
                    name: 'lp',
                    type: 'address',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
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
                {
                    internalType: 'uint8',
                    name: 'decimals',
                    type: 'uint8',
                },
            ],
            name: 'deployTokenForNative',
            outputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
            ],
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
            name: 'getLPToken',
            outputs: [
                {
                    internalType: 'address',
                    name: 'lp',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
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
            name: 'getNativeToken',
            outputs: [
                {
                    internalType: 'address',
                    name: 'token',
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
                    name: 'recipient',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'mint',
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
                    internalType: 'struct IMultiVaultFacetTokens.TokenPrefix',
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
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
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
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'blacklisted',
                    type: 'bool',
                },
            ],
            name: 'setTokenBlacklist',
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
                        {
                            internalType: 'address',
                            name: 'custom',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'depositLimit',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IMultiVaultFacetTokens.Token',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
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
                    internalType: 'bool',
                    name: 'status',
                    type: 'bool',
                },
            ],
            name: 'UpdateTokenBlacklist',
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
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            name: 'UpdateTokenDepositLimit',
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
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
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
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'enum IMultiVaultFacetTokens.TokenType',
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
