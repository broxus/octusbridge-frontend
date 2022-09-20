export abstract class DexAbi {

    static Pair = {
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
                name: 'resetGas',
                inputs: [
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_root', type: 'address' },
                ],
            },
            {
                name: 'getTokenRoots',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                    { name: 'lp', type: 'address' },
                ],
            },
            {
                name: 'getTokenWallets',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                    { name: 'lp', type: 'address' },
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'version', type: 'uint32' },
                ],
            },
            {
                name: 'getVault',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_vault', type: 'address' },
                ],
            },
            {
                name: 'getVaultWallets',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                ],
            },
            {
                name: 'setFeeParams',
                inputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getFeeParams',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
            },
            {
                name: 'isActive',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'getBalances',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'lp_supply', type: 'uint128' }, { name: 'left_balance', type: 'uint128' }, { name: 'right_balance', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'buildExchangePayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'expected_amount', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildDepositLiquidityPayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildWithdrawLiquidityPayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildCrossPairExchangePayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'expected_amount', type: 'uint128' },
                    { components: [{ name: 'amount', type: 'uint128' }, { name: 'root', type: 'address' }], name: 'steps', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: 'token_root', type: 'address' },
                    { name: 'tokens_amount', type: 'uint128' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'sender_wallet', type: 'address' },
                    { name: 'original_gas_to', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'expectedDepositLiquidity',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'left_amount', type: 'uint128' },
                    { name: 'right_amount', type: 'uint128' },
                    { name: 'auto_change', type: 'bool' },
                ],
                outputs: [
                    { components: [{ name: 'step_1_left_deposit', type: 'uint128' }, { name: 'step_1_right_deposit', type: 'uint128' }, { name: 'step_1_lp_reward', type: 'uint128' }, { name: 'step_2_left_to_right', type: 'bool' }, { name: 'step_2_right_to_left', type: 'bool' }, { name: 'step_2_spent', type: 'uint128' }, { name: 'step_2_fee', type: 'uint128' }, { name: 'step_2_received', type: 'uint128' }, { name: 'step_3_left_deposit', type: 'uint128' }, { name: 'step_3_right_deposit', type: 'uint128' }, { name: 'step_3_lp_reward', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'depositLiquidity',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'left_amount', type: 'uint128' },
                    { name: 'right_amount', type: 'uint128' },
                    { name: 'expected_lp_root', type: 'address' },
                    { name: 'auto_change', type: 'bool' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value6', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'expectedWithdrawLiquidity',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'lp_amount', type: 'uint128' },
                ],
                outputs: [
                    { name: 'expected_left_amount', type: 'uint128' },
                    { name: 'expected_right_amount', type: 'uint128' },
                ],
            },
            {
                name: 'withdrawLiquidity',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'lp_amount', type: 'uint128' },
                    { name: 'expected_lp_root', type: 'address' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value4', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'expectedExchange',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'spent_token_root', type: 'address' },
                ],
                outputs: [
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'expected_fee', type: 'uint128' },
                ],
            },
            {
                name: 'expectedSpendAmount',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'receive_amount', type: 'uint128' },
                    { name: 'receive_token_root', type: 'address' },
                ],
                outputs: [
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'expected_fee', type: 'uint128' },
                ],
            },
            {
                name: 'exchange',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'spent_amount', type: 'uint128' },
                    { name: 'spent_token_root', type: 'address' },
                    { name: 'receive_token_root', type: 'address' },
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value6', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'crossPairExchange',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'value1', type: 'uint32' },
                    { name: 'prev_pair_left_root', type: 'address' },
                    { name: 'prev_pair_right_root', type: 'address' },
                    { name: 'spent_token_root', type: 'address' },
                    { name: 'spent_amount', type: 'uint128' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'original_gas_to', type: 'address' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'checkPair',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                    { name: 'value1', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'new_version', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onTokenWallet',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onVaultTokenWallet',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'liquidityTokenRootDeployed',
                inputs: [
                    { name: 'lp_root_', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'liquidityTokenRootNotDeployed',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'platform_code',
                inputs: [
                ],
                outputs: [
                    { name: 'platform_code', type: 'cell' },
                ],
            },
            {
                name: 'lp_wallet',
                inputs: [
                ],
                outputs: [
                    { name: 'lp_wallet', type: 'address' },
                ],
            },
            {
                name: 'left_wallet',
                inputs: [
                ],
                outputs: [
                    { name: 'left_wallet', type: 'address' },
                ],
            },
            {
                name: 'right_wallet',
                inputs: [
                ],
                outputs: [
                    { name: 'right_wallet', type: 'address' },
                ],
            },
            {
                name: 'vault_left_wallet',
                inputs: [
                ],
                outputs: [
                    { name: 'vault_left_wallet', type: 'address' },
                ],
            },
            {
                name: 'vault_right_wallet',
                inputs: [
                ],
                outputs: [
                    { name: 'vault_right_wallet', type: 'address' },
                ],
            },
            {
                name: 'lp_root',
                inputs: [
                ],
                outputs: [
                    { name: 'lp_root', type: 'address' },
                ],
            },
            {
                name: 'lp_supply',
                inputs: [
                ],
                outputs: [
                    { name: 'lp_supply', type: 'uint128' },
                ],
            },
            {
                name: 'left_balance',
                inputs: [
                ],
                outputs: [
                    { name: 'left_balance', type: 'uint128' },
                ],
            },
            {
                name: 'right_balance',
                inputs: [
                ],
                outputs: [
                    { name: 'right_balance', type: 'uint128' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'PairCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'FeesParamsUpdated',
                inputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DepositLiquidity',
                inputs: [
                    { name: 'left', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                    { name: 'lp', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'WithdrawLiquidity',
                inputs: [
                    { name: 'lp', type: 'uint128' },
                    { name: 'left', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ExchangeLeftToRight',
                inputs: [
                    { name: 'left', type: 'uint128' },
                    { name: 'fee', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ExchangeRightToLeft',
                inputs: [
                    { name: 'right', type: 'uint128' },
                    { name: 'fee', type: 'uint128' },
                    { name: 'left', type: 'uint128' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'platform_code', type: 'cell' },
            { name: 'root', type: 'address' },
            { name: 'vault', type: 'address' },
            { name: 'current_version', type: 'uint32' },
            { name: 'left_root', type: 'address' },
            { name: 'right_root', type: 'address' },
            { name: 'active', type: 'bool' },
            { name: 'lp_wallet', type: 'address' },
            { name: 'left_wallet', type: 'address' },
            { name: 'right_wallet', type: 'address' },
            { name: 'vault_left_wallet', type: 'address' },
            { name: 'vault_right_wallet', type: 'address' },
            { name: 'lp_root', type: 'address' },
            { name: 'lp_supply', type: 'uint128' },
            { name: 'left_balance', type: 'uint128' },
            { name: 'right_balance', type: 'uint128' },
            { name: 'fee_numerator', type: 'uint16' },
            { name: 'fee_denominator', type: 'uint16' },
        ],
    } as const

    static Root = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'initial_owner', type: 'address' },
                    { name: 'initial_vault', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installPlatformOnce',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateAccountCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdatePairCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getAccountVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getPairVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'setVaultOnce',
                inputs: [
                    { name: 'new_vault', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVault',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'setActive',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'isActive',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
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
                name: 'requestUpgradeAccount',
                inputs: [
                    { name: 'current_version', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'forceUpgradeAccount',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradePair',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'resetGas',
                inputs: [
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'resetTargetGas',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getOwner',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_owner', type: 'address' },
                ],
            },
            {
                name: 'getPendingOwner',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_pending_owner', type: 'address' },
                ],
            },
            {
                name: 'transferOwner',
                inputs: [
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptOwner',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'getExpectedAccountAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getExpectedPairAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployAccount',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployPair',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onPairCreated',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'platform_code',
                inputs: [
                ],
                outputs: [
                    { name: 'platform_code', type: 'cell' },
                ],
            },
            {
                name: 'account_code',
                inputs: [
                ],
                outputs: [
                    { name: 'account_code', type: 'cell' },
                ],
            },
            {
                name: 'pair_code',
                inputs: [
                ],
                outputs: [
                    { name: 'pair_code', type: 'cell' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_nonce', type: 'uint32' },
        ],
        events: [
            {
                name: 'AccountCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'PairCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RootCodeUpgraded',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'ActiveUpdated',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedPairUpgrade',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedForceAccountUpgrade',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedOwnerTransfer',
                inputs: [
                    { name: 'old_owner', type: 'address' },
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'OwnerTransferAccepted',
                inputs: [
                    { name: 'old_owner', type: 'address' },
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'NewPairCreated',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'platform_code', type: 'cell' },
            { name: '_nonce', type: 'uint32' },
            { name: 'account_code', type: 'cell' },
            { name: 'account_version', type: 'uint32' },
            { name: 'pair_code', type: 'cell' },
            { name: 'pair_version', type: 'uint32' },
            { name: 'active', type: 'bool' },
            { name: 'owner', type: 'address' },
            { name: 'vault', type: 'address' },
            { name: 'pending_owner', type: 'address' },
        ],
    } as const

}
