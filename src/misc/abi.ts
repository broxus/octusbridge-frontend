/* eslint-disable max-classes-per-file */
import { AbiItem } from 'web3-utils'

export class DexAbi {

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

}

export class StackingAbi {

    static Root = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_admin', type: 'address' },
                    { name: '_dao_root', type: 'address' },
                    { name: '_rewarder', type: 'address' },
                    { name: '_rescuer', type: 'address' },
                    { name: '_bridge_event_config_eth_ton', type: 'address' },
                    { name: '_bridge_event_config_ton_eth', type: 'address' },
                    { name: '_tokenRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'linkRelayAccounts',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'slashRelay',
                inputs: [
                    { name: 'relay_staker_addr', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'confirmSlash',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'user_rewards', type: 'uint128[]' },
                    { name: 'user_debts', type: 'uint128[]' },
                    { name: 'ban_token_balance', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'createOriginRelayRound',
                inputs: [
                    { name: 'staker_addrs', type: 'address[]' },
                    { name: 'ton_pubkeys', type: 'uint256[]' },
                    { name: 'eth_addrs', type: 'uint160[]' },
                    { name: 'staked_tokens', type: 'uint128[]' },
                    { name: 'ton_deposit', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processBecomeRelayNextRound',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processGetRewardForRelayRound',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'startElectionOnNewRound',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'endElection',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onElectionStarted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onElectionEnded',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'relay_requests_count', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onRelayRoundDeployed',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onRelayRoundInitialized',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'round_start_time', type: 'uint32' },
                    { name: 'round_end_time', type: 'uint32' },
                    { name: 'relays_count', type: 'uint32' },
                    { name: 'round_reward', type: 'uint128' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                    { name: 'eth_keys', type: 'uint160[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installPlatformOnce',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateUserDataCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateElectionCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateRelayRoundCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeUserData',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'forceUpgradeUserData',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeElection',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeRelayRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getElectionAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getRelayRoundAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getRelayRoundAddressFromTimestamp',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'time', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'uint32' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'dao_root', type: 'address' }, { name: 'bridge_event_config_eth_ton', type: 'address' }, { name: 'bridge_event_config_ton_eth', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'admin', type: 'address' }, { name: 'rescuer', type: 'address' }, { name: 'rewarder', type: 'address' }, { name: 'tokenBalance', type: 'uint128' }, { name: 'rewardTokenBalance', type: 'uint128' }, { name: 'lastRewardTime', type: 'uint32' }, { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'emergency', type: 'bool' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getCodeData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'platform_code', type: 'cell' }, { name: 'has_platform_code', type: 'bool' }, { name: 'user_data_code', type: 'cell' }, { name: 'user_data_version', type: 'uint32' }, { name: 'election_code', type: 'cell' }, { name: 'election_version', type: 'uint32' }, { name: 'relay_round_code', type: 'cell' }, { name: 'relay_round_version', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getRelayRoundsDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'currentRelayRound', type: 'uint32' }, { name: 'currentRelayRoundStartTime', type: 'uint32' }, { name: 'currentRelayRoundEndTime', type: 'uint32' }, { name: 'currentElectionStartTime', type: 'uint32' }, { name: 'currentElectionEnded', type: 'bool' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getRelayConfig',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'addDelegate',
                inputs: [
                    { name: 'addr', type: 'address' },
                    { name: 'callHash', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setDaoRoot',
                inputs: [
                    { name: 'new_dao_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setTonEventDeployValue',
                inputs: [
                    { name: 'new_value', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBridgeEventEthTonConfig',
                inputs: [
                    { name: 'new_bridge_event_config_eth_ton', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBridgeEventTonEthConfig',
                inputs: [
                    { name: 'new_bridge_event_config_ton_eth', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setAdmin',
                inputs: [
                    { name: 'new_admin', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setRescuer',
                inputs: [
                    { name: 'new_rescuer', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setRewarder',
                inputs: [
                    { name: 'new_rewarder', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setActive',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
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
                name: 'setRelayConfig',
                inputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'new_relay_config', type: 'tuple' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
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
                name: 'startNewRewardRound',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'decodeDepositPayload',
                inputs: [
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                    { name: 'deposit_type', type: 'uint8' },
                    { name: 'correct', type: 'bool' },
                ],
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
                outputs: [
                ],
            },
            {
                name: 'revertDeposit',
                inputs: [
                    { name: '_deposit_nonce', type: 'uint64' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishDeposit',
                inputs: [
                    { name: '_deposit_nonce', type: 'uint64' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdraw',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishWithdraw',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'withdraw_amount', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'claimReward',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishClaimReward',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'rewards', type: 'uint128[]' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'pendingReward',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'user_token_balance', type: 'uint256' },
                    { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'user_reward_data', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint256' },
                ],
            },
            {
                name: 'getUserDataAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'castVoteWithReason',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockVoteTokens',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockCastedVotes',
                inputs: [
                    { name: 'proposal_ids', type: 'uint32[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTonsUserEmergency',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTonsEmergency',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'receiver', type: 'address' },
                    { name: 'all', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTokensEmergency',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'receiver', type: 'address' },
                    { name: 'all', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setEmergency',
                inputs: [
                    { name: '_emergency', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'delegators',
                inputs: [
                ],
                outputs: [
                    { name: 'delegators', type: 'map(address,uint256[])' },
                ],
            },
        ],
        data: [
            { key: 1, name: 'deploy_nonce', type: 'uint32' },
            { key: 2, name: 'deployer', type: 'address' },
        ],
        events: [
            {
                name: 'RewardDeposit',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'reward_round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Deposit',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Withdraw',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RewardClaimed',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'reward_tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'NewRewardRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionStarted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'election_start_time', type: 'uint32' },
                    { name: 'election_end_time', type: 'uint32' },
                    { name: 'election_addr', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionEnded',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'relay_requests', type: 'uint32' },
                    { name: 'min_relays_ok', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundInitialized',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'round_start_time', type: 'uint32' },
                    { name: 'round_end_time', type: 'uint32' },
                    { name: 'round_addr', type: 'address' },
                    { name: 'relays_count', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundCreation',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'eth_keys', type: 'uint160[]' },
                    { name: 'round_end', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelaySlashed',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'tokens_withdrawn', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Emergency',
                inputs: [
                    { name: 'state', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DepositReverted',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DaoRootUpdated',
                inputs: [
                    { name: 'new_dao_root', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'BridgeEventEthTonConfigUpdated',
                inputs: [
                    { name: 'new_bridge_event_config_eth_ton', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'BridgeEventTonEthConfigUpdated',
                inputs: [
                    { name: 'new_bridge_event_config_ton_eth', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'TonEventDeployValueUpdated',
                inputs: [
                    { name: 'new_value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'AdminUpdated',
                inputs: [
                    { name: 'new_admin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RewarderUpdated',
                inputs: [
                    { name: 'new_rewarder', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RescuerUpdated',
                inputs: [
                    { name: 'new_rescuer', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ActiveUpdated',
                inputs: [
                    { name: 'active', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedUserDataUpgrade',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedElectionUpgrade',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedRelayRoundUpgrade',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UserDataCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayConfigUpdated',
                inputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'delegators', type: 'map(address,uint256[])' },
            { name: 'deploy_nonce', type: 'uint32' },
            { name: 'deployer', type: 'address' },
            { name: 'active', type: 'bool' },
            { name: 'lastExtCall', type: 'uint32' },
            { components: [{ name: 'platform_code', type: 'cell' }, { name: 'has_platform_code', type: 'bool' }, { name: 'user_data_code', type: 'cell' }, { name: 'user_data_version', type: 'uint32' }, { name: 'election_code', type: 'cell' }, { name: 'election_version', type: 'uint32' }, { name: 'relay_round_code', type: 'cell' }, { name: 'relay_round_version', type: 'uint32' }], name: 'code_data', type: 'tuple' },
            { components: [{ name: 'currentRelayRound', type: 'uint32' }, { name: 'currentRelayRoundStartTime', type: 'uint32' }, { name: 'currentRelayRoundEndTime', type: 'uint32' }, { name: 'currentElectionStartTime', type: 'uint32' }, { name: 'currentElectionEnded', type: 'bool' }], name: 'round_details', type: 'tuple' },
            { components: [{ name: 'dao_root', type: 'address' }, { name: 'bridge_event_config_eth_ton', type: 'address' }, { name: 'bridge_event_config_ton_eth', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'admin', type: 'address' }, { name: 'rescuer', type: 'address' }, { name: 'rewarder', type: 'address' }, { name: 'tokenBalance', type: 'uint128' }, { name: 'rewardTokenBalance', type: 'uint128' }, { name: 'lastRewardTime', type: 'uint32' }, { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'emergency', type: 'bool' }], name: 'base_details', type: 'tuple' },
            { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'relay_config', type: 'tuple' },
            { name: 'tonEventDeployValue', type: 'uint128' },
            { name: 'deposit_nonce', type: 'uint64' },
            { components: [{ name: 'user', type: 'address' }, { name: 'amount', type: 'uint128' }, { name: 'send_gas_to', type: 'address' }], name: 'deposits', type: 'map(uint64,tuple)' },
        ],
    } as const

    static RelayRound = {
        'ABI version': 2,
        version: '2.2',
        header: ['time'],
        functions: [
            {
                name: 'constructor',
                inputs: [
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
                    { components: [{ name: 'root', type: 'address' }, { name: 'round_num', type: 'uint32' }, { name: 'ton_keys', type: 'uint256[]' }, { name: 'eth_addrs', type: 'uint160[]' }, { name: 'staker_addrs', type: 'address[]' }, { name: 'staked_tokens', type: 'uint128[]' }, { name: 'relays_installed', type: 'bool' }, { name: 'code_version', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'hasUnclaimedReward',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: '_relay_staker_addr', type: 'address' },
                ],
                outputs: [
                    { name: 'has_reward', type: 'bool' },
                ],
            },
            {
                name: 'getRelayByStakerAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: '_relay_staker_addr', type: 'address' },
                ],
                outputs: [
                    { name: '_ton_key', type: 'uint256' },
                    { name: '_eth_addr', type: 'uint160' },
                    { name: '_staker_addr', type: 'address' },
                    { name: '_staked_tokens', type: 'uint128' },
                ],
            },
            {
                name: 'getRewardForRound',
                inputs: [
                    { name: 'staker_addr', type: 'address' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendRelaysToRelayRound',
                inputs: [
                    { name: 'relay_round_addr', type: 'address' },
                    { name: 'count', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'relayKeys',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint256[]' },
                ],
            },
            {
                name: 'setEmptyRelays',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setRelays',
                inputs: [
                    { name: '_ton_keys', type: 'uint256[]' },
                    { name: '_eth_addrs', type: 'uint160[]' },
                    { name: '_staker_addrs', type: 'address[]' },
                    { name: '_staked_tokens', type: 'uint128[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'destroy',
                inputs: [
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
                name: 'getUserDataAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'relays_count',
                inputs: [
                ],
                outputs: [
                    { name: 'relays_count', type: 'uint32' },
                ],
            },
            {
                name: 'start_time',
                inputs: [
                ],
                outputs: [
                    { name: 'start_time', type: 'uint32' },
                ],
            },
            {
                name: 'end_time',
                inputs: [
                ],
                outputs: [
                    { name: 'end_time', type: 'uint32' },
                ],
            },
            {
                name: 'total_tokens_staked',
                inputs: [
                ],
                outputs: [
                    { name: 'total_tokens_staked', type: 'uint128' },
                ],
            },
            {
                name: 'reward_round_num',
                inputs: [
                ],
                outputs: [
                    { name: 'reward_round_num', type: 'uint32' },
                ],
            },
            {
                name: 'round_reward',
                inputs: [
                ],
                outputs: [
                    { name: 'round_reward', type: 'uint128' },
                ],
            },
            {
                name: 'duplicate',
                inputs: [
                ],
                outputs: [
                    { name: 'duplicate', type: 'bool' },
                ],
            },
            {
                name: 'expected_packs_num',
                inputs: [
                ],
                outputs: [
                    { name: 'expected_packs_num', type: 'uint8' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'RelayRoundCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'relays_installed', type: 'bool' },
            { name: 'relays_count', type: 'uint32' },
            { name: 'start_time', type: 'uint32' },
            { name: 'end_time', type: 'uint32' },
            { name: 'total_tokens_staked', type: 'uint128' },
            { name: 'reward_round_num', type: 'uint32' },
            { name: 'round_reward', type: 'uint128' },
            { name: 'duplicate', type: 'bool' },
            { name: 'expected_packs_num', type: 'uint8' },
            { name: 'election_addr', type: 'address' },
            { name: 'prev_round_addr', type: 'address' },
            { name: 'round_num', type: 'uint32' },
            { name: 'ton_keys', type: 'uint256[]' },
            { name: 'eth_addrs', type: 'uint160[]' },
            { name: 'staker_addrs', type: 'address[]' },
            { name: 'staked_tokens', type: 'uint128[]' },
            { name: 'addr_to_idx', type: 'map(address,uint256)' },
            { name: 'reward_claimed', type: 'map(address,bool)' },
            { name: 'relay_packs_installed', type: 'uint8' },
            { name: 'relay_transfer_start_idx', type: 'uint256' },
            { name: 'current_version', type: 'uint32' },
            { name: 'platform_code', type: 'cell' },
            { name: 'root', type: 'address' },
        ],
    } as const

}

export class DaoAbi {

    static Root = {
        'ABI version': 2,
        version: '2.2',
        header: ['time'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'platformCode_', type: 'cell' },
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration_', type: 'tuple' },
                    { name: 'admin_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getAdmin',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getPendingAdmin',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getProposalCount',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getStakingRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getEthereumActionEventConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'uint128' },
                ],
            },
            {
                name: 'expectedProposalAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'proposalId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'expectedStakingAccountAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'propose',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                    { name: 'description', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployProposal',
                inputs: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'accountOwner', type: 'address' },
                    { name: 'proposalData', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onProposalSucceeded',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { name: 'proposer', type: 'address' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'calcTonActionsValue',
                inputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'totalValue', type: 'uint128' },
                ],
            },
            {
                name: 'calcEthActionsValue',
                inputs: [
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'totalValue', type: 'uint128' },
                ],
            },
            {
                name: 'requestUpgradeProposal',
                inputs: [
                    { name: 'currentVersion', type: 'uint16' },
                    { name: 'sendGasTo', type: 'address' },
                    { name: 'proposalId', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setStakingRoot',
                inputs: [
                    { name: 'newStakingRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferAdmin',
                inputs: [
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptAdmin',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'updateEthereumActionEventConfiguration',
                inputs: [
                    { name: 'newConfiguration', type: 'address' },
                    { name: 'newDeployEventValue', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateProposalCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateQuorumVotes',
                inputs: [
                    { name: 'newQuorumVotes', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateThreshold',
                inputs: [
                    { name: 'newThreshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateTimeLock',
                inputs: [
                    { name: 'newTimeLock', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateVotingPeriod',
                inputs: [
                    { name: 'newVotingPeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateVotingDelay',
                inputs: [
                    { name: 'newVotingDelay', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateGracePeriod',
                inputs: [
                    { name: 'newGracePeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateProposalConfiguration',
                inputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'newConfig', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'addDelegate',
                inputs: [
                    { name: 'addr', type: 'address' },
                    { name: 'callHash', type: 'uint256' },
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
                name: 'encodeDaoEthereumActionData',
                inputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeDaoEthereumActionData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
            },
            {
                name: 'delegators',
                inputs: [
                ],
                outputs: [
                    { name: 'delegators', type: 'map(address,uint256[])' },
                ],
            },
            {
                name: 'stakingRoot',
                inputs: [
                ],
                outputs: [
                    { name: 'stakingRoot', type: 'address' },
                ],
            },
            {
                name: 'ethereumActionEventConfiguration',
                inputs: [
                ],
                outputs: [
                    { name: 'ethereumActionEventConfiguration', type: 'address' },
                ],
            },
            {
                name: 'deployEventValue',
                inputs: [
                ],
                outputs: [
                    { name: 'deployEventValue', type: 'uint128' },
                ],
            },
            {
                name: 'proposalCount',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalCount', type: 'uint32' },
                ],
            },
            {
                name: 'proposalConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'proposalCode',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalCode', type: 'cell' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                ],
                outputs: [
                    { name: 'platformCode', type: 'cell' },
                ],
            },
            {
                name: 'proposalVersion',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalVersion', type: 'uint16' },
                ],
            },
            {
                name: 'admin',
                inputs: [
                ],
                outputs: [
                    { name: 'admin', type: 'address' },
                ],
            },
            {
                name: 'pendingAdmin',
                inputs: [
                ],
                outputs: [
                    { name: 'pendingAdmin', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_nonce', type: 'uint32' },
        ],
        events: [
            {
                name: 'EthActions',
                inputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCreated',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { name: 'proposer', type: 'address' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                    { name: 'description', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'StakingRootUpdated',
                inputs: [
                    { name: 'oldRoot', type: 'address' },
                    { name: 'newRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedAdminTransfer',
                inputs: [
                    { name: 'oldAdmin', type: 'address' },
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'AdminTransferAccepted',
                inputs: [
                    { name: 'oldAdmin', type: 'address' },
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'EthereumActionEventConfigurationUpdated',
                inputs: [
                    { name: 'oldConfiguration', type: 'address' },
                    { name: 'newConfiguration', type: 'address' },
                    { name: 'oldDeployEventValue', type: 'uint128' },
                    { name: 'newDeployEventValue', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'newVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalConfigurationUpdated',
                inputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'oldConfig', type: 'tuple' },
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'newConfig', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalVotingDelayUpdated',
                inputs: [
                    { name: 'oldVotingDelay', type: 'uint32' },
                    { name: 'newVotingDelay', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalGracePeriodUpdated',
                inputs: [
                    { name: 'oldGracePeriod', type: 'uint32' },
                    { name: 'newGracePeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalVotingPeriodUpdated',
                inputs: [
                    { name: 'oldVotingPeriod', type: 'uint32' },
                    { name: 'newVotingPeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalThresholdUpdated',
                inputs: [
                    { name: 'oldThreshold', type: 'uint128' },
                    { name: 'newThreshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalQuorumVotesUpdated',
                inputs: [
                    { name: 'oldQuorumVotes', type: 'uint128' },
                    { name: 'newQuorumVotes', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalTimeLockUpdated',
                inputs: [
                    { name: 'oldTimeLock', type: 'uint32' },
                    { name: 'newTimeLock', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ExecutingTonActions',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
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
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'delegators', type: 'map(address,uint256[])' },
            { name: '_nonce', type: 'uint32' },
            { name: 'stakingRoot', type: 'address' },
            { name: 'ethereumActionEventConfiguration', type: 'address' },
            { name: 'deployEventValue', type: 'uint128' },
            { name: 'proposalCount', type: 'uint32' },
            { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration', type: 'tuple' },
            { name: 'proposalCode', type: 'cell' },
            { name: 'platformCode', type: 'cell' },
            { name: 'proposalVersion', type: 'uint16' },
            { name: 'admin', type: 'address' },
            { name: 'pendingAdmin', type: 'address' },
        ],
    } as const

}

export class ProposalAbi {

    static Root = {
        'ABI version': 2,
        version: '2.2',
        header: ['time'],
        functions: [
            {
                name: 'getOverview',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'proposer_', type: 'address' },
                    { name: 'description_', type: 'string' },
                    { name: 'startTime_', type: 'uint32' },
                    { name: 'endTime_', type: 'uint32' },
                    { name: 'executionTime_', type: 'uint32' },
                    { name: 'forVotes_', type: 'uint128' },
                    { name: 'againstVotes_', type: 'uint128' },
                    { name: 'quorumVotes_', type: 'uint128' },
                    { name: 'state_', type: 'uint8' },
                ],
            },
            {
                name: 'getProposer',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getActions',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'value0', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'value1', type: 'tuple[]' },
                ],
            },
            {
                name: 'getConfig',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getTimings',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                    { name: 'value1', type: 'uint32' },
                    { name: 'value2', type: 'uint32' },
                ],
            },
            {
                name: 'getVotes',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                    { name: 'value1', type: 'uint128' },
                    { name: 'value2', type: 'uint128' },
                ],
            },
            {
                name: 'getStatuses',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                    { name: 'value1', type: 'bool' },
                ],
            },
            {
                name: 'getState',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
                ],
            },
            {
                name: 'queue',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'execute',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'cancel',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'value0', type: 'uint32' },
                    { name: 'voter', type: 'address' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onActionsExecuted',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockCastedVote',
                inputs: [
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockVoteTokens',
                inputs: [
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'requestUpgrade',
                inputs: [
                    { name: 'sendGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'newVersion', type: 'uint16' },
                    { name: 'sendGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'constructor',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'root',
                inputs: [
                ],
                outputs: [
                    { name: 'root', type: 'address' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                ],
                outputs: [
                    { name: 'platformCode', type: 'cell' },
                ],
            },
            {
                name: 'id',
                inputs: [
                ],
                outputs: [
                    { name: 'id', type: 'uint32' },
                ],
            },
            {
                name: 'stakingRoot',
                inputs: [
                ],
                outputs: [
                    { name: 'stakingRoot', type: 'address' },
                ],
            },
            {
                name: 'proposer',
                inputs: [
                ],
                outputs: [
                    { name: 'proposer', type: 'address' },
                ],
            },
            {
                name: 'description',
                inputs: [
                ],
                outputs: [
                    { name: 'description', type: 'string' },
                ],
            },
            {
                name: 'tonActions',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                ],
            },
            {
                name: 'ethActions',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                ],
            },
            {
                name: 'proposalVersion',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalVersion', type: 'uint16' },
                ],
            },
            {
                name: 'config',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'config', type: 'tuple' },
                ],
            },
            {
                name: 'startTime',
                inputs: [
                ],
                outputs: [
                    { name: 'startTime', type: 'uint32' },
                ],
            },
            {
                name: 'endTime',
                inputs: [
                ],
                outputs: [
                    { name: 'endTime', type: 'uint32' },
                ],
            },
            {
                name: 'executionTime',
                inputs: [
                ],
                outputs: [
                    { name: 'executionTime', type: 'uint32' },
                ],
            },
            {
                name: 'canceled',
                inputs: [
                ],
                outputs: [
                    { name: 'canceled', type: 'bool' },
                ],
            },
            {
                name: 'executed',
                inputs: [
                ],
                outputs: [
                    { name: 'executed', type: 'bool' },
                ],
            },
            {
                name: 'forVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'forVotes', type: 'uint128' },
                ],
            },
            {
                name: 'againstVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'againstVotes', type: 'uint128' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'VoteCast',
                inputs: [
                    { name: 'voter', type: 'address' },
                    { name: 'support', type: 'bool' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Queued',
                inputs: [
                    { name: 'executionTime', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Executed',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'Canceled',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'CodeUpgradeRequested',
                inputs: [
                    { name: 'currentVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'newVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'root', type: 'address' },
            { name: 'platformCode', type: 'cell' },
            { name: 'id', type: 'uint32' },
            { name: 'stakingRoot', type: 'address' },
            { name: 'proposer', type: 'address' },
            { name: 'description', type: 'string' },
            { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
            { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
            { name: 'proposalVersion', type: 'uint16' },
            { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'config', type: 'tuple' },
            { name: 'startTime', type: 'uint32' },
            { name: 'endTime', type: 'uint32' },
            { name: 'executionTime', type: 'uint32' },
            { name: 'canceled', type: 'bool' },
            { name: 'executed', type: 'bool' },
            { name: 'forVotes', type: 'uint128' },
            { name: 'againstVotes', type: 'uint128' },
        ],
    } as const

}

export class UserDataAbi {

    static Root = {
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
                name: 'lockedTokens',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'canWithdrawVotes',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'propose',
                inputs: [
                    { name: 'proposal_data', type: 'cell' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onProposalDeployed',
                inputs: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'answer_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'voteCasted',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'rejectVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockVoteTokens',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockVoteTokens',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'success', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockCastedVotes',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_ids', type: 'uint32[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockCastedVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'success', type: 'bool' },
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
                    { components: [{ name: 'token_balance', type: 'uint128' }, { name: 'relay_lock_until', type: 'uint32' }, { name: 'current_version', type: 'uint32' }, { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'relay_eth_address', type: 'uint160' }, { name: 'eth_address_confirmed', type: 'bool' }, { name: 'relay_ton_pubkey', type: 'uint256' }, { name: 'ton_pubkey_confirmed', type: 'bool' }, { name: 'slashed', type: 'bool' }, { name: 'root', type: 'address' }, { name: 'user', type: 'address' }, { name: 'dao_root', type: 'address' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'slash',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processDeposit',
                inputs: [
                    { name: 'nonce', type: 'uint64' },
                    { name: '_tokens_to_deposit', type: 'uint128' },
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processClaimReward',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getRewardForRelayRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processGetRewardForRelayRound2',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'round_num', type: 'uint32' },
                    { name: 'code_version', type: 'uint32' },
                    { name: 'relay_round_code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRewardForRelayRound',
                inputs: [
                    { name: 'relay_round_num', type: 'uint32' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'reward', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processLinkRelayAccounts',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'confirm', type: 'bool' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'confirmTonAccount',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'processConfirmEthAccount',
                inputs: [
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'becomeRelayNextRound',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'processBecomeRelayNextRound2',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'lock_time', type: 'uint32' },
                    { name: 'min_deposit', type: 'uint128' },
                    { name: 'code_version', type: 'uint32' },
                    { name: 'election_code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'relayMembershipRequestAccepted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'lock_time', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processWithdraw',
                inputs: [
                    { name: '_tokens_to_withdraw', type: 'uint128' },
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'emergency', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTons',
                inputs: [
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
                name: 'created_proposals',
                inputs: [
                ],
                outputs: [
                    { name: 'created_proposals', type: 'map(uint32,uint128)' },
                ],
            },
            {
                name: '_tmp_proposals',
                inputs: [
                ],
                outputs: [
                    { name: '_tmp_proposals', type: 'map(uint32,uint128)' },
                ],
            },
            {
                name: 'casted_votes',
                inputs: [
                ],
                outputs: [
                    { name: 'casted_votes', type: 'map(uint32,bool)' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'RelayKeysUpdated',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'TonPubkeyConfirmed',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'EthAddressConfirmed',
                inputs: [
                    { name: 'eth_addr', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UserDataCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayMembershipRequested',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'lock_until', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundRewardClaimed',
                inputs: [
                    { name: 'relay_round_num', type: 'uint32' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'reward', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DepositProcessed',
                inputs: [
                    { name: 'tokens_deposited', type: 'uint128' },
                    { name: 'new_balance', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'VoteCast',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UnlockVotes',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UnlockCastedVotes',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCreationRejected',
                inputs: [
                    { name: 'votes_available', type: 'uint128' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'votes_available', type: 'uint128' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'current_version', type: 'uint32' },
            { name: 'platform_code', type: 'cell' },
            { name: 'token_balance', type: 'uint128' },
            { name: 'relay_lock_until', type: 'uint32' },
            { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'rewardRounds', type: 'tuple[]' },
            { name: 'relay_eth_address', type: 'uint160' },
            { name: 'eth_address_confirmed', type: 'bool' },
            { name: 'relay_ton_pubkey', type: 'uint256' },
            { name: 'ton_pubkey_confirmed', type: 'bool' },
            { name: 'slashed', type: 'bool' },
            { name: 'root', type: 'address' },
            { name: 'user', type: 'address' },
            { name: 'dao_root', type: 'address' },
            { name: '_proposal_nonce', type: 'uint32' },
            { name: 'lastExtCall', type: 'uint32' },
            { name: 'created_proposals', type: 'map(uint32,uint128)' },
            { name: '_tmp_proposals', type: 'map(uint32,uint128)' },
            { name: 'casted_votes', type: 'map(uint32,bool)' },
        ],
    } as const

}

export class BridgeAbi {

    static CreditFactory = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'admin_', type: 'address' },
                    { name: 'owners_', type: 'uint256[]' },
                    { name: 'fee', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'setCreditProcessorCode',
                inputs: [
                    { name: 'value', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'getCreditProcessorCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'setFee',
                inputs: [
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'owners', type: 'uint256[]' }, { name: 'fee', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'deployProcessorForUser',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deployProcessor',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'getCreditProcessorAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'proxyTokensTransfer',
                inputs: [
                    { name: '_tokenWallet', type: 'address' },
                    { name: '_gasValue', type: 'uint128' },
                    { name: '_amount', type: 'uint128' },
                    { name: '_recipient', type: 'address' },
                    { name: '_deployWalletValue', type: 'uint128' },
                    { name: '_remainingGasTo', type: 'address' },
                    { name: '_notify', type: 'bool' },
                    { name: '_payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'sendGas',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'value_', type: 'uint128' },
                    { name: 'flag_', type: 'uint16' },
                ],
                outputs: [],
            },
            {
                name: 'runRevertRemainderGas',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'runProcess',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'runDeriveEventAddress',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRequestEventConfigDetails',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runDeployEvent',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRequestTokenEventProxyConfig',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRequestDexPairAddress',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRequestDexVault',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runCheckEventStatus',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRetryUnwrap',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runRetrySwap',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'runSetSlippage',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                    { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'addOwner',
                inputs: [
                    { name: 'newOwner', type: 'uint256' },
                ],
                outputs: [],
            },
            {
                name: 'resetOwners',
                inputs: [],
                outputs: [],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'admin',
                inputs: [],
                outputs: [
                    { name: 'admin', type: 'address' },
                ],
            },
            {
                name: 'owners',
                inputs: [],
                outputs: [
                    { name: 'owners', type: 'uint256[]' },
                ],
            },
            {
                name: 'version',
                inputs: [],
                outputs: [
                    { name: 'version', type: 'uint32' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnerAdded',
                inputs: [
                    { name: 'newOwner', type: 'uint256' },
                ],
                outputs: [],
            },
            {
                name: 'FeeChanged',
                inputs: [
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'CreditProcessorCodeChanged',
                inputs: [
                    { name: 'hash', type: 'uint256' },
                ],
                outputs: [],
            },
            {
                name: 'DeployProcessorForUserCalled',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'admin', type: 'address' },
            { name: 'owners', type: 'uint256[]' },
            { name: 'version', type: 'uint32' },
            { name: 'fee_', type: 'uint128' },
            { name: 'creditProcessorCode', type: 'cell' },
        ],
    } as const

    static CreditProcessor = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'fee', type: 'uint128' },
                    { name: 'deployer_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getCreditEventData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onEventAddress',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [],
                outputs: [],
            },
            {
                name: 'requestEventConfigDetails',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onEventConfigDetails',
                inputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: '_basicConfiguration', type: 'tuple' },
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
                    { name: 'value2', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'requestTokenEventProxyConfig',
                inputs: [],
                outputs: [],
            },
            {
                name: 'requestDexVault',
                inputs: [],
                outputs: [],
            },
            {
                name: 'requestDexPairAddress',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onTokenRoot',
                inputs: [
                    { name: '_tokenRoot', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onWtonWallet',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onTokenWallet',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onDexVault',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onPairAddress',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'checkEventStatus',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onEthereumEventDetails',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                    { name: '_status', type: 'uint8' },
                    { name: 'value2', type: 'uint256[]' },
                    { name: 'value3', type: 'uint256[]' },
                    { name: 'value4', type: 'uint256[]' },
                    { name: 'value5', type: 'uint128' },
                    { name: 'value6', type: 'address' },
                    { name: 'value7', type: 'cell' },
                    { name: 'value8', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData_', type: 'tuple' },
                    { name: 'value1', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensMint',
                inputs: [
                    { name: '_tokenRoot', type: 'address' },
                    { name: '_amount', type: 'uint128' },
                    { name: '_remainingGasTo', type: 'address' },
                    { name: '_payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensBurn',
                inputs: [
                    { name: 'value0', type: 'uint128' },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'address' },
                    { name: 'value3', type: 'address' },
                    { name: 'value4', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'process',
                inputs: [],
                outputs: [],
            },
            {
                name: 'payDebtForUser',
                inputs: [],
                outputs: [],
            },
            {
                name: 'cancel',
                inputs: [],
                outputs: [],
            },
            {
                name: 'proxyTokensTransfer',
                inputs: [
                    { name: '_tokenWallet', type: 'address' },
                    { name: '_gasValue', type: 'uint128' },
                    { name: '_amount', type: 'uint128' },
                    { name: '_recipient', type: 'address' },
                    { name: '_deployWalletValue', type: 'uint128' },
                    { name: '_remainingGasTo', type: 'address' },
                    { name: '_notify', type: 'bool' },
                    { name: '_payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'sendGas',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'value_', type: 'uint128' },
                    { name: 'flag_', type: 'uint16' },
                ],
                outputs: [],
            },
            {
                name: 'revertRemainderGas',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onTokenWalletBalance',
                inputs: [
                    { name: 'balance', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'retryUnwrap',
                inputs: [],
                outputs: [],
            },
            {
                name: 'setSlippage',
                inputs: [
                    { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' },
                ],
                outputs: [],
            },
            {
                name: 'retrySwap',
                inputs: [],
                outputs: [],
            },
            {
                name: 'onExpectedSpentAmount',
                inputs: [
                    { name: 'expectedSpentAmount', type: 'uint128' },
                    { name: 'value1', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'receivedAmount', type: 'uint128' },
                    { name: 'senderAddress', type: 'address' },
                    { name: 'value3', type: 'address' },
                    { name: 'value4', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'onBounceTokensTransfer',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'uint128' },
                    { name: 'value2', type: 'address' },
                ],
                outputs: [],
            },
        ],
        data: [
            {
                components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], key: 1, name: 'eventVoteData', type: 'tuple',
            },
            { key: 2, name: 'configuration', type: 'address' },
        ],
        events: [
            {
                name: 'CreditProcessorDeployed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'details', type: 'tuple' },
                ],
                outputs: [],
            },
            {
                name: 'CreditProcessorStateChanged',
                inputs: [
                    { name: 'from', type: 'uint8' },
                    { name: 'to', type: 'uint8' },
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'details', type: 'tuple' },
                ],
                outputs: [],
            },
            {
                name: 'DeriveEventAddressCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestTokenEventProxyConfigCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestDexPairAddressCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestDexVaultCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestEventConfigDetailsCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'CheckEventStatusCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'GasDonation',
                inputs: [
                    { name: 'sender', type: 'address' },
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'DeployEventCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RetryUnwrapCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RetrySwapCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'SetSlippageCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'ProcessCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'CancelCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RevertRemainderGasCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
            { name: 'configuration', type: 'address' },
            { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'eventData', type: 'tuple' },
            { name: 'amount', type: 'uint128' },
            { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage_', type: 'tuple' },
            { name: 'state', type: 'uint8' },
            { name: 'prevState', type: 'uint8' },
            { name: 'eventState', type: 'uint8' },
            { name: 'deployer', type: 'address' },
            { name: 'debt', type: 'uint128' },
            { name: 'fee_', type: 'uint128' },
            { name: 'eventAddress', type: 'address' },
            { name: 'eventProxy', type: 'address' },
            { name: 'eventInitialBalance', type: 'uint128' },
            { name: 'tokenRoot', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'wtonWallet', type: 'address' },
            { name: 'dexPair', type: 'address' },
            { name: 'dexVault', type: 'address' },
            { name: 'swapAttempt', type: 'uint64' },
            { name: 'swapAmount', type: 'uint128' },
            { name: 'unwrapAmount', type: 'uint128' },
        ],
    } as const

    static EthereumEventConfiguration = {
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
                inputs: [
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setEndBlockNumber',
                inputs: [
                    { name: 'endBlockNumber', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'deployEvent',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [],
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
                name: 'onEventConfirmed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmedExtended',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
                    { name: '_meta', type: 'cell' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: 'basicConfiguration',
                inputs: [],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [],
                outputs: [
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'meta',
                inputs: [],
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
                outputs: [],
            },
            {
                name: 'NewEventContract',
                inputs: [
                    { name: 'eventContract', type: 'address' },
                ],
                outputs: [],
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
    } as const

    static EverscaleEventConfiguration = {
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
                name: 'setEndTimestamp',
                inputs: [
                    { name: 'endTimestamp', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployEvent',
                inputs: [
                    { components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'eventVoteData', type: 'tuple' },
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
                    { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
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
                    { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
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
                components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], key: 2, name: 'networkConfiguration', type: 'tuple',
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
            { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static EverscaleProxyTokenTransfer = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owner_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [],
                outputs: [
                    { name: 'API_VERSION', type: 'string' },
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventData', type: 'tuple' },
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
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'root', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }, { name: 'settingsTransferGrams', type: 'uint128' }], name: '_config', type: 'tuple' },
                    { name: '_owner', type: 'address' },
                    { name: '_received_count', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                    { name: '_token_wallet', type: 'address' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'root', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }, { name: 'settingsTransferGrams', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'root', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }, { name: 'settingsTransferGrams', type: 'uint128' }], name: '_config', type: 'tuple' },
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
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                name: 'encodeEverscaleEventData',
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
                name: 'decodeEverscaleEventData',
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
                name: '_randomNonce',
                inputs: [],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'owner',
                inputs: [],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: 'token_wallet',
                inputs: [],
                outputs: [
                    { name: 'token_wallet', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
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
            { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'root', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }, { name: 'settingsTransferGrams', type: 'uint128' }], name: 'config', type: 'tuple' },
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
                inputs: [
                    { name: 'owner_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onEventConfirmed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
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
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'value0', type: 'tuple' },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'uint128' },
                    { name: 'value3', type: 'bool' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: '_config', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'legacyTransferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'newOwner', type: 'address' },
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
                name: 'encodeEverscaleEventData',
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
                name: 'decodeEverscaleEventData',
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
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
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
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
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
                outputs: [
                ],
            },
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
            { name: '_randomNonce', type: 'uint256' },
            { name: 'owner', type: 'address' },
            { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'config', type: 'tuple' },
            { name: 'burnedCount', type: 'uint128' },
            { name: 'paused', type: 'bool' },
        ],
    } as const

    static HiddenBridgeStrategy = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'deployer_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'factory_', type: 'address' },
                    { name: 'tokenRoot_', type: 'address' },
                    { name: 'tokenWallet_', type: 'address' },
                ],
            },
            {
                name: 'onTokenWallet',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: '_tokenRoot', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'senderAddress', type: 'address' },
                    { name: 'senderWallet', type: 'address' },
                    { name: 'originalGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'buildLayer3',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'proxy', type: 'address' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'onReceiveTONsFromBridgeCallback',
                inputs: [
                    { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'decodedEventData', type: 'tuple' },
                ],
                outputs: [],
            },
            {
                name: 'factory',
                inputs: [],
                outputs: [
                    { name: 'factory', type: 'address' },
                ],
            },
            {
                name: 'tokenRoot',
                inputs: [],
                outputs: [
                    { name: 'tokenRoot', type: 'address' },
                ],
            },
            {
                name: 'tokenWallet',
                inputs: [],
                outputs: [
                    { name: 'tokenWallet', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: 'factory', type: 'address' },
            { key: 2, name: 'tokenRoot', type: 'address' },
        ],
        events: [
            {
                name: 'BurnTokens',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'user', type: 'address' },
                    { name: 'processor', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'factory', type: 'address' },
            { name: 'tokenRoot', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'deployer', type: 'address' },
        ],
    } as const

    static HiddenBridgeStrategyFactory = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'deployStrategy',
                inputs: [
                    { name: 'tokenRoot', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'buildLayer3',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'proxy', type: 'address' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'getStrategyAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'tokenRoot', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'strategyCode',
                inputs: [],
                outputs: [
                    { name: 'strategyCode', type: 'cell' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'strategyCode', type: 'cell' },
        ],
    } as const

    static TokenTransferEthereumEvent = {
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
                outputs: [
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
                name: 'encodeEverscaleEventData',
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
                name: 'decodeEverscaleEventData',
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
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'reject',
                inputs: [
                    { name: 'voteReceiver', type: 'address' },
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
                name: 'status',
                inputs: [
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
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
                name: 'getApiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
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
            {
                name: 'Confirmed',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'Rejected',
                inputs: [
                    { name: 'reason', type: 'uint32' },
                ],
                outputs: [
                ],
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
            { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
        ],
    } as const

    static TokenTransferEverscaleEvent = {
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
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
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
                name: 'encodeEverscaleEventData',
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
                name: 'decodeEverscaleEventData',
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
                name: 'getEventInitData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'value0', type: 'tuple' },
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
                inputs: [
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: '_eventInitData', type: 'tuple' },
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
                outputs: [
                    { name: 'value0', type: 'uint8' },
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
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [],
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
                name: 'getApiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
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
                inputs: [],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [],
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
                inputs: [],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
            {
                name: 'createdAt',
                inputs: [
                ],
                outputs: [
                    { name: 'createdAt', type: 'uint32' },
                ],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [
                    { name: 'signatures', type: 'map(uint256,bytes)' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], key: 1, name: 'eventInitData', type: 'tuple',
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
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
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
                inputs: [
                    { name: 'reason', type: 'uint32' },
                ],
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
            { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'eventInitData', type: 'tuple' },
            { name: 'signatures', type: 'map(uint256,bytes)' },
        ],
    } as const

}

export class MultiVaultAbi {

    static AlienProxy = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owner_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
                ],
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
                name: 'withdrawTokensByMergePool',
                inputs: [
                    { name: 'nonce', type: 'uint256' },
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint160' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmedExtended',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
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
                ],
                outputs: [],
            },
            {
                name: 'deriveAlienTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'token', type: 'uint160' },
                    { name: 'name', type: 'string' },
                    { name: 'symbol', type: 'string' },
                    { name: 'decimals', type: 'uint8' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployAlienToken',
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
                name: 'deriveMergeRouter',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'token', type: 'address' },
                ],
                outputs: [
                    { name: 'router', type: 'address' },
                ],
            },
            {
                name: 'deployMergeRouter',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deriveMergePool',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'nonce', type: 'uint256' },
                ],
                outputs: [
                    { name: 'pool', type: 'address' },
                ],
            },
            {
                name: 'upgradeMergePool',
                inputs: [
                    { name: 'pool', type: 'address' },
                ],
                outputs: [],
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
                name: 'sendMessage',
                inputs: [
                    { name: 'recipient', type: 'address' },
                    { name: 'message', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'getConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }, { name: 'alienTokenRootCode', type: 'cell' }, { name: 'alienTokenWalletCode', type: 'cell' }, { name: 'alienTokenWalletPlatformCode', type: 'cell' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }, { name: 'alienTokenRootCode', type: 'cell' }, { name: 'alienTokenWalletCode', type: 'cell' }, { name: 'alienTokenWalletPlatformCode', type: 'cell' }], name: '_config', type: 'tuple' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setManager',
                inputs: [
                    { name: '_manager', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setMergePool',
                inputs: [
                    { name: '_mergePool', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMergeRouter',
                inputs: [
                    { name: '_mergeRouter', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'setMergePoolPlatform',
                inputs: [
                    { name: '_mergePoolPlatform', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'mint',
                inputs: [
                    { name: 'token', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
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
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'manager',
                inputs: [],
                outputs: [
                    { name: 'manager', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'AlienTransfer',
                inputs: [
                    { name: 'token', type: 'uint160' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'recipient', type: 'uint160' },
                    { name: 'chainId', type: 'uint256' },
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
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }, { name: 'alienTokenRootCode', type: 'cell' }, { name: 'alienTokenWalletCode', type: 'cell' }, { name: 'alienTokenWalletPlatformCode', type: 'cell' }], name: 'config', type: 'tuple' },
            { name: 'api_version', type: 'uint8' },
            { name: 'manager', type: 'address' },
            { name: 'mergeRouter', type: 'cell' },
            { name: 'mergePool', type: 'cell' },
            { name: 'mergePoolPlatform', type: 'cell' },
            { name: 'mergePoolVersion', type: 'uint8' },
        ],
    } as const

    static EverscaleEventAlien = {
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
                inputs: [
                    { name: 'token_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
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
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'value0', type: 'tuple' },
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
                inputs: [
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: '_eventInitData', type: 'tuple' },
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
                outputs: [
                    { name: 'value0', type: 'uint8' },
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
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [],
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
                name: 'getApiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'votes',
                inputs: [],
                outputs: [
                    { name: 'votes', type: 'map(uint256,uint8)' },
                ],
            },
            {
                name: 'initializer',
                inputs: [],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
            {
                name: 'requiredVotes',
                inputs: [],
                outputs: [
                    { name: 'requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'confirms',
                inputs: [],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
            {
                name: 'createdAt',
                inputs: [],
                outputs: [
                    { name: 'createdAt', type: 'uint32' },
                ],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [
                    { name: 'signatures', type: 'map(uint256,bytes)' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], key: 1, name: 'eventInitData', type: 'tuple',
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
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
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
                inputs: [
                    { name: 'reason', type: 'uint32' },
                ],
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
            { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'eventInitData', type: 'tuple' },
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

    static EverscaleEventNative = {
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
                inputs: [
                    { name: 'name_', type: 'string' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenSymbol',
                inputs: [
                    { name: 'symbol_', type: 'string' },
                ],
                outputs: [],
            },
            {
                name: 'receiveTokenDecimals',
                inputs: [
                    { name: 'decimals_', type: 'uint8' },
                ],
                outputs: [],
            },
            {
                name: 'receiveProxyTokenWallet',
                inputs: [
                    { name: 'tokenWallet_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getDecodedData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
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
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'value0', type: 'tuple' },
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
                inputs: [
                    { name: 'voteReceiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'close',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: '_eventInitData', type: 'tuple' },
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
                outputs: [
                    { name: 'value0', type: 'uint8' },
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
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [],
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
                name: 'getApiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'votes',
                inputs: [],
                outputs: [
                    { name: 'votes', type: 'map(uint256,uint8)' },
                ],
            },
            {
                name: 'initializer',
                inputs: [],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
            {
                name: 'requiredVotes',
                inputs: [],
                outputs: [
                    { name: 'requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'confirms',
                inputs: [],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
            {
                name: 'createdAt',
                inputs: [],
                outputs: [
                    { name: 'createdAt', type: 'uint32' },
                ],
            },
            {
                name: 'signatures',
                inputs: [],
                outputs: [
                    { name: 'signatures', type: 'map(uint256,bytes)' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], key: 1, name: 'eventInitData', type: 'tuple',
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
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
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
                inputs: [
                    { name: 'reason', type: 'uint32' },
                ],
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
            { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'eventInitData', type: 'tuple' },
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
                inputs: [
                    { name: 'decimals', type: 'uint8' },
                ],
                outputs: [],
            },
            {
                name: 'setManager',
                inputs: [
                    { name: '_manager', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'removeToken',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'addToken',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setCanon',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'enableToken',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'enableAll',
                inputs: [],
                outputs: [],
            },
            {
                name: 'disableToken',
                inputs: [
                    { name: 'token', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'disableAll',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getCanon',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                    { components: [{ name: 'decimals', type: 'uint8' }, { name: 'enabled', type: 'bool' }], name: 'value1', type: 'tuple' },
                ],
            },
            {
                name: 'getTokens',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'decimals', type: 'uint8' }, { name: 'enabled', type: 'bool' }], name: '_tokens', type: 'map(address,tuple)' },
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
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'version',
                inputs: [],
                outputs: [
                    { name: 'version', type: 'uint8' },
                ],
            },
            {
                name: 'manager',
                inputs: [],
                outputs: [
                    { name: 'manager', type: 'address' },
                ],
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
            { components: [{ name: 'decimals', type: 'uint8' }, { name: 'enabled', type: 'bool' }], name: 'tokens', type: 'map(address,tuple)' },
            { name: 'manager', type: 'address' },
            { name: 'canon', type: 'address' },
        ],
    } as const

    static MergeRouter = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_manager', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setPool',
                inputs: [
                    { name: 'pool_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'setManager',
                inputs: [
                    { name: '_manager', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'disablePool',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getPool',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: '_proxy', type: 'address' },
                    { name: '_token', type: 'address' },
                    { name: '_pool', type: 'address' },
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: 'manager',
                inputs: [],
                outputs: [
                    { name: 'manager', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: 'proxy', type: 'address' },
            { key: 2, name: 'token', type: 'address' },
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
            { name: 'proxy', type: 'address' },
            { name: 'token', type: 'address' },
            { name: 'pool', type: 'address' },
            { name: 'manager', type: 'address' },
        ],
    } as const

    static NativeProxy = {
        'ABI version': 2,
        version: '2.2',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owner_', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'apiVersion',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
                ],
            },
            {
                name: 'onAcceptTokensTransfer',
                inputs: [
                    { name: 'tokenRoot', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'value2', type: 'address' },
                    { name: 'value3', type: 'address' },
                    { name: 'remainingGasTo', type: 'address' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'onEventConfirmedExtended',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                    { name: 'meta', type: 'cell' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }], name: '_config', type: 'tuple' },
                    { name: 'remainingGasTo', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
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
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [],
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
                name: 'NativeTransfer',
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
            { components: [{ name: 'everscaleConfiguration', type: 'address' }, { name: 'evmConfigurations', type: 'address[]' }, { name: 'deployWalletValue', type: 'uint128' }], name: 'config', type: 'tuple' },
            { name: 'api_version', type: 'uint8' },
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
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
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
                outputs: [],
            },
            {
                name: 'setWalletCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
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
                outputs: [],
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
                outputs: [],
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
                inputs: [
                    { name: 'to', type: 'address' },
                ],
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

export class TokenAbi {

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

export class TonAirdrop {

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

export class MigrationTokenAbi {

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
