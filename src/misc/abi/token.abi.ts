export abstract class TokenAbi {

    static Root = {
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
                outputs: [
                ],
            },
            {
                name: 'supportsInterface',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'interfaceID', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'walletVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'requestUpgradeWallet',
                inputs: [
                    { name: 'currentVersion', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setWalletCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'disableMint',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'mintDisabled',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
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
                outputs: [
                ],
            },
            {
                name: 'disableBurnByRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'burnByRootDisabled',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'burnPaused',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'setBurnPaused',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'paused', type: 'bool' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'payload', type: 'cell' }], name: 'callbacks', type: 'map(address,tuple)' },
                ],
                outputs: [
                ],
            },
            {
                name: 'name',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'string' },
                ],
            },
            {
                name: 'symbol',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'string' },
                ],
            },
            {
                name: 'decimals',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
                ],
            },
            {
                name: 'totalSupply',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'walletCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'rootOwner',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'walletOf',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployWallet',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'walletOwner', type: 'address' },
                    { name: 'deployWalletValue', type: 'uint128' },
                ],
                outputs: [
                    { name: 'tokenWallet', type: 'address' },
                ],
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
                outputs: [
                ],
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
        ],
        events: [
        ],
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
        ],
    } as const

    static Wallet = {
        'ABI version': 2,
        version: '2.2',
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
                name: 'supportsInterface',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'interfaceID', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'onDeployRetry',
                id: '0x15A038FB',
                inputs: [
                    { name: 'value0', type: 'cell' },
                    { name: 'value1', type: 'uint32' },
                    { name: 'sender', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'version',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptUpgrade',
                inputs: [
                    { name: 'newCode', type: 'cell' },
                    { name: 'newVersion', type: 'uint32' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnByRoot',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'callbackTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'destroy',
                inputs: [
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burn',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'callbackTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'balance',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'owner',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'root',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'walletCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'transfer',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
                    { name: 'deployWalletValue', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'notify', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferToWallet',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipientTokenWallet', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'notify', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptTransfer',
                id: '0x67A0B95F',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'sender', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'notify', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptMint',
                id: '0x4384F298',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'notify', type: 'bool' },
                    { name: 'payload', type: 'cell' },
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
        ],
        data: [
            { key: 1, name: 'root_', type: 'address' },
            { key: 2, name: 'owner_', type: 'address' },
        ],
        events: [
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'root_', type: 'address' },
            { name: 'owner_', type: 'address' },
            { name: 'balance_', type: 'uint128' },
            { name: 'version_', type: 'uint32' },
            { name: 'platformCode_', type: 'cell' },
        ],
    } as const

}
